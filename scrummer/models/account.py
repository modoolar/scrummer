# Copyright 2017 - 2018 Modoolar <info@modoolar.com>
# License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

from odoo import models, fields


class AccountAnalyticLine(models.Model):
    _inherit = 'account.analytic.line'

    name = fields.Char(scrummer=True)
    date = fields.Date(scrummer=True)
    amount = fields.Monetary(scrummer=True)
    unit_amount = fields.Float(scrummer=True)
    user_id = fields.Many2one(scrummer=True)
