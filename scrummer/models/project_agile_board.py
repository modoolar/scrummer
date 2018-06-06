# Copyright 2017 - 2018 Modoolar <info@modoolar.com>
# License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

from odoo import models, fields


class Board(models.Model):
    _inherit = 'project.agile.board'

    name = fields.Char(scrummer=True)
    description = fields.Char(scrummer=True)
    type = fields.Selection(scrummer=True)
    project_ids = fields.Many2many(
        comodel_name="project.project",
        scrummer=True,
    )
    column_ids = fields.One2many(
        comodel_name="project.agile.board.column",
        scrummer=True,
    )
    unmapped_state_ids = fields.One2many(
        comodel_name='project.workflow.state',
        scrummer=True,
    )
    unmapped_task_stage_ids = fields.One2many(
        comodel_name='project.task.type',
        scrummer=True,
    )
    board_task_type_ids = fields.Many2many(
        comodel_name='project.task.type2',
        scrummer=True,
    )
    backlog_task_type_ids = fields.Many2many(
        comodel_name='project.task.type2',
        scrummer=True,
    )
