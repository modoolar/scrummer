# Copyright 2017 - 2018 Modoolar <info@modoolar.com>
# License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

{
    "name": "Project Task Archiving",
    "summary": "This module extends ``project.task.type`` with number of days "
               "after which task from that stage will get archived by cron",
    "category": "Project",
    "version": "11.0.1.0.0",
    "license": "LGPL-3",
    "author": "Modoolar",
    "website": "https://www.modoolar.com/",
    "depends": [
        "project",
    ],
    "data": [
        "data/crons.xml",
        "views/project_task_type_views.xml",
    ],

    "qweb": [

    ],
    "application": False,
}
