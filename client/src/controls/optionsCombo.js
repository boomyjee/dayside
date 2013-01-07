teacss.ui.optionsCombo = (function($){
    return teacss.ui.Combo.extend({},{
        init: function (options) {
            this.defaults = {
                fontSize: 14,
                tabSize: 4,
                useTab: false
            }
            
            var ui = teacss.ui;
            var me = this;
            var panel,check;
            this.form = ui.form(function(){
                panel = ui.panel({width:200,height:'auto',margin:0}).push(
                    ui.label({template:'Font size: ${value}px',name:'fontSize',margin:"0 0 0 5px"}),
                    ui.slider({min:10,max:24,margin:"0px 15px 5px",name:'fontSize'}),
                    ui.label({template:'Tab size: ${value}',name:'tabSize',margin:"0 0 0 5px"}),
                    ui.slider({min:1,max:16,margin:"0px 15px 5px",name:'tabSize'}),
                    check = ui.check({margin:"5px 15px 10px 10px",width:'auto',label:'Use tab character',name:'useTab'})
                );
            });
            check.element.css("font-size",10);
            this._super($.extend(options,{items:[panel]}));
            this.loadValue();
            this.form.bind("change",function(){
                me.value = me.form.value;
                me.trigger("change");
                me.saveValue();
            });
        },
        saveValue: function () {
            dayside.storage.set("options",this.value);
        },
        loadValue: function () {
            this.value = $.extend({},this.defaults,dayside.storage.get("options",{}));
            this.form.setValue(this.value);
        }
    });
})(teacss.jQuery);