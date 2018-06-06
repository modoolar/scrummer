# Copyright 2017 - 2018 Modoolar <info@modoolar.com>
# License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

from odoo import models, fields, api


class AgileTeam(models.Model):
    _inherit = 'project.agile.team'

    name = fields.Char(scrummer=True)
    description = fields.Html(scrummer=True)
    type = fields.Selection(scrummer=True)
    email = fields.Char(scrummer=True)
    default_hrs = fields.Float(scrummer=True)
    member_ids = fields.Many2many(
        comodel_name='res.users',
        scrummer=True
    )
    project_ids = fields.Many2many(
        comodel_name='project.project',
        scrummer=True
    )
    product_owner_ids = fields.One2many(
        comodel_name='res.users',
        scrummer=True
    )
    workflow_id = fields.Many2one(
        comodel_name='project.workflow',
        scrummer=True
    )

    @api.multi
    def open_in_scrummer(self):
        self.ensure_one()
        return {
            'type': 'ir.actions.act_url',
            'target': 'self',
            'url': "/scrummer/web"
        }
