// Copyright 2017 - 2018 Modoolar <info@modoolar.com>
// License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

odoo.define('scrummer.dataset', function (require) {
    "use strict";

    const web_data = require('web.data');

    web_data.DataSetSearch.include({
        /**
         *
         * @param {String} name name to perform a search for/on
         * @param {Array} [domain=[]] filters for the objects returned, Odoo domain
         * @param {String} [operator='ilike'] matching operator to use with the provided name value
         * @param {Number} [limit=0] maximum number of matches to return
         * @param {Function} order function to call with name_search result
         * @returns {$.Deferred}
         */
        id_search: function (name, domain, operator, limit, order) {
            /* eslint-disable-next-line no-shadow */
            return $.when(name, domain, operator, limit, order).then((name, domain, operator, limit, order) => this._model.call('id_search', {
                name: name || '',
                args: domain || false,
                operator: operator || 'ilike',
                context: this.get_context(),
                limit: limit || 0,
                order: order || ''
            }));
        },

        /**
         * @override Enabling options.context
         */
        create: function (data, options = {}) {
            return this._model.call('create', [data], {
                context: this.get_context(options.context)
            }).done(() => this.trigger('dataset_changed', data, options));
        },
    });

    const datasets = new Map();
    const get = function (dataset) {
        if (datasets.has(dataset)) {
            return datasets.get(dataset);
        }

        const ds = new web_data.DataSetSearch(null, dataset);
        // monkey patch methods needed to work with defered params
        ds._read_slice = ds.read_slice;
        ds.read_slice = function (fields, options = {}) {
            const {domain, offset, limit, sort, context} = options;
            /* eslint-disable-next-line no-shadow */
            return $.when(fields, domain, offset, limit, sort, context).then((fields, domain, offset, limit, sort, context) => this._read_slice(fields, Object.assign(options, {
                domain,
                offset,
                limit,
                sort,
                context
            })));
        }.bind(ds);
        ds._name_search = ds.name_search;
        ds.name_search = function (name, domain, operator, limit) {
            /* eslint-disable-next-line no-shadow */
            return $.when(domain, operator, limit).then((domain, operator, limit) => this._name_search(name, domain, operator, limit));
        }.bind(ds);
        datasets.set(dataset, ds);
        return ds;

    };

    return {
        get
    };
});
