// Copyright 2017 - 2018 Modoolar <info@modoolar.com>
// License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

odoo.define('scrummer.menu', function (require) {
    "use strict";

    const AgileBaseWidgets = require('scrummer.BaseWidgets');
    const AgileContainerWidget = AgileBaseWidgets.AgileContainerWidget;
    const hash_service = require('scrummer.hash_service');

    const core = require('web.core');
    const _t = core._t;
    window.qweb = core.qweb;

    const AgileMenuItem = AgileContainerWidget.extend({
        _name: "AgileMenuItem",
        template: "scrummer.menu.menuitem",
        init(parent, options) {
            this._super(parent, options);
            Object.assign(this, options);
        },
        build_widgets() {
            if (this.children instanceof Array && this.children) {
                for (const def of this.children.sort((a, b) => a.args.sequence - b.args.sequence)) {
                    def.args.viewKey = def.args.viewKey ? def.args.viewKey : this.viewKey;
                    this.render_widget(def);
                }
            }
        }
    });
    const AgileHorizontalMenuItem = AgileMenuItem.extend({
        _name: "AgileHorizontalMenuItem",
        template: "scrummer.menu.menuitem.horisontal",
        start() {
            this.$el.find("a").click(() => hash_service.setHash(this.viewKey, this.view));
            return this._super();
        }
    });
    const AgileVerticalMenuItem = AgileMenuItem.extend({
        _name: "AgileVerticalMenuItem",
        init(parent, options) {
            if (options.children && options.children.length > 0) {
                this.template = "scrummer.menu.category";
            }
            if (options.parent) {
                this.template = "scrummer.menu.subitem";
            }
            this._super(parent, options);
        },
        start() {
            if (!this.children || this.children.length === 0) {
                this.$("a").click(() => {
                    hash_service.setHash(this.viewKey, this.view);
                    $('.button-collapse').sideNav('hide');
                });
            }
            return this._super();
        }
    });
    const AgileVerticalFromTopMenuItem = AgileMenuItem.extend({
        _name: "AgileVerticalFromTopMenuItem",
        template: "scrummer.menu.menuitem.overflow",
        init(parent, options) {
            if (options.children && options.children.length > 0) {
                this.template = "scrummer.menu.category";
            }
            if (options.parent) {
                this.template = "scrummer.menu.subitem";
            }
            this._super(parent, options);
        },
        start() {
            if (!this.children || this.children.length === 0) {
                this.$("a").click(() => hash_service.setHash(this.viewKey, this.view));
            }
            return this._super();
        }
    });

    const AgileMenu = AgileContainerWidget.extend({
        _name: "AgileMenu",
        init(parent, options = {}) {
            Object.assign(this, options);
            this._super(parent, options);
        },
        build_widget_list() {
            throw new Error("You must implement build_widget_list() method in your implementation of AgileMenu class.");
        },
        // Building widge
        build_widgets() {
            // We need to convert flat array to hierarchy of parent-child menuitems
            // Dictionary of menuitem id, and the menuitem object
            // is used to index all menuitems for easy linking and checking for existance
            const map = new Map();
            for (const def of this.widgetDefinitions) {
                if (map.has(def.args.id)) {
                    throw new Error("Duplicate id in menu widget: " + def.args.id);
                }
                map.set(def.args.id, def);
            }
            // Link every menuitem to it's parent if it has one, by adding it to parents children array
            for (const def of map.values()) {
                if ("args" in def && def.args.parent) {
                    const parent = map.get(def.args.parent);
                    if (typeof parent === "undefined") {
                        throw new Error("Menu item definition: Parent id not found: " + def.args.parent);
                    }
                    // Append child to children array or create one if doesn't already exist
                    if (parent.args.children instanceof Array) {
                        parent.args.children.push(def);
                    } else {
                        parent.args.children = [def];
                    }
                }
            }
            // Create widgets array from map that only contains root menuitems (without parent),
            // and sort them by sequence
            const widgets = [...map.values()]
                .filter((def) => typeof def.args.parent === "undefined" || def.args.parent === null)
                .sort((a, b) => a.args.sequence - b.args.sequence);

            for (const def of widgets) {
                def.args.viewKey = def.args.viewKey ? def.args.viewKey : this.viewKey;
                this.render_widget(def);
            }
        },
    });
    const AgileViewMenu = AgileMenu.extend({
        _name: "AgileViewMenu",
        init(parent, options) {
            this._super(parent, options);
            this._require_prop("boardType");
        },
        build_widget_list() {
            this.add_widget({
                id: 'dashboard',
                widget: AgileVerticalFromTopMenuItem,
                append: "ul#nav-mobile",
                'args': {
                    id: "dashboard",
                    view: "dashboard",
                    icon: "view-dashboard",
                    name: _t("Dashboard"),
                    viewKey: "page",
                    sequence: 0.5,
                }
            });
        },
        start() {
            this.$('.collapsible').collapsible();
            // Perfect Scrollbar
            this.$('select').not('.disabled').material_select();
            return this._super();
        }
    });
    const AgileTopMenu = AgileMenu.extend({
        _name: "AgileTopMenu",
        tagName: "ul",
        build_widget_list() {
            this.add_widget({
                'name': 'dashboard',
                'widget': AgileHorizontalMenuItem,
                'args': {
                    id: "dashboard",
                    view: "dashboard",
                    name: _t("Dashboard"),
                    sequence: 1,
                }
            });
        }
    });
    return {
        AgileMenu,
        AgileViewMenu,
        AgileTopMenu,
        AgileMenuItem,
        AgileHorizontalMenuItem,
        AgileVerticalMenuItem,
        AgileVerticalFromTopMenuItem

    };
});
