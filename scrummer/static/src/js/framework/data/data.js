// Copyright 2017 - 2018 Modoolar <info@modoolar.com>
// License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

odoo.define('scrummer.data', function (require) {
    "use strict";
    const DataSet = require('scrummer.dataset');
    const bus = require('bus.bus');
    const session = require('web.session');
    const Syncer = require('web.syncer').Syncer;
    const DependencyCache = require('scrummer.dependency_cache');
    const cache = new DependencyCache.DependencyCache();
    const getMessages = function (model, res_id, type, subtype=undefined, fields=undefined) {
        return session.rpc('/scrummer/messages',{model: model, res_id: res_id, message_type: type, message_subtype: subtype, fields: fields});
    };
    const getImage = function (model, id, last_update, field = "image_small") {
        return session.url('/web/image', {
            model, id, field,
            unique: (last_update || '').replace(/[^0-9]/g, '')
        });
    };
    const getTaskLinks = function (taskId) {
        return session.rpc(`/scrummer/web/data/task/${taskId}/get_task_links`, {context: {task_id: taskId}})
    };

    window.data = {
        cache,
        getDataSet: DataSet.get,
        getMessages,
        getImage,
        getTaskLinks,
        session,
        bus,
        sync: new Syncer()
    };
    return window.data;
});
