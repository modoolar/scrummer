# Copyright 2017 - 2018 Modoolar <info@modoolar.com>
# License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

{
    "name": "Scrummer Scrum",
    "summary": "Manage your projects by using agile scrum methodology.",
    "category": "Project",
    "version": "11.0.1.0.0",
    "license": "LGPL-3",
    "author": "Modoolar",
    "website": "https://www.modoolar.com/",
    "images": ["static/description/banner.png"],
    "depends": [
        "project_agile_scrum",
        "scrummer",
    ],

    "data": [
        "views/scrummer_scrum.xml",
        "views/project_agile_scrum_sprint_views.xml",
    ],

    "demo": [],
    "qweb": [
        "static/src/xml/*.xml",
    ],
    "application": True,
}
