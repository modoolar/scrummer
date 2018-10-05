// Copyright 2017 - 2018 Modoolar <info@modoolar.com>
// License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

odoo.define('scrummer.storage_service', function (require) {
    "use strict";

    const core = require('web.core');
    const mixins = require('web.mixins');

    const StorageService = core.Class.extend(mixins.EventDispatcherMixin, {
        init(prefix) {
            mixins.EventDispatcherMixin.init.call(this);
            this.prefix = prefix + "_";
        },
        /*
         * set,get and delete are simulation of Properties mixin,
         * but set/delete trigger change event only if value changes,
         * and returns object with oldValue & newValue
         */
        set(key, val) {
            const keyWithPrefix = this.prefix + key;
            const currentVal = window.localStorage.getItem(keyWithPrefix);
            const value = typeof val === "object" ? JSON.stringify(val) : val;
            if (currentVal !== value) {
                const tmp = currentVal;
                window.localStorage.setItem(keyWithPrefix, value);
                if (tmp !== value) {
                    this.trigger("change:" + key, this, {
                        oldValue: tmp,
                        newValue: value
                    });
                }
            }
        },
        delete(key) {
            const keyWithPrefix = this.prefix + key;
            const currentVal = window.localStorage.getItem(keyWithPrefix);
            if (currentVal !== null) {
                const tmp = this.currentVal;
                window.localStorage.removeItem(keyWithPrefix);
                if (typeof tmp !== "undefined" && tmp !== null) {
                    this.trigger("change:" + key, this, {
                        oldValue: tmp,
                        newValue: null
                    });
                }
            }
        },
        get(key) {
            const keyWithPrefix = this.prefix + key;
            const currentVal = window.localStorage.getItem(keyWithPrefix);
            return this._isJsonString(currentVal) ? JSON.parse(currentVal) : currentVal;
        },
        _isJsonString(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }

    });

    return new StorageService("scrummer");
});
