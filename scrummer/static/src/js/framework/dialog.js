// Copyright 2017 - 2018 Modoolar <info@modoolar.com>
// License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

'use strict';
odoo.define('scrummer.dialog', function () {
    return {
        /**
         *
         * @param {String} title
         * @param {String} message
         * @param {String} [okText=ok] - Positive button text
         * @param {String} [cancelText=cancel] - Negative button text
         * @returns {jQuery.Promise}
         */
        confirm(title, message, okText = "ok", cancelText = "cancel") {
            const def = new $.Deferred();
            const modal = $("<div id='" + Date.now() + "' class='modal dialog'>" +
                "<div class='modal-content'><h4>" + title + "</h4><p>" + message + "</p></div>" +
                "</div>");
            const modalFooter = $("<div class='modal-footer'></div>");
            modalFooter.appendTo(modal);
            const ok = $("<a class='modal-action waves-effect waves-green btn-flat'>" + okText + "</a>");
            const cancel = $("<a class='modal-action modal-close waves-effect waves-green btn-flat'>" + cancelText + "</a>");
            modalFooter.append(ok).append(cancel);
            $("body").append(modal);
            modal.materialModal({
                dismissible: false,
                complete: function () {
                    if (!modal.ok) {
                        def.reject();
                    }
                    modal.remove();
                }
            });

            modal.materialModal("open");
            ok.click(() => {
                modal.ok = true;
                def.resolve();
                modal.materialModal("close");
            });
            return def.promise();

        }
    };
});
