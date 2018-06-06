# Copyright 2017 - 2018 Modoolar <info@modoolar.com>
# License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

from odoo import models, fields, api


class TimesheetCategory(models.Model):
    _name = 'project.timesheet.category'
    _order = 'name'

    name = fields.Char(string="Name", required=True)
    code = fields.Char(
        string="Code",
        default='N/A',
        required=True
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

    description = fields.Html(
        string="Description",
        required=False,
    )
    active = fields.Boolean(
        string='Active',
        default=True,
    )
