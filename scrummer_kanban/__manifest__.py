# Copyright 2017 - 2018 Modoolar <info@modoolar.com>
# License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

{
    "name": "Scrummer Kanban",
    "summary": "Manage your projects by using agile kanban methodology",
    "category": "Project",
    "version": "11.0.0.1.0",
    "license": "LGPL-3",
    "author": "Modoolar",
    "website": "https://www.modoolar.com/",
    "images": ["static/description/banner.png"],
    "depends": [
        "project_agile_kanban",
        "scrummer",
    ],

    "data": [
        "views/scrummer_kanban.xml",
    ],

    "demo": [],
    "qweb": [
        "static/src/xml/*.xml",
    ],
    "application": True,
}
