# Copyright 2017 - 2018 Modoolar <info@modoolar.com>
# License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

{
    "name": "Project Timesheet Category",
    "summary": """This module extends timesheet with category field.""",
    "category": "Project",
    "version": "10.0.1.0.0",
    "license": "LGPL-3",
    "author": "Modoolar",
    "website": "https://www.modoolar.com/",
    "depends": [
        "project",
        "hr_timesheet",
    ],
    "data": [
        "security/ir.model.access.csv",
        "security/security.xml",
        "data/data.xml",
        "views/timesheet_category_view.xml",
        "views/menu.xml",
        "views/account_analytic_line.xml",
        "views/project_task.xml",
        "views/res_users.xml",
    ],

    "demo": [],
    "qweb": [
        "static/src/xml/project_timesheet.xml",
    ],
    "application": False
}