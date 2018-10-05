// Copyright 2017 - 2018 Modoolar <info@modoolar.com>
// License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

odoo.define('scrummer.widget.task.links', function (require) {
    "use strict";
    const ScrummerData = require('scrummer.data');
    const ModelList = require('scrummer.model_list');
    const AbstractModelList = require('scrummer.abstract_model_list');
    const BaseWidgets = require('scrummer.BaseWidgets');

    const LinkGroupWidget = BaseWidgets.AgileBaseWidget.extend({
        template: "scrummer.task.link.group",
        _name: "LinkGroupWidget",
        init(parent, options) {
            this._super(parent, options);
            Object.assign(this, options);
            this._require_prop("relation");
            this._require_prop("links");
            this.taskLinkList = new AbstractModelList.ModelList(this, {
                model: "project.task",
                ModelItem: ModelList.SimpleTaskItem,
                itemExtensions: {
                    template: "scrummer.task.task_widget_task_item",
                },
                _name: "Link Group Widget",
                data: this.links,
                attributes: {"data-relation-name": this.relation}
            });
        },
        renderElement() {
            this._super();
            this.taskLinkList.appendTo(this.$(".collection"));
        },
        addLink(link) {
            this.links.push(link);
            return this.taskLinkList.addItem(link.related_task, {"data-link-id": link.id});
        },
        removeLink(id) {
            const link = this.links.find((l) => l.id === id);
            if (!link) {
                return false;
            }
            this.links = this.links.filter((l) => l.id !== id);
            ScrummerData.getDataSet("project.task.link").unlink([link.id]);
        }
    });

    const TaskLinks = BaseWidgets.AgileBaseWidget.extend({
        _name: "TaskLinks",
        init(parent, options) {
            this._super(parent, options);
            Object.assign(this, options);
            this._require_prop("task_id");
        },
        willStart() {
            return this._super().then(() => {
                // Get all links
                const linksPromise = ScrummerData.getTaskLinks(this.task_id)
                    .then((links) => {
                        this.links = links;
                    });
                // Get relation name to order map;
                const relationsPromise = ScrummerData.cache.get("project.task.link.relation.nameOrderMaps")
                    .then((nameToOrderMap, orderToNameMap) => {
                        this.nameToOrderMap = nameToOrderMap;
                        this.orderToNameMap = orderToNameMap;
                    });
                return $.when(linksPromise, relationsPromise);
            });
        },
        renderElement() {
            this._super();
            this.groups = window.groups = new Map();
            // render empty lists
            for (const relationOrder of [...this.orderToNameMap.keys()].sort()) {
                const relation = this.orderToNameMap.get(relationOrder);
                const linkGroup = new LinkGroupWidget(this, {
                    relation,
                    links: []
                });
                this.groups.set(relation, linkGroup);
                linkGroup.appendTo(this.$el);
                linkGroup.$el.hide();
            }
            for (const link of this.links) {
                this.addLink(link, false);
            }
        },
        addLink(link, addToList = true) {
            //Since render element calls this method, avoid infinite loop
            if (addToList) {
                this.links.push(link);
            }
            const linkGroup = this.groups.get(link.relation_name);
            linkGroup.$el.show();
            return linkGroup.addLink(link);

        }

    });

    return {
        TaskLinks,
        LinkGroupWidget
    };
});
