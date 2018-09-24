# Copyright 2017 - 2018 Modoolar <info@modoolar.com>
# License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

{
    "name": "Scrummer Timesheet Category",
    "summary": """This module extends Scrummer in order to support timesheet
    categories introduced in project_timesheet_category module""",
    "category": "Project",
    "version": "10.0.1.0.0",
    "license": "LGPL-3",
    "author": "Modoolar",
    "website": "https://www.modoolar.com/",
    "images": ["static/description/banner.png"],
    "depends": [
        "scrummer",
        "project_timesheet_category",
    ],
    "data": [
        "views/assets.xml",
    ],

    "demo": [],
    "qweb": [
        "static/src/xml/scrummer_timesheet.xml",
    ],
    "application": False
}
