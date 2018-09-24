# Copyright 2017 - 2018 Modoolar <info@modoolar.com>
# License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

{
    "name": "Scrummer Workflow Security",
    "summary": "This module extends workflow transitions with security groups",
    "category": "Project",
    "version": "11.0.1.0.0",
    "license": "LGPL-3",
    "author": "Modoolar",
    "website": "https://www.modoolar.com/",
    "images": ["static/description/banner.png"],
    "depends": [
        "project_workflow_security",
        "scrummer",
    ],

    "data": [
        "views/scrummer_workflow_security.xml",
    ],
    "installable": True,
}
