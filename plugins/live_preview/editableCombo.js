teacss.ui.editableCombo = teacss.ui.combo.extend({
    init: function (o) {
        var $ = teacss.jQuery;
        var input,me = this;
        this._super($.extend({
            items: [input = teacss.ui.html({html:
                "<input style='padding:5px;width:238px;border:1px solid #777' placeholder='Type to add items...'>"})],
            comboWidth: 250,
            labelTpl:"${label}",
            itemTpl: [
              "<div class='combo-item'>",
                "<span class='combo-label'>${label}</span>",
                "<span class='ui-icon ui-icon-close' style='float:right'></span>",
                //"<span class='ui-icon ui-icon-arrow-4' style='float:right'></span>",                
              "</div>"
            ].join(''),
            icons: { secondary: "ui-icon-triangle-1-s" }
        },o));
        
        input.element.keypress(function(e){
            if (e.which==13) {
                var val = $(this).val();
                if (val) {
                    for (var i=0;i<me.items.length;i++)
                        if (me.items[i].label==val) return;
                    $(this).val("").detach();
                    me.items.push({label:val,value:val});
                    me.refresh();
                    me.setSelected();
                    $(this).focus();
                    me.trigger("change");
                }
            }
        })
    },
    refresh: function () {
        var me = this;
        this._super();
        this.panel.find(".ui-icon-close").mousedown(function (e) {
            e.stopPropagation();
            var item = teacss.jQuery(this).parent().data("item");
            me.items.splice(me.items.indexOf(item),1);
            me.items[0].element.detach();
            me.refresh();
            me.trigger("change");
       });
    },
    setValue: function (val) {
        if (!val || !val.list) return;
        this.items = [this.items[0]];
        for (var i=0;i<val.list.length;i++)
            this.items.push({label:val.list[i],value:val.list[i]});
        this.items[0].element.detach();
        this.refresh();
        this._super(val.selected);
    },
    getValue: function () {
        var selected = this.value;
        var list = [];
        for (var i=1;i<this.items.length;i++)
            list.push(this.items[i].label);
        return {list:list,selected:selected};
    }
})