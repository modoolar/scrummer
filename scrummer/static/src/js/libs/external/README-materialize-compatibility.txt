1. $.fn.modal is in conflict with odoo's modal, so here is renamed to $.fn.materialModal
2. appendOptionWithIcon in select plugin is extended with following code to enable materialdesignicons inside option
var mdi = option.data('mdi');
var iconColor = option.data('iconColor');
if (!!mdi) {
    var classString = (!!classes) ? ' class="mdi mdi-' + mdi + ' ' + classes + '"' : ' class="mdi mdi-' + mdi + '"';
    var styleString = 'style="' + (mdi.startsWith("custom-") ? 'background-color' : 'color') + ':' + iconColor + '"';
    // Check for multiple type.
    if (type === 'multiple') {
        options.append($('<li class="' + disabledClass + '"><span><input type="checkbox"' + disabledClass + '/><label></label> <i' + classString + styleString + '/> ' + option.html() + '</span></li>'));
    } else {
        options.append($('<li class="' + disabledClass + optgroupClass + '"><span><i' + classString + styleString + '/> ' + option.html() + '</span></li>'));
    }
    return true;
}
3. Updated Waves to 0.7.5 (Replaced sass _Waves and changed materialize.js)
4. When closing modal of materialNote, event is propagated to main modal and it's also getting closed, so stopping propagation is added in line 2631:
$(this).on('closeModal', function (e) {
                    e.stopPropagation();