// Copyright 2017 - 2018 Modoolar <info@modoolar.com>
// License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).
'use strict';
jQuery.fn.getDataFromAncestor = function (dataAttr, oldest = "body") {
    var el = $(this[0]);
    return el.is(oldest) || el.data(dataAttr) !== undefined || el.parent().length == 0 ? el.data(dataAttr) : el.parent().getDataFromAncestor(dataAttr);
};

$.fn.insertAt = function (elements, index) {
    if (index >= this.children().size()) {
        this.append(elements);
    } else {
        var before = this.children().eq(index);
        $(elements).insertBefore(before);
    }
    return this;
};

$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        // convert value to Number if possible
        if (!isNaN(Number(this.value))) {
            this.value = Number(this.value);
        }
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
$.fn.scrollToElement = function (element, duration = 500) {
    this.animate({
        scrollTop: element.offset().top
            - this.offset().top
            + this.scrollTop()
            - Math.round(this.height() / 2)
            + element.outerHeight()
    }, duration);
};
$.fn.highlight = function () {
    this.css("position", "relative");
    let overlay = $('<div class="overlay agile-main-color"></div>');
    this.append(overlay);
    overlay.animate({opacity: 0.1}, 1000, function () {
        $(this).remove();
    });
};

$.fn.responsive = function () {
    var medias = [
        window.matchMedia('(max-width: 600px)'),
        window.matchMedia('(min-width: 601px) and (max-width: 992px)'),
        window.matchMedia('(min-width: 993px)')
    ];
    var current_class;
    var classes = {
        0: "s",
        1: "m",
        2: "l"
    };

    // Checks which media is matched and returns appropriate class (s/m/l)
    var size_class = () => {
        for (var i = 0; i < medias.length; i++) {
            if (medias[i].matches) {
                return classes[i];
            }
        }
    };

    // Calls rearange if screen class has changed
    var set_size_class = () => {
        var sc = size_class();
        if (sc !== current_class) {
            current_class = sc;
            rearange(sc);
        }
    };

    // Finds all responsive elements and places them after anchor
    // an example of anchor
    // <responsive data-id="1" class="m l"/>
    var rearange = (sc) => {
        this.find(".responsive").each((i, n) => {
            let node = $(n);
            let id = node.data("responsiveId");
            let anchor = this.find(`responsive[data-id=${id}].${sc}`);
            if (anchor.length > 1) {
                throw new Error("Found multiple anchors for responsive jQuery element");
            }
            node.insertAfter(anchor);
        })
    };

    medias.forEach(m => {
        m.addListener(set_size_class);
    });
    rearange(size_class())
};
let guid = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    return function () {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };
};
$.fn.new_autocomplete = function (options) {
    // Defaults
    // New format means that ID is key, and value is object that contains name (required), src
    var defaults = {
        data: {},
        delay: 200,
        limit: Infinity,
        onAutocomplete: null,
        onRendered: null,
        minLength: 1
    };

    options = $.extend(defaults, options);

    return this.each(function () {
        var $input = $(this);
        var customDataEnabled = typeof options.customData === "function";
        var getData = function (val) {
            if (customDataEnabled) {
                return options.customData(val);
            }
            return options.data;
        }
        var data = options.data;
        var count = 0,
            activeIndex = 0,
            oldVal,
            searching,
            $inputDiv = $input.closest('.input-field'); // Div to append on

        // Check if data isn't empty
        if (customDataEnabled || !$.isEmptyObject(data)) {
            var $autocomplete = $('<ul class="autocomplete-content dropdown-content"></ul>');
            var $oldAutocomplete;

            // Append autocomplete element.
            // Prevent double structure init.
            if ($inputDiv.length) {
                $oldAutocomplete = $inputDiv.children('.autocomplete-content.dropdown-content').first();
                if (!$oldAutocomplete.length) {
                    $inputDiv.append($autocomplete); // Set ul in body
                    $inputDiv.addClass("autocomplete");
                }
            } else {
                $oldAutocomplete = $input.next('.autocomplete-content.dropdown-content');
                if (!$oldAutocomplete.length) {
                    $input.after($autocomplete);
                }
            }
            if ($oldAutocomplete.length) {
                $autocomplete = $oldAutocomplete;
            }

            // Highlight partial match.
            var highlight = function (string, $el) {
                var img = $el.find('img');
                var matchStart = $el.text().toLowerCase().indexOf("" + string.toLowerCase() + ""),
                    matchEnd = matchStart + string.length - 1,
                    beforeMatch = $el.text().slice(0, matchStart),
                    matchText = $el.text().slice(matchStart, matchEnd + 1),
                    afterMatch = $el.text().slice(matchEnd + 1);
                $el.html("<span>" + beforeMatch + "<span class='highlight'>" + matchText + "</span>" + afterMatch + "</span>");
                if (img.length) {
                    $el.prepend(img);
                }
            };

            // Reset current element position
            var resetCurrentElement = function () {
                activeIndex = 0;
                $autocomplete.find('.active').removeClass('active');
            };

            // Remove autocomplete elements
            var removeAutocomplete = function () {
                $autocomplete.empty();
                resetCurrentElement();
            };
            var _delay = function (handler, delay) {
                function handlerProxy() {
                    return (typeof handler === "string" ? instance[handler] : handler)
                        .apply(instance, arguments);
                }

                var instance = this;
                return setTimeout(handlerProxy, delay || 0);
            };
            var _inputTimeout = function () {
                var timestamp = Date.now();
                $input.data("async-stamp", timestamp);
                var val = $input.val().toLowerCase();

                clearTimeout(searching);
                searching = _delay(function () {
                    var equalValues = oldVal === val;

                    if (!equalValues) {
                        removeAutocomplete();
                        if (val.length >= options.minLength) {
                            $inputDiv = $input.closest(".autocomplete");
                            $inputDiv.addClass("autocomplete-loading");
                            $.when(getData(val)).then(function (data) {
                                if ($input.data("async-stamp") != timestamp) {
                                    return;
                                }
                                for (var id in data) {
                                    if (customDataEnabled || data.hasOwnProperty(id) && data[id].name.toLowerCase().indexOf(val) !== -1) {
                                        if (!data[id].id) {
                                            console.error("Missing ID in new_autocomplete data");
                                        }
                                        // Break if past limit
                                        if (count >= options.limit) {
                                            break;
                                        }

                                        var autocompleteOption = $('<li></li>');
                                        // set first as active
                                        if (count === 0) {
                                            autocompleteOption.addClass("active");
                                        }
                                        autocompleteOption.data("id", id);
                                        if (!!data[id].imgurl) {
                                            autocompleteOption.append('<img src="' + data[id].imgurl + '" class="right circle"><span>' + data[id].name + '</span>');
                                        } else {
                                            autocompleteOption.append('<span>' + data[id].name + '</span>');
                                        }

                                        $autocomplete.append(autocompleteOption);
                                        highlight(val, autocompleteOption);
                                        count++;
                                    }
                                }
                                // Handle onRendered callback.
                                if (typeof options.onRendered === "function") {
                                    options.onRendered.call(this, $input.val(), $autocomplete);
                                }
                                $inputDiv.removeClass("autocomplete-loading");
                            });
                        }
                    }
                    // Update oldVal
                    oldVal = val;
                }, options.delay);
            };

            $input.off('blur.autocomplete').on('blur.autocomplete', function () {
                removeAutocomplete();
                oldVal = undefined;
            });

            // Perform search
            $input.off('keyup.autocomplete focus.autocomplete').on('keyup.autocomplete focus.autocomplete', function (e) {
                // Reset count.
                let val = $input.val();
                count = 0;
                // Don't capture enter or arrow key usage.
                if (e.which === 13 || e.which === 38 || e.which === 40 || oldVal === val) {
                    return;
                }
                _inputTimeout()
            });

            $input.off('keydown.autocomplete').on('keydown.autocomplete', function (e) {
                // Arrow keys and enter key usage
                var keyCode = e.which,
                    liElement,
                    numItems = $autocomplete.children('li').length,
                    $active = $autocomplete.children('.active').first();

                // select element on Enter
                if (keyCode === 13 && activeIndex >= 0) {
                    liElement = $autocomplete.children('li').eq(activeIndex);
                    if (liElement.length) {
                        liElement.trigger('mousedown.autocomplete');
                        e.preventDefault();
                    }
                    return;
                }
                // If escape is pressed, close autocomplete
                if (e.which === 27) {
                    removeAutocomplete();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return;
                }

                // Capture up and down key
                if (keyCode === 38 || keyCode === 40) {
                    e.preventDefault();
                    if (numItems === 0) {
                        oldVal = undefined;
                        _inputTimeout();
                        return;
                    }
                    if (keyCode === 38 && activeIndex > 0) {
                        activeIndex--;
                    }

                    if (keyCode === 40 && activeIndex < numItems - 1) {
                        activeIndex++;
                    }

                    $active.removeClass('active');
                    if (activeIndex >= 0) {
                        $autocomplete.children('li').eq(activeIndex).addClass('active');
                    }
                }
            });

            // Set input value
            $autocomplete.off('mousedown.autocomplete touchstart.autocomplete').on('mousedown.autocomplete touchstart.autocomplete', 'li', function () {
                var text = $(this).text().trim();
                var autocompleteOptionId = $(this).data("id");
                $input.val(text);
                $input.data("autocompleteOptionId", autocompleteOptionId);
                $input.trigger('change');
                removeAutocomplete();

                // Handle onAutocomplete callback.
                if (typeof options.onAutocomplete === "function") {
                    options.onAutocomplete.call(this, text, autocompleteOptionId);
                }
            });

            // Empty data
        } else {
            $input.off('keyup.autocomplete focus.autocomplete');
        }
    });
};
var materialChipsDefaults = {
    data: [],
    placeholder: '',
    secondaryPlaceholder: '',
    autocompleteOptions: {minLength: 0},
    beforeDeleteHook: function (elem) {
        return $.when();
    },
    beforeAddHook: function (elem) {
        return $.when();
    },
};

