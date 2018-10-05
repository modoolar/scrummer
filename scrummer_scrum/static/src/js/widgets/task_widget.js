// Copyright 2017 - 2018 Modoolar <info@modoolar.com>
// License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

odoo.define('scrummer.widget.task.scrum_extension', function (require) {
    "use strict";

    const TaskWidget = require('scrummer.widget.task').TaskWidget;
    const DataServiceFactory = require('scrummer.data_service_factory');


    TaskWidget.include({
        renderElement() {
            this._super();
            if(this._model.sprint_ids.length > 1){
                DataServiceFactory.get("project.agile.scrum.sprint").getRecords(this._model.sprint_ids).then((sprints)=>{
                    const sprintContainer = this.$("[data-field='sprint_ids']");
                    for (const sprint of sprints) {
                        sprintContainer.append($(`<span class="agile-tag">${sprint.name}</span>`));
                    }
                    this.$("[data-field-name='sprint_ids']").show();
                });
            }
        }
    });

});
