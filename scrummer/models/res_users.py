# Copyright 2017 - 2018 Modoolar <info@modoolar.com>
# License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

from odoo import models, fields


class Users(models.Model):
    _inherit = "res.users"

    name = fields.Char(scrummer=True)
    write_date = fields.Datetime(scrummer=True)
    partner_id = fields.Many2one(
        comodel_name='res.partner',
        scrummer=True
    )
    team_ids = fields.Many2many(
        comodel_name='project.agile.team',
        scrummer=True,
    )
    team_id = fields.Many2one(
        comodel_name="project.agile.team",
        scrummer=True,
    )
