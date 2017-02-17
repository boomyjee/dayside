(function($,ui){
    
var themes = [
    'vs',
    'vs-dark dark-ui',
    'hc-black dark-ui'
];    
    
ui.optionsButton = teacss.ui.Button.extend({
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
        $.each(themes,function(t,theme){ themeOptions[theme] = theme.split(" ")[0]; });
        
        this.loadValue();
        this.updateOptions();
        
        me.form = ui.form(function(){
            panel = ui.tabPanel({width:"100%",height:'auto',margin:0,padding:0});
            var editorTab = ui.panel({label:"Editor",padding:"1em"}).push(
                ui.label({template:'Font size: ${value}px',name:'fontSize',margin:"5px 0"}),
                ui.slider({min:10,max:24,margin:"0px 15px 0px",name:'fontSize'}),
                ui.label({template:'Tab size: ${value}',name:'tabSize',margin:"5px 0"}),
                ui.slider({min:1,max:16,margin:"0px 15px 0px",name:'tabSize'}),
                check = ui.check({margin:"10px 15px 5px 15px",width:'100%',label:'Use tab character',name:'useTab'}),
                ui.label({template:'Theme:',margin:"5px 0"}),
                ui.select({name: 'theme', items: themeOptions,width:"100%", comboDirection: 'bottom', comboHeight: 1000, margin: "-3px 0 0 0" })
            );
            panel.addTab(editorTab);
            dayside.core.trigger("configTabsCreated",{tabs:panel});
        });

        me.form.setValue(me.value);
        me.form.bind("change",function(){
            me.value = me.form.value;
            me.updateOptions();
            me.trigger("change");
            me.saveValue();
        });

        this.dialog = ui.dialog({
            title: options.label,
            width: 300,
            resizable: false,
            draggable: true,
            dialogClass: "dayside-config-dialog",
            items: [panel]
        });
        
        this._super($.extend({
            click: function () {
                me.dialog.open();
            }
        },options));
    },
    saveValue: function () {
        dayside.storage.set("options",this.value);
    },
    loadValue: function () {
        dayside.core.trigger("configDefaults",{value:this.defaults});
        this.value = $.extend({},this.defaults,dayside.storage.get("options",{}));
    },
    updateOptions: function () {
        var ui = teacss.ui;
        var value = this.value;
        var me = this;
        
        dayside.core.trigger("configUpdate",{value:this.value});

        $("body").attr("class","theme-"+value.theme);
        
        this.editorOptions = {
            fontSize: value.fontSize,
            lineHeight: value.fontSize,
            theme: (value.theme || "").split(" ")[0],
            modelOptions: {
                insertSpaces: !value.useTab,
                tabSize: value.tabSize
            }
        }
        
        if (!this.editorOptionsHandler) {
            this.editorOptionsHandler = function (b,e){
                e.options = $.extend(e.options,me.editorOptions);
            }
            dayside.editor.bind("editorOptions",this.editorOptionsHandler);
        }
        
        for (var t=0;t<ui.codeTab.tabs.length;t++) {
            var e = ui.codeTab.tabs[t].editor;
            if (e) {
                e.updateOptions(this.editorOptions);
                e.getModel().updateOptions(this.editorOptions.modelOptions);
            }
        }         

        // create dynamic CSS node to reflect fontSize changes for CodeMirror
        var styles = $("#ideStyles");
        if (styles.length==0) {
            styles = $("<style>").attr({type:"text/css",id:"ideStyles"}).appendTo("head");
        }
        styles.html(".code-text {font-size:"+value.fontSize+"px !important; }");
    }  
});
    
})(teacss.jQuery,teacss.ui);