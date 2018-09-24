# Copyright 2017 - 2018 Modoolar <info@modoolar.com>
# License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

from odoo import models, fields, api, exceptions, _


class Sprint(models.Model):
    _inherit = ['project.agile.scrum.sprint']
    _implements_syncer = True

    name = fields.Char(scrummer=True)
    description = fields.Html(scrummer=True)
    start_date = fields.Datetime(scrummer=True)
    end_date = fields.Datetime(scrummer=True)
    actual_end_date = fields.Datetime(scrummer=True)
    total_story_points = fields.Integer(scrummer=True)
    state = fields.Selection(scrummer=True)
    velocity = fields.Integer(scrummer=True)
    task_count = fields.Integer(scrummer=True)
    order = fields.Float(scrummer=True)
    active = fields.Boolean(scrummer=True)
    task_ids = fields.One2many(
        comodel_name="project.task",
        scrummer=True
    )
    team_id = fields.Many2one(
        comodel_name='project.agile.team',
        scrummer=True
    )

    @api.multi
    def open_in_scrummer(self):
        self.ensure_one()

        if self.state == 'completed':
            raise exceptions.ValidationError(_(
                "Only future or active sprint can be opened in Scrummer!"
            ))

        view_type = 'sprint' if self.state == 'active' else 'backlog'

        return {
            'type': 'ir.actions.act_url',
            'target': 'self',
            'url': "/scrummer/web#page=board&view=%s" % view_type
        }
