# Copyright 2017 - 2018 Modoolar <info@modoolar.com>
# License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

from odoo import models, fields, api


class AccountAnalyticLine(models.Model):
    _inherit = 'account.analytic.line'

    category_id = fields.Many2one(
        comodel_name='project.timesheet.category',
        string='Category',
        default=lambda self: self.env.user.default_timesheet_category_id,
    )

    billable = fields.Selection(
        selection=[
            ('yes', 'Yes'),
            ('no', 'No'),
        ],
        string='Billable',
        required=True,
        default='yes',
    )

    @api.onchange("user_id")
    def default_category_id(self):
        def_categ_id = self.user_id.default_timesheet_category_id
        if self.user_id and def_categ_id:
            self.category_id = def_categ_id.id
            self.billable = def_categ_id.billable
        else:
            self.category_id = False

    @api.onchange("category_id")
    def onchange_category(self):
        if self.category_id:
            self.billable = self.category_id.billable
