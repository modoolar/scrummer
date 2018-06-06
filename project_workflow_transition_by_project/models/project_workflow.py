# Copyright 2017 - 2018 Modoolar <info@modoolar.com>
# License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

from odoo import models, fields


class Workflow(models.Model):
    _inherit = 'project.workflow'

    def get_available_transitions(self, task, state):
        transitions = super(Workflow, self).get_available_transitions(
            task, state
        )
        projects = frozenset([task.project_id.id] or ())
        return [
            x for x in transitions
            if not (x.project_ids and projects.isdisjoint(x.project_ids.ids))
        ]


class WorkflowTransition(models.Model):
    _inherit = 'project.workflow.transition'

    project_ids = fields.Many2many(
        comodel_name='project.project',
        relation='project_workflow_transition_project_rel',
        column1='transition_id',
        column2='project_id',
        string='Projects',
        help='Only defined projects are allowed to execute this transition.'
             'In case no projects has been defined then this transition is'
             'open for all projects'
    )
