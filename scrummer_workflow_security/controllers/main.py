# Copyright 2017 - 2018 Modoolar <info@modoolar.com>
# License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

from odoo.addons.scrummer.controllers import main


class ScrummerController(main.ScrummerController):
    def prepare_transition(self, transition):
        data = super(ScrummerController, self).prepare_transition(transition)
        data['group_ids'] = [x['id'] for x in transition.group_ids]
        return data
