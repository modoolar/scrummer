# Copyright 2017 - 2018 Modoolar <info@modoolar.com>
# License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

from odoo import models, fields, api


class ProjectTaskWorklogWizard(models.TransientModel):
    _inherit = 'project.task.worklog.wizard'

    category_id = fields.Many2one(
        comodel_name='project.timesheet.category',
        default=lambda self: self.env.user.default_timesheet_category_id,
        string='Category',
        required=True,
    )

    billable = fields.Selection(
        selection=[
            ('yes', 'Yes'),
            ('no', 'No'),
        ],
        default='yes',
        required=True,
        string='Billable'
    )

    @api.onchange("category_id")
    def onchange_category(self):
        if self.category_id:
            self.billable = self.category_id.billable

    def _prepare_worklog(self):
        data = super(ProjectTaskWorklogWizard, self)._prepare_worklog()

        data['category_id'] = self.category_id.id
        data['billable'] = self.billable

        return data
