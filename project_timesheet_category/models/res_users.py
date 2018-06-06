# -*- coding: utf-8 -*-
# Copyright 2017 - 2018 Modoolar <info@modoolar.com>
# License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

from odoo import models, fields


class Users(models.Model):
    _inherit = "res.users"

    default_timesheet_category_id = fields.Many2one(
        comodel_name="project.timesheet.category",
        string="Default Timesheet category",
    )
