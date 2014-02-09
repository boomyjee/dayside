(function($,ui){
    
var themes = [
    'default','3024-day','3024-night','ambiance','base16-dark','base16-light',
    'blackboard','cobalt','eclipse','elegant','erlang-dark','lesser-dark','mbo','midnight',
    'monokai','neat','night','paraiso-dark','paraiso-light','pastel-on-dark','rubyblue',
    'solarized','the-matrix','tomorrow-night-eighties','twilight',
    'vibrant-ink','xq-dark','xq-light'
];    
    
ui.optionsCombo = teacss.ui.Combo.extend({
    init: function (options) {
        this.defaults = {
            fontSize: 14,
            tabSize: 4,
            useTab: false
        }

        var ui = teacss.ui;
        var me = this;
        var panel,check;
        
        var themeOptions = {};
        $.each(themes,function(t,theme){ themeOptions[theme] = theme; });
        
        this.form = ui.form(function(){
            panel = ui.panel({width:200,height:'auto',margin:0,padding:"5px 10px 10px"}).push(
                ui.label({template:'Font size: ${value}px',name:'fontSize',margin:"0"}),
                ui.slider({min:10,max:24,margin:"0px 15px 0px",name:'fontSize'}),
                ui.label({template:'Tab size: ${value}',name:'tabSize',margin:"0 0 0 0"}),
                ui.slider({min:1,max:16,margin:"0px 15px 0px",name:'tabSize'}),
                check = ui.check({margin:"10px 15px 5px 15px",width:'100%',label:'Use tab character',name:'useTab'}),
                ui.label({template:'Theme:',margin:"0 0 0 0"}),
                ui.select({name: 'theme', items: themeOptions,width:"100%", comboDirection: 'right', comboHeight: 1000, margin: "-3px 0 0 0" })
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
    
})(teacss.jQuery,teacss.ui);