# Copyright 2017 - 2018 Modoolar <info@modoolar.com>
# License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

from odoo import models, fields, api
from datetime import datetime, timedelta


class Workflow(models.Model):
    _inherit = 'project.task.type'

    archive_days = fields.Integer(
        string="Archive days",
        required=True,
        default=0
    )

    @api.model
    def run_task_archiver(self):
        Task = self.env["project.task"]
        for stage in self.search([]):
            if stage.archive_days > 0:
                edge_date = fields.Datetime.to_string(
                    datetime.now() - timedelta(stage.archive_days))
                tasks = Task.search([
                    ("stage_id", "=", stage.id),
                    ("date_last_stage_update", "<", edge_date)])
                tasks.write({"active": False})
