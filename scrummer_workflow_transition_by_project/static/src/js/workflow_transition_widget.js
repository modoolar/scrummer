// Copyright 2017 - 2018 Modoolar <info@modoolar.com>
// License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

odoo.define(function (require) {
    "use strict";

    require('scrummer.view.task').WorkflowTransitionsWidget.include({

        getAllowedTransitions() {
            let transitions = this._super();
            let projects = [this.taskWidget._model.project_id[0]];
            return _.filter(transitions,
                t => !(_.size(t.project_ids) > 0 && _.size(_.intersection(projects, t.project_ids)) == 0));
        },

    });
});
