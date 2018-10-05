// Copyright 2017 - 2018 Modoolar <info@modoolar.com>
// License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

odoo.define('scrummer.main', function (require) {
    "use strict";
    const AgileLayout = require('scrummer.layout');
    const core = require('web.core');

    core.action_registry.add('scrummer', AgileLayout.AgileLayout);

});
