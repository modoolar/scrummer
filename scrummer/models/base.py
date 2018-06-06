# Copyright 2017 - 2018 Modoolar <info@modoolar.com>
# License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

from odoo import models, fields, api


class Base(models.AbstractModel):
    _inherit = 'base'

    @api.model
    def _format_values(self, record, vals, update_related_fields=False):
        res = super(Base, self)._format_values(
            record, vals, update_related_fields
        )

        for fn in list(res.keys()):
            if not record._fields[fn]._attrs.get('scrummer', False):
                del res[fn]
        return res


class AgileSystemCodeItem(models.AbstractModel):
    _inherit = 'project.agile.code_item'

    name = fields.Char(scrummer=True)
    description = fields.Html(scrummer=True)
    system = fields.Boolean(scrummer=True)
    active = fields.Boolean(scrummer=True)
    sequence = fields.Integer(scrummer=True)
    scrummer_icon = fields.Char(string='Scrummer Icon')
    scrummer_icon_color = fields.Char(string='Scrummer Icon Color')
