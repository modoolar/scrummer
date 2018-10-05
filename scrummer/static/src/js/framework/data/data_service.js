"use strict";
// Copyright 2017 - 2018 Modoolar <info@modoolar.com>
// License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

odoo.define('scrummer.DataService', function (require) {

    const core = require('scrummer.core');
    const data = require('scrummer.data');
    const web_core = require('web.core');
    const AgileMixins = require('scrummer.mixins');
    const concurrency = require('web.concurrency');

    /* eslint-disable no-bitwise */
    function generate_uuid() {
        let uuid = "";
        for (let i = 0; i < 32; i++) {
            const random = Math.random() * 16 | 0;

            if (i === 8 || i === 12 || i === 16 || i === 20) {
                uuid += "-";
            }
            uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16);
        }
        return uuid;
    }

    /* eslint-enable no-bitwise */

    // TODO: Here we should implement some GC algorithm and maybe cache sharing between tabs.
    // Problem id: 60a91bed-b6ed-48cc-80db-69152e31cd12
    const DataService = web_core.Class.extend(AgileMixins.RequireMixin, {
        __dataService: true,
        readonly: true,
        init(options) {
            Object.assign(this, options);
            this._require_prop("model");
            // Fields list is being fetched from model_info, which means that all fields defined with with scrummer=True are being fetched
            this.modelMetaLoaded = data.cache.get("model_info", {model: this.model}).then((model) => {
                this.modelMeta = model;
                this.onModelMetaLoaded();
            });
            this.dataset = data.getDataSet(this.model);
            // Records are being cached in Map <id,record>
            this.records = new Map();
            this.mutex = new concurrency.Mutex();

        },
        onModelMetaLoaded() {
            if (this.modelMeta.sync) {
                this.subscribeToChanges();
            }
        },
        _filterRecords(ids, toMap) {
            if (!ids) {
                return toMap ? new Map(this.records) : [...this.records.values()];
            }
            if (toMap) {
                const result = new Map();
                ids.forEach((id) => result.set(id, this.records.get(id)));
                return result;
            }
            const result = [];
            ids.forEach((id) => result.push(this.records.get(id)));
            return result;
        },
        _getRecords(ids, toMap) {

            const misses = ids.filter((id) => !this.records.has(id));
            if (misses.length) {
                return this.modelMetaLoaded.then(() => this.dataset.read_ids(misses, this.modelMeta.fields_list).then((records) => {
                    records.forEach((record) => {
                        this.records.set(record.id, this.wrapRecord(record));
                    });
                    return this._filterRecords(ids, toMap);
                }));
            }
            const result = [];
            ids.forEach((id) => result.push(this.records.get(id)));
            return $.when(this._filterRecords(ids, toMap));


        },

        getRecords(ids, toMap) {
            return this.mutex.exec(() => this._getRecords(ids, toMap));
        },

        getAllRecords(toMap = false, fetchAgain = false) {
            return this.mutex.exec(() => {
                // Prevent calling read_slice everytime, only if fetchAgain is true, we will get IDs that are not cached from the server.
                if (!this.allRecordsPromise || fetchAgain) {
                    this.allRecordsPromise = this.modelMetaLoaded.then(() => {
                        const cachedIds = [...this.records.keys()];
                        return this.dataset.read_slice(this.modelMeta.fields_list, {
                            domain: [['id', 'not in', cachedIds]]
                        }).then((records) => {
                            records.forEach((record) => {
                                this.records.set(record.id, this.wrapRecord(record));
                            });
                            return this._filterRecords(null, toMap);
                        });
                    });
                }
                return this.allRecordsPromise;
            });
        },
        getRecord(id) {
            return this.mutex.exec(() => {
                const def = $.Deferred();
                if (this.records.has(id)) {
                    def.resolve(this.records.get(id));
                } else {
                    this._getRecords([id]).then((res) => {
                        def.resolve(res[0]);
                    });
                }
                return def.promise();
            });
        },

        updateRecord(ids) {
            return this.mutex.exec(() => this.dataset.read_ids(ids, this.modelMeta.fields_list).then((records) => {
                for (const record of records) {
                    if (this.records.has(record.id)) {
                        const proxy = this.records.get(record.id);
                        proxy.update(record);
                    } else {
                        console.error("Calling update on record that isn't being cached. Use getRecord first.");
                    }
                }
                return $.when();
            }));
        },
        wrapRecord(record) {
            const fields = this.modelMeta.fields;
            const readonly = this.readonly;
            const service = this;
            let editPromise = false;
            record._source = record;
            record._previous = null;
            record._custom = {};
            record._uuid = generate_uuid();

            record.copy = function () {
                const previous = Object.assign({}, this._source);
                delete previous._previous;
                delete previous._source;
                return previous;
            };

            record.update = function (values) {
                this._previous = this.copy();
                this._source = Object.assign(this._source, values);
            };

            return new Proxy(record, {
                set(trapTarget, key, value, receiver) {
                    if (key === "id") {
                        throw new TypeError("You are not allowed to change records id", arguments);
                    }
                    if (readonly && !["_previous", "_source"].includes(key)) {
                        throw new TypeError("DataService is declared as readonly, you can not write to it's records", arguments);
                    }
                    const field = fields[key] || {};
                    // If field is persistable, send write request to server.
                    if (Object.keys(fields).includes(key)) {
                        // Since many2one fields return [id,name] array, make sure not to compare arrays
                        const writeValue = field.type === "many2one" && Array.isArray(value) ? value[0] : value;
                        const receiverValue = field.type === "many2one" ? receiver[key][0] : receiver[key];
                        if (writeValue === receiverValue) {
                            return Reflect.set(trapTarget, value, receiver);
                        }
                        !field.readonly && service.dataset.write(trapTarget.id, {[key]: writeValue})
                            .fail((r) => console.error(`Error ${service.dataset.model} [${trapTarget.id}]: ${key} - ${value}`, r));
                        // Do not change value because _previous will contain wrong value afterwards
                        return Reflect.set(trapTarget, key, trapTarget[key], receiver);
                    }
                    return Reflect.set(trapTarget, key, value, receiver);
                },
                get(trapTarget, key, receiver) {
                    if (key === "promise") {
                        return;
                    }

                    const proxyRecord = trapTarget;
                    // Sign that it is data_service
                    if (key === "_is_dataservice") {
                        return true;
                    }
                    if (key === "_edit") {
                        return function (promise) {
                            if (promise === "check") {
                                return editPromise && editPromise.state() === "pending";
                            } else if (typeof promise !== 'undefined') {
                                editPromise = promise;
                            }
                            return editPromise;
                        };
                    }
                    // If target doesn't contain `key` property, assume it is function.
                    if (!(key in receiver)) {
                        // Wrap function in a Proxy that will catch arguments
                        /* eslint-disable-next-line no-empty-function*/
                        return new Proxy(() => {
                        }, {
                            apply: function (functionTarget, thisArg, argumentList) {
                                let context = service.dataset.get_context().eval();
                                if (argumentList.length > 0) {
                                    const argument = argumentList[argumentList.length - 1];
                                    if (argument.context) {
                                        context = Object.assign(argument.context, context);
                                        argumentList.length--;
                                    }
                                }

                                return service.dataset._model.call(key, [[proxyRecord.id], ...argumentList], {context: context});
                            }
                        });
                    }

                    return Reflect.get(trapTarget, key, receiver);
                }
            });
        },
        subscribeToChanges() {
            data.sync.subscribe(odoo.session_info.db + ":" + this.model, (notification) => {
                const id = notification[0][2];
                const payload = notification[1];
                switch (notification[1].method) {
                    case "write": {
                        this.recordUpdated(id, payload.data, payload);
                        break;
                    }
                    case "create": {
                        this.recordCreated(id, payload.data, payload);
                        break;
                    }
                    case "unlink": {
                        const task = this.records.get(id);
                        if (task) {
                            this.records.delete(id);
                            payload.data = task;
                            this.recordDeleted(id, payload);
                        }
                        break;
                    }
                }
            });
        },
        recordUpdated(id, vals, payload) {
            const record = this.records.get(id);

            if (record) {
                record.update(vals);
                core.bus.trigger(this.model + ":write", id, vals, payload, record);
            }
        },
        recordCreated(id, vals, payload) {
            core.bus.trigger(this.model + ":create", id, vals, payload);
        },
        recordDeleted(id, payload) {
            core.bus.trigger(this.model + ":unlink", id, payload);
        },
        /**
         * Call this method to dinamically add new fields in runtime.
         * @param {String[]} fields - Name of fields to be dinamically added to DataService.
         * @deprecated
         */
        addFields(fields) {
            if (this.records.size) {
                const newFields = fields.filter((field) => !this.fields.includes(field));
                this.fields.push.apply(this.fields, newFields);
                this.dataset.read_slice(newFields, {domain: [["id", "in", [...this.records.keys()]]]}).then((updates) => {
                    updates.forEach((update) => {
                        const record = this.records.get(update.id);
                        Object.assign(record._source, update);
                    });
                });
            }
        },
        setReadonly(readonly) {
            if (typeof readonly !== "undefined") {
                this.readonly = readonly;
            }
            return this;
        }
    });
    return DataService;
});
