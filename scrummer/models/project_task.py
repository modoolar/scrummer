# Copyright 2017 - 2018 Modoolar <info@modoolar.com>
# License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

from odoo import models, fields, api


class TaskResolution(models.Model):
    _inherit = 'project.task.resolution'

    name = fields.Char(scrummer=True)


class ProjectTaskLinkRelation(models.Model):
    _inherit = "project.task.link.relation"

    name = fields.Char(scrummer=True)
    inverse_name = fields.Char(scrummer=True)
    sequence = fields.Integer(scrummer=True)


class ProjectTaskLink(models.Model):
    _inherit = "project.task.link"
    _description = "Project Task Link"

    name = fields.Char(scrummer=True)
    comment = fields.Char(scrummer=True)
    relation_name = fields.Char(scrummer=True)
    relation_id = fields.Many2one(
        comodel_name="project.task.link.relation",
        scrummer=True
    )

    task_left_id = fields.Many2one(
        comodel_name="project.task",
        scrummer=True,
    )

    task_right_id = fields.Many2one(
        comodel_name="project.task",
        scrummer=True,
    )

    related_task_id = fields.Many2one(
        comodel_name="project.task",
        scrummer=True,
    )


class TaskType(models.Model):
    _inherit = 'project.task.type2'

    allow_story_points = fields.Boolean(scrummer=True)
    allow_sub_tasks = fields.Boolean(scrummer=True)
    priority_ids = fields.Many2many(
        comodel_name='project.task.priority',
        scrummer=True
    )
    default_priority_id = fields.Many2one(
        comodel_name='project.task.priority',
        scrummer=True
    )
    type_ids = fields.Many2many(
        comodel_name='project.task.type2',
        scrummer=True
    )


class TaskPriority(models.Model):
    _inherit = 'project.task.priority'

    type_ids = fields.Many2many(
        comodel_name='project.task.type2',
        scrummer=True,
    )


class Task(models.Model):
    _inherit = 'project.task'
    _implements_syncer = True

    name = fields.Char(scrummer=True)
    key = fields.Char(scrummer=True)
    effective_hours = fields.Float(scrummer=True)
    planned_hours = fields.Float(scrummer=True)
    description = fields.Html(scrummer=True)
    color = fields.Integer(scrummer=True)
    date_deadline = fields.Date(scrummer=True)
    wkf_state_type = fields.Selection(scrummer=True)
    allow_story_points = fields.Boolean(scrummer=True)
    is_user_story = fields.Boolean(scrummer=True)
    is_epic = fields.Boolean(scrummer=True)
    create_date = fields.Datetime(scrummer=True)
    write_date = fields.Datetime(scrummer=True)
    allow_sub_tasks = fields.Boolean(scrummer=True)
    story_points = fields.Integer(scrummer=True)
    agile_order = fields.Float(scrummer=True)
    link_ids = fields.One2many(
        comodel_name="project.task.link",
        scrummer=True,
        syncer={'inverse_names': ['task_left_id', 'task_right_id']},
    )
    project_id = fields.Many2one(
        comodel_name='project.project',
        scrummer=True
    )
    parent_id = fields.Many2one(
        comodel_name='project.task',
        scrummer=True
    )
    stage_id = fields.Many2one(
        comodel_name='project.task.type',
        scrummer=True
    )
    wkf_state_id = fields.Many2one(
        comodel_name='project.workflow.state',
        scrummer=True
    )
    workflow_id = fields.Many2one(
        comodel_name='project.workflow',
        scrummer=True
    )
    child_ids = fields.One2many(
        comodel_name='project.task',
        scrummer=True
    )
    timesheet_ids = fields.One2many(
        comodel_name='account.analytic.line',
        scrummer=True
    )
    attachment_ids = fields.One2many(
        comodel_name='ir.attachment',
        inverse_name='res_id',
        scrummer=True
    )
    tag_ids = fields.Many2many(
        comodel_name='project.tags',
        scrummer=True
    )
    type_id = fields.Many2one(
        comodel_name='project.task.type2',
        scrummer=True,
    )
    resolution_id = fields.Many2one(
        scrummer=True,
    )
    project_type_id = fields.Many2one(
        comodel_name='project.type',
        scrummer=True,
    )
    epic_id = fields.Many2one(
        comodel_name='project.task',
        scrummer=True,
    )
    user_id = fields.Many2one(
        scrummer=True
    )
    create_uid = fields.Many2one(
        comodel_name='res.users',
        scrummer=True,
    )
    priority_id = fields.Many2one(
        comodel_name='project.task.priority',
        scrummer=True,
    )
    team_id = fields.Many2one(
        comodel_name="project.agile.team",
        scrummer=True,
    )
    project_last_update = fields.Datetime(
        related='project_id.__last_update',
        readonly=True,
        scrummer=True
    )
    user_last_update = fields.Datetime(
        related='user_id.__last_update',
        readonly=True,
        scrummer=True
    )
    stage_name = fields.Char(
        related='stage_id.name',
        readonly=True,
        scrummer=True
    )
    parent_key = fields.Char(
        related='parent_id.key',
        readonly=True,
        scrummer=True
    )
    type_scrummer_icon = fields.Char(
        string='Type Scrummer Icon',
        related="type_id.scrummer_icon",
        scrummer=True,
    )

    type_scrummer_icon_color = fields.Char(
        string='Type Agile Icon Color',
        related="type_id.scrummer_icon_color",
        scrummer=True,
    )

    priority_scrummer_icon = fields.Char(
        string='Priority Scrummer Icon',
        related="priority_id.scrummer_icon",
        scrummer=True,
    )

    priority_scrummer_icon_color = fields.Char(
        string='Priority Scrummer Icon Color',
        related="priority_id.scrummer_icon_color",
        scrummer=True,
    )

    @api.multi
    def open_in_scrummer(self):
        self.ensure_one()
        url = "/scrummer/web#page=board&project=%s&&view=task&task=%s"

        if self.project_id.agile_enabled:
            return {
                'type': 'ir.actions.act_url',
                'target': 'self',
                'url': url % (self.project_id.id, self.id),
            }

        return False
