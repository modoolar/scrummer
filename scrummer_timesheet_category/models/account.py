# Copyright 2017 - 2018 Modoolar <info@modoolar.com>
# License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

from odoo import models, fields


class TimesheetCategory(models.Model):
    _inherit = 'project.timesheet.category'

    name = fields.Char(scrummer=True)
    description = fields.Html(scrummer=True)
    active = fields.Boolean(scrummer=True)
    billable = fields.Selection(scrummer=True)


class AccountAnalyticLine(models.Model):
    _inherit = 'account.analytic.line'

    category_id = fields.Many2one(scrummer=True)
    billable = fields.Selection(scrummer=True)
