# Copyright 2017 - 2018 Modoolar <info@modoolar.com>
# License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).


from odoo import fields, models


class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    module_scrummer_scrum = fields.Boolean(
        string="Scrum"
    )

    module_scrummer_kanban = fields.Boolean(
        string="Kanban"
    )

    module_scrummer_git = fields.Boolean(
        string="Git"
    )

    module_scrummer_timesheet_category = fields.Boolean(
        string="Timsheet Category"
    )

    module_scrummer_workflow_security = fields.Boolean(
        string="Workflow Security"
    )

    module_scrummer_workflow_transitions_by_task_type = fields.Boolean(
        string="Workflow Transition By Task Type"
    )

    module_scrummer_workflow_transition_by_project = fields.Boolean(
        string="Workflow Transition By Project"
    )
