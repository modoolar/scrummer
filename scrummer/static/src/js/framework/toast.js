"use strict";
// Copyright 2017 - 2018 Modoolar <info@modoolar.com>
// License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).


odoo.define('scrummer.toast', function (require) {
    const web_core = require('web.core');
    const _t = web_core._t;
    const hash_service = require('scrummer.hash_service');
    const ScrummerData = require('scrummer.data');
    const Materialize = window.Materialize;

    return {
        duration: 5000,
        /**
         *
         * @param {(String | jQuery)} content
         * @param {String} imageUrl
         * @param {Object} button - Object with button metadata
         * @param {String} button.text - Button name
         * @param {function} button.callback - Callback that will be called on button click
         * @param {function} callback - Callback that will be called when toast is completed
         * @param {Number} duration - Duration in milliseconds
         * @param {String} type - Class that will be appended to toast, can be used for customising style
         */
        toast(content, imageUrl, button, callback = null, duration = this.duration, type = "") {
            const toastContainer = $("<div class='toast-container'/>");

            if (imageUrl) {
                const toastUserImage = $('<div class="toast-left"><img alt="" class="user-image circle" src="' + imageUrl + '"></div>');
                toastContainer.append(toastUserImage);
            }

            const toastContent = $('<div class="toast-content"></div>');
            toastContent.append(content);
            toastContainer.append(toastContent);
            if (button) {
                const btn = $('<div class="toast-right"><button class="btn-flat toast-action white-text">' + button.text + '</button></div>');
                btn.click(button.callback);
                toastContainer.append(btn);
            }
            Materialize.toast(toastContainer, duration, ("agile-toast " + type).trim(), callback);
        },
        toastTask(user, task, method) {
            const action = {
                create: _t("created"),
                write: _t("updated"),
                unlink: _t("deleted"),
            };
            const toastContent = $('<div class="toast-content"><p><span class="toast-user-name">' + user.name + '</span> ' + action[method] + ' ' + task.priority_id[1] + ' ' + task.type_id[1] + ' <span class="toast-task-name">' + task.key + ' - ' + task.name + '</span></p></div>');
            this.toast(toastContent, ScrummerData.getImage("res.users", user.id, user.write_date), {
                text: "open", callback: () => {
                    hash_service.set("task", task.id);
                    hash_service.set("view", "task");
                    hash_service.set("page", "board");
                }
            });
        }
    };
});