$(document).ready(function () {
    // Handle removal of static chips.
    $(document).on('click', '.chip .close', function (e) {
        var $chips = $(this).closest('.chips');
        if ($chips.attr('data-initialized')) {
            return;
        }
        $(this).closest('.chip').remove();
    });
});

$.fn.new_material_chip = function (options) {
    var self = this;
    this.$el = $(this);
    this.$document = $(document);
    this.SELS = {
        CHIPS: '.chips',
        CHIP: '.chip',
        INPUT: 'input',
        DELETE: '.material-icons',
        SELECTED_CHIP: '.selected'
    };

    if ('data' === options) {
        return this.$el.data('chips');
    }
    var autocomplete_options = $.extend({}, materialChipsDefaults.autocompleteOptions, options.autocompleteOptions);
    var curr_options = $.extend({}, materialChipsDefaults, options);
    curr_options.autocompleteOptions = autocomplete_options;
    self.hasCustomAutocomplete = typeof curr_options.autocompleteOptions.customData === "function";
    self.hasAutocomplete = self.hasCustomAutocomplete || !$.isEmptyObject(curr_options.autocompleteOptions.data);

    // Initialize
    this.init = function () {
        var i = 0;
        var chips;
        self.$el.each(function () {
            var $chips = $(this);
            var chipId = Materialize.guid();
            self.chipId = chipId;

            if (!curr_options.data) {
                curr_options.data = {};
            }
            $chips.data('chips', curr_options.data);
            $chips.attr('data-index', i);
            $chips.attr('data-initialized', true);

            if (!$chips.hasClass(self.SELS.CHIPS)) {
                $chips.addClass('chips');
            }

            self.chips($chips, chipId);
            i++;
        });
    };

    this.handleEvents = function () {
        var SELS = self.SELS;

        self.$document.off('click.chips-focus', SELS.CHIPS).on('click.chips-focus', SELS.CHIPS, function (e) {
            $(e.target).find(SELS.INPUT).focus();
        });

        self.$document.off('click.chips-select', SELS.CHIP).on('click.chips-select', SELS.CHIP, function (e) {
            var $chip = $(e.target);
            if ($chip.length) {
                var wasSelected = $chip.hasClass('selected');
                var $chips = $chip.closest(SELS.CHIPS);
                $(SELS.CHIP).removeClass('selected');

                if (!wasSelected) {
                    self.selectChip($chip.index(), $chips);
                }
            }
        });

        self.$document.off('keydown.chips').on('keydown.chips', function (e) {
            if ($(e.target).is('input, textarea')) {
                return;
            }

            var $chip = self.$document.find(SELS.CHIP + SELS.SELECTED_CHIP);
            var $chips = $chip.closest(SELS.CHIPS);
            var length = $chip.siblings(SELS.CHIP).length;
            var index;

            if (!$chip.length) {
                return;
            }
            // delete
            if (e.which === 8 || e.which === 46) {
                e.preventDefault();

                index = $chip.index();
                curr_options.beforeDeleteHook($chip).then(function () {
                    self.deleteChip(index, $chips);

                    var selectIndex = null;
                    if (index + 1 < length) {
                        selectIndex = index;
                    } else if (index === length || index + 1 === length) {
                        selectIndex = length - 1;
                    }

                    if (selectIndex < 0) selectIndex = null;

                    if (null !== selectIndex) {
                        self.selectChip(selectIndex, $chips);
                    }
                    if (!length) $chips.find('input').focus();
                });

                // left
            } else if (e.which === 37) {
                index = $chip.index() - 1;
                if (index < 0) {
                    return;
                }
                $(SELS.CHIP).removeClass('selected');
                self.selectChip(index, $chips);

                // right
            } else if (e.which === 39) {
                index = $chip.index() + 1;
                $(SELS.CHIP).removeClass('selected');
                if (index > length) {
                    $chips.find('input').focus();
                    return;
                }
                self.selectChip(index, $chips);
            }
        });

        self.$document.off('focusin.chips', SELS.CHIPS + ' ' + SELS.INPUT).on('focusin.chips', SELS.CHIPS + ' ' + SELS.INPUT, function (e) {
            var $currChips = $(e.target).closest(SELS.CHIPS);
            $currChips.addClass('focus');
            $currChips.siblings('label, .prefix').addClass('active');
            $(SELS.CHIP).removeClass('selected');
        });

        self.$document.off('focusout.chips', SELS.CHIPS + ' ' + SELS.INPUT).on('focusout.chips', SELS.CHIPS + ' ' + SELS.INPUT, function (e) {
            var $currChips = $(e.target).closest(SELS.CHIPS);
            $currChips.removeClass('focus');

            // Remove active if empty
            if ($currChips.data('chips') === undefined || !Object.keys($currChips.data('chips')).length) {
                $currChips.siblings('label').removeClass('active');
            }
            $currChips.siblings('.prefix').removeClass('active');
        });

        self.$document.off('keydown.chips-add', SELS.CHIPS + ' ' + SELS.INPUT).on('keydown.chips-add', SELS.CHIPS + ' ' + SELS.INPUT, function (e) {
            var $target = $(e.target);
            var $chips = $target.closest(SELS.CHIPS);
            var chipsLength = $chips.children(SELS.CHIP).length;

            // enter
            if (13 === e.which) {
                // Override enter if autocompleting.
                if (self.hasAutocomplete &&
                    ($chips.find('.autocomplete-content.dropdown-content').length &&
                        $chips.find('.autocomplete-content.dropdown-content').children().length ||
                        $chips.hasClass("autocomplete-loading")
                    )) {
                    return;
                }

                e.preventDefault();

                self.addChip({
                    name: $target.val(),
                    id: $target.data("autocompleteOptionId")
                }, $chips);
                $target.val('');
                $target.data("autocompleteOptionId", false);
                return;
            }

            // delete or left
            if ((8 === e.keyCode || 37 === e.keyCode) && '' === $target.val() && chipsLength) {
                e.preventDefault();
                self.selectChip(chipsLength - 1, $chips);
                $target.blur();
                return;
            }
        });

        // Click on delete icon in chip.
        self.$document.off('click.chips-delete', SELS.CHIPS + ' ' + SELS.DELETE).on('click.chips-delete', SELS.CHIPS + ' ' + SELS.DELETE, function (e) {
            var $target = $(e.target);
            var $chips = $target.closest(SELS.CHIPS);
            var $chip = $target.closest(SELS.CHIP);
            e.stopPropagation();
            curr_options.beforeDeleteHook($chip).then(function () {
                self.deleteChip($chip.index(), $chips);
                $chips.find('input').focus();
            });
        });
    };

    this.chips = function ($chips, chipId) {
        $chips.empty();
        var chipsData = $chips.data('chips')
        for (var chipId in chipsData) {
            var chip = chipsData[chipId];
            $chips.append(self.renderChip(chip));
        }
        $chips.append($('<input id="' + chipId + '" class="input" placeholder="">'));
        self.setPlaceholder($chips);

        // Set for attribute for label
        var label = $chips.next('label');
        if (label.length) {
            label.attr('for', chipId);

            if ($chips.data('chips') !== undefined && Object.keys($chips.data('chips')).length) {
                label.addClass('active');
            }
        }

        // Setup autocomplete if needed.
        var input = $('#' + chipId);
        if (self.hasAutocomplete) {
            curr_options.autocompleteOptions.onAutocomplete = function (val) {
                self.addChip({
                    name: val,
                    id: input.data("autocompleteOptionId")
                }, $chips);
                input.data("autocompleteOptionId", false);
                input.focus();
                input.val('');
            };
            curr_options.autocompleteOptions.onRendered = function (val, $autocomplete) {
                if (val.length === 0) return;
                var exists = false;
                var chipsData = $chips.data('chips');
                for (var chipId in chipsData) {
                    var chip = chipsData[chipId];
                    if (chip.name === val) {
                        exists = true;
                    }
                }
                if (!exists) {
                    var createTagOption = $('<li class="new"><span>' + val + '</span></li>');
                    $autocomplete.append(createTagOption);
                }
            };
            input.new_autocomplete(curr_options.autocompleteOptions);
        }
    };

    /**
     * Render chip jQuery element.
     * @param {Object} elem
     * @return {jQuery}
     */
    this.renderChip = function (elem) {
        if (!elem.name) {
            console.error("Cannot add chip without name");
            return;
        }

        var $renderedChip = $('<div class="chip"></div>');
        $renderedChip.data("id", elem.id);
        $renderedChip.text(elem.name);
        if (elem.image) {
            $renderedChip.prepend($('<img />').attr('src', elem.image));
        }
        $renderedChip.append($('<i class="material-icons close">close</i>'));
        return $renderedChip;
    };

    this.setPlaceholder = function ($chips) {
        if ($chips.data('chips') !== undefined && !Object.keys($chips.data('chips')).length && curr_options.placeholder) {
            $chips.find('input').prop('placeholder', curr_options.placeholder);
        } else if (($chips.data('chips') === undefined || !!Object.keys($chips.data('chips')).length) && curr_options.secondaryPlaceholder) {
            $chips.find('input').prop('placeholder', curr_options.secondaryPlaceholder);
        }
    };

    this.isValid = function ($chips, elem) {
        var chips = $chips.data('chips');
        var exists = false;
        for (var chipId in chips) {
            var chip = chips[chipId];
            if (chip.name === elem.name) {
                exists = true;
                return;
            }
        }
        return '' !== elem.name && !exists;
    };

    this.addChip = function (elem, $chips) {
        if (!self.isValid($chips, elem)) {
            return;
        }
        curr_options.beforeAddHook(elem).then(function (elemUpdate) {
            $.extend(elem, elemUpdate);
            var $renderedChip = self.renderChip(elem);
            var newData = {};
            var oldData = $chips.data('chips');
            for (var id in oldData) {
                newData[id] = oldData[id];
            }
            if (!elem.id) {
                console.error("Chip element does not have an ID");
            }
            newData[elem.id] = elem;

            $chips.data('chips', newData);
            $renderedChip.insertBefore($chips.find('input'));
            $chips.trigger('chip.add', elem);
            self.setPlaceholder($chips);
        });
    };

    this.deleteChip = function (chipIndex, $chips) {
        var $chip = $chips.find('.chip').eq(chipIndex);
        var chipId = $chip.data("id");
        var chip = $chips.data('chips')[chipId];
        $chip.remove();

        var newData = {};
        var oldData = $chips.data('chips');
        for (var id in oldData) {
            if (id != chipId) {
                newData[id] = oldData[id];
            }
        }

        $chips.data('chips', newData);
        $chips.trigger('chip.delete', chip);
        self.setPlaceholder($chips);
    };

    this.selectChip = function (chipIndex, $chips) {
        var $chip = $chips.find('.chip').eq(chipIndex);
        if ($chip && false === $chip.hasClass('selected')) {
            $chip.addClass('selected');
            $chips.trigger('chip.select', $chips.data('chips')[chipIndex]);
        }
    };

    this.getChipsElement = function (index, $chips) {
        return $chips.eq(index);
    };

    // init
    this.init();

    this.handleEvents();
};
// Warn if overriding existing method
if (Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l = this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});
