# Copyright 2017 - 2018 Modoolar <info@modoolar.com>
# License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

from odoo import http
from odoo.addons.scrummer.controllers.main import ScrummerController


class TimesheetCategoryScrummerController(ScrummerController):
    @http.route('/scrummer/session_user', type='json', auth='user')
    def session_user(self):
        user = http.request.env.user
        result = super(TimesheetCategoryScrummerController, self) \
            .session_user()
        cat = user.default_timesheet_category_id
        result['default_timesheet_category_id'] = [cat.id, cat.name] \
            if cat.id else False
        return result
