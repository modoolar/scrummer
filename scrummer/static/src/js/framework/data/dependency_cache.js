// Copyright 2017 - 2018 Modoolar <info@modoolar.com>
// License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

odoo.define('scrummer.dependency_cache', function (require) {
    "use strict";

    const core = require('web.core');
    const AgileMixins = require('scrummer.mixins');
    const DataSet = require('scrummer.dataset');

    const DependencyCache = core.Class.extend({

        init() {
            this.deps = {};
        },

        orderedStringify(obj) {
            const copy = {};
            if (typeof obj !== "object") {
                return "";
            }
            Object.keys(obj).sort((a, b) => a > b).forEach((key) => {
                copy[key] = obj[key];
            });
            return JSON.stringify(copy);
        },
        // TODO: Here we should implement some GC algorithm and maybe cache sharing between tabs.
        // Problem id: 60a91bed-b6ed-48cc-80db-69152e31cd12
        invokeOnceFactory(Dependency, options) {
            const invoked = new Map();
            return (params) => {
                const optionsStringified = this.orderedStringify(params);
                if (!invoked.get(optionsStringified)) {
                    const dep = new Dependency(this, options, params);
                    invoked.set(optionsStringified, dep);
                    dep.resolve();
                }
                return invoked.get(optionsStringified).promise();
            };
        },

        add(name, dependency, options) {
            this.deps[name] = this.invokeOnceFactory(dependency, options);
        },

        get(name, params) {
            return this.deps[name](params);
        },

        has(name) {
            return name in this.deps;
        }

    });
    const AbstractDependency = core.Class.extend(AgileMixins.RequireMixin, {
        init(cache, options, params) {
            Object.assign(this, options);
            this.cache = cache;
            this.params = params;
            this.deferred = $.Deferred();
            this.getDataSet = DataSet.get;
        },
        /**
         * This method must be overridden and it should resolve/reject deferred with appropriate data.
         */
        resolve() {
            throw new Error("Not implemented!");
        },
        promise() {
            return this.deferred.promise();
        }
    });

    return {
        DependencyCache,
        AbstractDependency,
    };
});
