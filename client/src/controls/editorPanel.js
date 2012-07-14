teacss.ui.editorPanel = (function($){
    return teacss.ui.Panel.extend({},{
        init : function (options) {
            var me = this;
            var ui = teacss.ui;
            
            // left tab panel (for file tree & code)
            this.tabs = ui.tabPanel({});
            // right tab panel (for preview & code)
            this.tabs2 = ui.tabPanel({});
            // code tabs opened in right panel for default
            this.tabsForFiles = this.tabs2;
            
            // file tree tab
            this.filesTab = ui.tab({caption:"Files"});
            this.tabs.addTab(this.filesTab);
            
            this.filePanel = ui.filePanel({
                jupload: options.jupload,
                onSelect: function (file) {
                    var tab = ui.codeTab.find(file);
                    if (!tab) {
                        tab = ui.codeTab({file:file,closable:true});
                        tab.editorPanel = me;
                        me.tabsForFiles.addTab(tab);
                    } else {
                        if ($("#"+tab.options.id).length==0) {
                            me.tabsForFiles.addTab(tab);
                            tab.editorChange();
                        }
                    }
                    me.tabsForFiles.selectTab(tab);
                }
            });
            this.filesTab.element.append(this.filePanel.element);
            
            // splitter to make tab panels resizable
            this.splitter = ui.splitter({ panels:[this.tabs,this.tabs2] });
            this.splitter.bind("change",function(){
                $.jStorage.set("editorPanel_splitterPos",this.value);
            });
            this.splitter.setValue($.jStorage.get("editorPanel_splitterPos",600));
            this._super($.extend({items:[this.tabs,this.tabs2,this.splitter]},options||{}));
           
            this.element.css({position:'absolute',left:0,top:27,right:0,bottom:0,border:'1px solid #ddd','z-index':1});
            this.element.appendTo("body").addClass("teacss-ui");
    
            
            // options combo with editor and layout options
            this.optionsCombo = new ui.optionsCombo({
                label:"Config",
                icons:{primary:'ui-icon-gear'},
                margin: 0, comboWidth: 200,
                change: $.proxy(this.updateOptions,this)
            });
            this.optionsCombo.element
                .css({position:'absolute',left:3,top:-25,'font-size':'12px'})
                .appendTo(this.element);
            this.optionsCombo.element.find(".ui-button-text").css({padding:"0.15em 1em 0.15em 2.1em"});
   
            this.updateOptions();
        },
        // triggered when optionsCombo value changes
        updateOptions: function () {
            var ui = teacss.ui;
            var value = this.optionsCombo.value;
            
            // create dynamic CSS node to reflect fontSize changes for CodeMirror
            var styles = $("#ideStyles");
            if (styles.length==0) {
                styles = $("<style>").attr({type:"text/css",id:"ideStyles"}).appendTo("head");
            }
            styles.html(".CodeMirror {font-size:"+value.fontSize+"px !important; line-height:"+(value.fontSize)+"px !important;}");
            for (var t in ui.codeTab.tabs) {
                var e = ui.codeTab.tabs[t].editor;
                if (e) e.refresh();
            }            
        
            // select where code tabs are located
            if (value.editorLayout=="left") {
                var tabsForFiles = this.tabs;
            } else {
                var tabsForFiles = this.tabs2;
            }
            
            // move already opened code tabs to the right panel if needed
            if (this.tabsForFiles != tabsForFiles) {
                for (var t in ui.codeTab.tabs) {
                    var tab = ui.codeTab.tabs[t];
                    tab.element.detach();
                    this.tabsForFiles.element.tabs("remove",'#'+tab.element.attr("id"));
                    tabsForFiles.addTab(tab);
                }
                this.tabsForFiles = tabsForFiles;
            }            
        }
    });
})(teacss.jQuery);