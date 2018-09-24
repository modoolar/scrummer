# Copyright 2017 - 2018 Modoolar <info@modoolar.com>
# License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

from odoo import models, fields, api


class ProjectAgileBoard(models.Model):
    _inherit = 'project.agile.board'

    kanban_initial_column_id = fields.Many2one(
        comodel_name="project.agile.board.column",
        scrummer=True,
    )

    kanban_initial_column_status_ids = fields.One2many(
        comodel_name='project.agile.board.kanban.initial.column.status',
        scrummer=True,
    )

    kanban_initial_column_stage_ids = fields.One2many(
        comodel_name='project.task.type',
        compute="_compute_kanban_initial_column_stage_ids",
        scrummer=True,
    )

    kanban_backlog_state_ids = fields.One2many(
        comodel_name='project.agile.board.kanban.backlog.state',
        scrummer=True,
    )

    kanban_backlog_stage_ids = fields.One2many(
        comodel_name='project.task.type',
        compute="_compute_kanban_backlog_stage_ids",
        scrummer=True,
    )

    @api.depends(
        "kanban_initial_column_status_ids",
        "kanban_initial_column_status_ids.stage_id"
    )
    def _compute_kanban_initial_column_stage_ids(self):
        for rec in self:
            rec.kanban_initial_column_stage_ids = \
                rec.mapped("kanban_initial_column_status_ids.stage_id")

    @api.depends(
        "kanban_backlog_state_ids",
        "kanban_backlog_state_ids.state_id",
        "kanban_backlog_state_ids.state_id.stage_id"
    )
    def _compute_kanban_backlog_stage_ids(self):
        for rec in self:
            rec.kanban_backlog_stage_ids = \
                rec.mapped("kanban_backlog_state_ids.state_id.stage_id")


class AgileBoardColumnStatus(models.Model):
    _inherit = 'project.agile.board.kanban.initial.column.status'

    status_id = fields.Many2one(
        scrummer=True,
    )

    stage_id = fields.Many2one(
        scrummer=True,
    )

    workflow_id = fields.Many2one(
        scrummer=True,
    )


class AgileBoardKanbanBacklogState(models.Model):
    _inherit = 'project.agile.board.kanban.backlog.state'

    state_id = fields.Many2one(
        scrummer=True,
    )

    stage_id = fields.Many2one(
        scrummer=True,
    )

    workflow_id = fields.Many2one(
        scrummer=True,
    )
