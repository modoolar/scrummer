// Copyright 2017 - 2018 Modoolar <info@modoolar.com>
// License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

odoo.define('scrummer.layout', function (require) {
    "use strict";

    const core = require('scrummer.core');
    const _t = require('web.core')._t;
    const qweb = require('web.core').qweb;
    const data = require('scrummer.data');
    const web_client = require('web.web_client');
    const PageManager = require('scrummer.page_manager');

    const AgileContainerWidget = require('scrummer.BaseWidgets').AgileContainerWidget;
    const AgileHeader = require('scrummer.header');

    const AgileLayout = AgileContainerWidget.extend({
        template: "scrummer.layout",
        failTemplate: "scrummer.layout.fail",
        custom_events: {
            'menu.added': function () {
                if (this._is_added_to_DOM.state() === "resolved") {
                    this.$el.addClass("with-menu");
                } else {
                    this.className = this.className ? this.className.concat(" with-menu") : "with-menu";
                }
            },
            'menu.removed': function () {
                if (this._is_added_to_DOM.state() === "resolved") {
                    this.$el.removeClass("with-menu");
                }
            },
        },
        _name: "layout",
        init(parent, options) {
            this._super(parent, options);
            web_client.loading.destroy();
            core.layout = this;
        },
        build_widget_list() {
            this.add_widget({
                'id': 'header_widget',
                'widget': AgileHeader.HeaderWidget,
                'replace': 'widget.header',
            });
            this.add_widget({
                'id': 'page_manager_widget',
                'widget': PageManager,
                'replace': 'widget.page_manager',
                'args': {
                    defaultView: "dashboard",
                    _name: 'page_manager_widget'
                }
            });
        },
        willStart() {
            return $.when(this._super(), data.cache.get("current_user").then((user) => {
                this.user = user;
            }));
        },
        renderElement() {
            // If user has no team, then he's not allowed to enter agile app.
            if (!this.shouldLoad()) {
                const $el = $(qweb.render(this.failTemplate, this.generateLoadingErrors()).trim());
                this.replaceElement($el);
                return;
            }
            return this._super();
        },
        shouldLoad() {
            return this.user.team_id;
        },
        generateLoadingErrors() {
            const errors = [
                {
                    name: "no_agile_team",
                    title: _t("Agile team missing"),
                    message: _t("You don't belong to any agile team, please contact your Administrator.")
                }
            ];
            return {
                errors
            };
        },
        start() {
            // Remove
            //$(document).off('click keyup',null,$._data(document,"events").keyup[1].handler);

            const appNode = document.getElementsByClassName("o_content")[0];
            const self = this;
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(function (mutation) {
                    if (mutation.addedNodes[0].id === "agile_layout" || mutation.addedNodes[0].id === "agile_layout_fail") {
                        self.actionAddedToDOM();
                        observer.disconnect();
                    }
                });
            });
            observer.observe(appNode, {childList: true});
            return this._super();
        },
        actionAddedToDOM() {
            this.__is_added_to_DOM.resolve();
            this.$el.addClass(this.className);
            this.materializeInit();
        },
        materializeInit() {
            $('body').addClass('loaded');
            window.Waves.init({
                duration: 500,
                delay: 1000
            });
        },
    });
    return {
        AgileLayout
    };

});
