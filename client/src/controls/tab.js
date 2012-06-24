teacss.ui.tab = teacss.ui.Panel.extend({},{
    init : function (options) {
        var $ = teacss.jQuery;
        this._super(options);
        this.element.css({
            position: 'absolute', display: 'block',
            top: 0, bottom: 0, right: 0, left: 0, margin: 0
        });
    }
});