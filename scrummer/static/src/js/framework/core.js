// Copyright 2017 - 2018 Modoolar <info@modoolar.com>
// License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

odoo.define('scrummer.core', function (require) {
    "use strict";
    const Bus = require('web.Bus');

    const bus = new Bus();

    return {
        bus,
    };
});
