# Copyright 2017 - 2018 Modoolar <info@modoolar.com>
# License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

from odoo import models, fields, api

import logging

_logger = logging.getLogger(__name__)


class WorkflowAction(models.AbstractModel):
    _name = 'project.workflow.action'
    _order = "sequence"

    def _default_model_id(self):
        return self.env.ref('project.model_project_task').id

    ir_actions_server_id = fields.Many2one(
        comodel_name='ir.actions.server',
        string='Server action',
        delegate=True,
        ondelete='restrict',
        required=True
    )

    sequence = fields.Integer(default=5)

    @api.model
    def create(self, vals):
        vals['model_id'] = self._default_model_id()
        return super(WorkflowAction, self).create(vals)


class WorkflowStateAction(models.Model):
    _name = 'project.workflow.state.action'
    _inherit = 'project.workflow.action'

    state_id = fields.Many2one(
        comodel_name='project.workflow.state',
        string='State',
        required=True,
        index=True,
        ondelete="cascade",
    )

    @api.multi
    def unlink(self):
        for record in self:
            record.ir_actions_server_id.unlink()
        return super(WorkflowStateAction, self).unlink()


class WorkflowTransitionAction(models.Model):
    _name = 'project.workflow.transition.action'
    _inherit = 'project.workflow.action'

    transition_id = fields.Many2one(
        comodel_name='project.workflow.transition',
        string='Transition',
        required=True,
        index=True,
        ondelete="cascade",
    )

    @api.multi
    def unlink(self):
        for record in self:
            record.ir_actions_server_id.unlink()
        return super(WorkflowTransitionAction, self).unlink()


class WorkflowState(models.Model):
    _inherit = 'project.workflow.state'

    action_ids = fields.One2many(
        comodel_name='project.workflow.state.action',
        inverse_name='state_id',
        string='Actions',
        copy=True,
    )

    def apply(self, task):
        _logger.info(
            "Begin apply state (%s,%s) on task (%s,%s)",
            self.id, self.name, task.id, task.name
        )

        super(WorkflowState, self).apply(task)

        ctx = self.env.context.copy()
        ctx['active_model'] = 'project.task'
        ctx['active_id'] = task.id
        ctx['active_ids'] = [task.id]
        ctx['action_user'] = self.env.user

        for action in self.action_ids:
            action.ir_actions_server_id.with_context(ctx).run()
            _logger.info(
                "Server action (%s, '%s') applied",
                action.id, action.name,
            )

        _logger.info(
            "End apply state (%s,%s) on task (%s,%s)",
            self.id, self.name, task.id, task.name
        )


class WorkflowTransition(models.Model):
    _inherit = 'project.workflow.transition'

    action_ids = fields.One2many(
        comodel_name='project.workflow.transition.action',
        inverse_name='transition_id',
        string='Actions',
        copy=True,
    )

    def apply(self, task):
        _logger.info(
            "Begin applying transition (%s,%s) on task (%s,%s)",
            self.id, self.name, task.id, task.name
        )

        super(WorkflowTransition, self).apply(task)

        ctx = self.env.context.copy()
        ctx['active_model'] = 'project.task'
        ctx['active_id'] = task.id
        ctx['active_ids'] = [task.id]
        ctx['action_user'] = self.env.user

        for action in self.action_ids:
            action.ir_actions_server_id.with_context(ctx).run()

        _logger.info(
            "End applying transition (%s,%s) on task (%s,%s)",
            self.id, self.name, task.id, task.name
        )
