# Copyright 2017 - 2018 Modoolar <info@modoolar.com>
# License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

{
    "name": "Scrummer Git",
    "summary": "Enables you to integrate project_git with Scrummer",
    "category": "Project",
    "version": "11.0.1.0.0",
    "license": "LGPL-3",
    "author": "Modoolar",
    "website": "https://www.modoolar.com/",
    "images": ["static/description/banner.png"],
    "depends": [
        "project_git",
        "scrummer"
    ],
    "data": [
        "views/scrummer_git.xml"
    ],

    "demo": [],
    "qweb": [
        "static/src/xml/scrummer_git.xml",
    ],
    "application": False
}
