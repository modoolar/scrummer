# Copyright 2017 - 2018 Modoolar <info@modoolar.com>
# License LGPL-3.0 or later (http://www.gnu.org/licenses/lgpl-3.0.en.html).
{
    "name": "Scrummer",
    "summary": "Scrummer is frontend for project agile framework",
    "category": "Project",
    "version": "11.0.1.0.0",
    "license": "LGPL-3",
    "author": "Modoolar",
    "website": "https://www.modoolar.com/",
    "images": ["static/description/banner.png"],
    "depends": [
        "project_agile",
        "web_syncer",
    ],

    "data": [
        "views/project_project_view.xml",
        "views/project_type_view.xml",
        "views/project_task_view.xml",
        "views/project_task_type2_view.xml",
        "views/project_task_priority_view.xml",
        "views/project_agile_team_view.xml",
        "views/res_config_settings_views.xml",

        "views/scrummer.xml",
        "views/index.xml",

        "views/menu.xml",

        "data/project_task.xml",
    ],

    "demo": [
    ],

    "qweb": ["static/src/xml/*.xml"],
    "application": True,
    "installable": True,
}
