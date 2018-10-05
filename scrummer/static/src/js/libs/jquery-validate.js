// Copyright 2017 - 2018 Modoolar <info@modoolar.com>
// License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).
odoo.define('jquery-validator', function (require) {
    var _t = require('web.core')._t;

    jQuery.validator.setDefaults({
        messages: {
            required: _t("This field is required."),
            remote: _t("Please fix this field."),
            email: _t("Please enter a valid email address."),
            url: _t("Please enter a valid URL."),
            date: _t("Please enter a valid date."),
            dateISO: _t("Please enter a valid date (ISO)."),
            number: _t("Please enter a valid number."),
            digits: _t("Please enter only digits."),
            equalTo: _t("Please enter the same value again."),
            maxlength: $.validator.format(_t("Please enter no more than {0} characters.")),
            minlength: $.validator.format(_t("Please enter at least {0} characters.")),
            rangelength: $.validator.format(_t("Please enter a value between {0} and {1} characters long.")),
            range: $.validator.format(_t("Please enter a value between {0} and {1}.")),
            max: $.validator.format(_t("Please enter a value less than or equal to {0}.")),
            min: $.validator.format(_t("Please enter a value greater than or equal to {0}.")),
            step: $.validator.format(_t("Please enter a multiple of {0}."))
        },
        ignore:"",
        validClass:"",
        errorElement: 'div',
        errorPlacement: function (error, element) {
            var placement = $(element).data('error');
            if (placement) {
                $(placement).append(error)
            } else {
                error.insertAfter(element);
            }
        }
    });
});
