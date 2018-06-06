# Copyright 2017 - 2018 Modoolar <info@modoolar.com>
# License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

{
    "name": "Project Agile Timesheet Category",
    "summary": "Extends project agile with timesheet category.",
    "category": "Project",
    "version": "11.0.1.0.0",
    "license": "LGPL-3",
    "author": "Modoolar",
    "website": "https://www.modoolar.com/",
    "depends": [
        "project_agile",
        "project_timesheet_category",
        "timesheet_grid",
    ],

    "data": [
        "views/timesheet.xml",
        "wizards/project_task_worklog_wizard.xml",
    ],

    "demo": [],
    "qweb": [],
    "application": False,
}
