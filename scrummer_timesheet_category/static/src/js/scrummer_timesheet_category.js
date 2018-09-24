// Copyright 2017 - 2018 Modoolar <info@modoolar.com>
// License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

odoo.define(function (require) {

    const AgileModals = require('scrummer.widget.modal');
    const Many2One = require('scrummer.widget.many2one').Many2One;
    const DataServiceFactory = require('scrummer.data_service_factory');
    const TaskWidget = require('scrummer.widget.task').TaskWidget;
    const TimeSheetListItem = require('scrummer.widget.task').TimeSheetListItem;

    TimeSheetListItem.include({
        updateWorklog(worklog){
            this._super(worklog);
            this.$(".is-billable").text(this.record.billable == 'yes' ? 'Yes' : 'No');
        },
    });

    TaskWidget.include({
        start(){
            this._super();

            // Apply security rules
            data.session.user_has_group("project_timesheet_category.group_timesheet_billable").then(function(result) {
                if (!result){
                    this.$('.is-billable').hide();
                }
            }.bind(this));
        },
    });

    AgileModals.WorkLogModal.include({
        start(){
            let self = this;

            this.category = new Many2One(this, {
                label: _("Timesheet category"),
                model: "project.timesheet.category",
                field_name: "category_id",
                changeHandler(evt) {
                    DataServiceFactory.get("project.timesheet.category").getRecord(parseInt(evt.target.value)).then(record => {
                        self.timesheetCategoryChanged(record, false);
                    });
                },
                default: this.edit && this.edit.category_id ? {
                    id: this.edit.category_id[0],
                    name: this.edit.category_id[1]
                } : this.getUsersDefaultTimesheetCategory()
            });
            this.category.insertAfter(this.$("#category_anchor"));

            this.getUsersDefaultTimesheetCategory().then(categ => {
               self.timesheetCategoryChanged(categ, true);
            });

             // Apply security rules
            data.session.user_has_group("project_timesheet_category.group_timesheet_billable").then(function(result){
                if (!result){
                    this.$('.is-billable').hide();
                }
            }.bind(this));

            return this._super();
        },

        loadData(worklog) {
            this._super(worklog);
            worklog.billable = this.is_billable()
        },

        populateFieldValues(){
            this._super();
            this.$('#is-billable-check').prop("checked", this.edit.billable == "yes");
        },

        getUsersDefaultTimesheetCategory() {
            return data.cache.get("current_user").then(user => {
                if (user.default_timesheet_category_id){
                    return DataServiceFactory.get("project.timesheet.category").getAllRecords(true).then(categs => {
                        let categ = categs.get(user.default_timesheet_category_id[0]);
                        return categ;
                    })

                } else {
                    return undefined;
                }

                // return user.default_timesheet_category_id ? {
                //     id: user.default_timesheet_category_id[0],
                //     name: user.default_timesheet_category_id[1]
                // } : undefined;
            });
        },

        is_billable(){
            return this.$('#is-billable-check').prop("checked") ? 'yes' : 'no';
        },

        timesheetCategoryChanged(category, is_default) {
            // let shouldAssign = category && (!this.edit || (this.edit && !is_default));

            if (category){

                if (!this.edit || !is_default) {
                    this.$('#is-billable-check').prop('checked', category.billable == 'yes');
                    // this.$('#is-billable-check').prop('checked', category.billable == 'yes');
                } else {
                    this.$('#is-billable-check').prop('checked', this.edit.billable == 'yes');
                    // this.$('#is-billable-check').prop('checked', this.edit.billable == 'yes');
                }
            }


        },

    });
});