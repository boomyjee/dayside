teacss.ui.editorPanel = (function($){
    return teacss.ui.Panel.extend({},{
        init : function (options) {
            var me = this;
            var ui = teacss.ui;
            
            // left tab panel (for file tree & code)
            this.sidebarTabs = this.tabs = ui.tabPanel({});
            // right tab panel (for preview & code)
            this.contentTabs = this.tabs2 = ui.tabPanel({});
            // code tabs opened in right panel for default
            this.tabsForFiles = this.tabs2;
            
            // file tree tab
            this.filesTab = ui.panel("Files");
            this.tabs.addTab(this.filesTab);
            
            this.filePanel = ui.filePanel({
                jupload: options.jupload,
                onSelect: function (file) {
                    var tab;
                    for (var i=0;i<ui.codeTab.tabs.length;i++) {
                        if (ui.codeTab.tabs[i].options.file==file)
                            tab = ui.codeTab.tabs[i];
                    }
                    if (!tab) {
                        tab = ui.codeTab({file:file,closable:true,editorPanel:me});
                        me.tabsForFiles.addTab(tab);
                    }
                    me.tabsForFiles.selectTab(tab);
                }
            });
            this.filesTab.element.append(this.filePanel.element);
            
            // splitter to make tab panels resizable
            this.splitter = ui.splitter({ panels:[this.tabs,this.tabs2] });
            this.splitter.bind("change",function(){
                dayside.storage.set("splitterPos",this.value);
            });
            this.splitter.setValue(dayside.storage.get("splitterPos",600));
            
            this.mainPanel = new ui.panel({items:[this.tabs,this.tabs2,this.splitter],margin:0});
            this.mainPanel.element.css({position:'absolute',left:0,right:0,top:27,bottom:0,'z-index':1});
            
            this.toolbar = new ui.panel({margin:0})
            this.toolbar.element
                .css({position:'absolute',left:0,right:0,top:0})
                .addClass("editorPanel-toolbar");
            
            // options combo with editor and layout options
            this.optionsCombo = new ui.optionsCombo({
                label:"Config",
                icons:{primary:'ui-icon-gear'},
                margin: 0, comboWidth: 200,
                change: $.proxy(this.updateOptions,this)
            });
            this.optionsCombo.element
                .appendTo(this.toolbar.element);
            
            this.updateOptions();
            this.loadTabs();
            
            this._super($.extend({items:[this.toolbar,this.mainPanel],margin:0},options||{}));
            this.element.css({position:'fixed',left:0,top:0,right:0,bottom:0,});
            
            this.element.appendTo("body").addClass("teacss-ui");
            
            // tabs state save
            this.bind("codeTabCreated",function(b,tab){
                setTimeout(me.saveTabs,1);
                tab.bind("close",function(){setTimeout(me.saveTabs,1)});
            });
            $(".ui-tabs").bind("tabsselect",function(){setTimeout(me.saveTabs,1)});
            $(".ui-tabs-nav").bind("sortstop",me.saveTabs);
            
            // context menu for tabs
            $(document).on("contextmenu",".ui-tabs-nav > li",function(e){
                if (e.which==3) {
                    var li = this;
                    var id = $(this).find("a:first").attr("href");
                    var tab = $(this).parents(".ui-tabs").eq(0).find(id).data("tab");
                    if (tab) {
                        var items = {
                            close: {
                                label: "Close",
                                action: function () {
                                    me.tabsForFiles.closeTab(tab);
                                }
                            },
                            closeAll: {
                                label: "Close all",
                                action: function () {
                                    items.closeOthers.action();
                                    items.close.action();
                                }
                            },
                            closeOthers: {
                                label: "Close others",
                                action: function () {
                                    var tabs = $(li).parents(".ui-tabs").eq(0);
                                    $(li).siblings().each(function(){
                                        var id = $(this).find("a").attr("href");
                                        var other = tabs.find(id).data("tab");
                                        if (tab) me.tabsForFiles.closeTab(other);
                                    });                                    
                                }
                            },
                            save: {
                                label: "Save",
                                separator_before: true,
                                action: function () {
                                    tab.saveFile();
                                }
                            }
                        }
                            
                        if (!tab.options.closable) delete items.close;
                        if ($(this).siblings().length==0) {
                            delete items.closeOthers;
                            delete items.closeAll;
                        }
                        if (!$(this).hasClass("changed")) delete items.save;
                        
                        var pos = $(this).offset();
                        $.vakata.context.show(items,false,pos.left,pos.top+$(this).height());
                        $("#vakata-contextmenu").addClass("jstree-default-context");
                    }
                    e.preventDefault();
                }
            });
        },
        // triggered when optionsCombo value changes
        updateOptions: function () {
            var ui = teacss.ui;
            var value = this.optionsCombo.value;
            
            // apply indent settings to CodeMirror defaults and opened editors
            CodeMirror.defaults.tabSize = value.tabSize;
            CodeMirror.defaults.indentUnit = value.tabSize;
            CodeMirror.defaults.indentWithTabs = value.useTab;
            
            for (var t=0;t<ui.codeTab.tabs.length;t++) {
                var e = ui.codeTab.tabs[t].editor;
                if (e) {
                    e.setOption("tabSize",value.tabSize);
                    e.setOption("indentUnit",value.tabSize);
                    e.setOption("indentWithTabs",value.useTab);
                }
            }             
            
            // create dynamic CSS node to reflect fontSize changes for CodeMirror
            var styles = $("#ideStyles");
            if (styles.length==0) {
                styles = $("<style>").attr({type:"text/css",id:"ideStyles"}).appendTo("head");
            }
            styles.html(".CodeMirror {font-size:"+value.fontSize+"px !important; line-height:"+(value.fontSize)+"px !important;}");
            for (var t=0;t<ui.codeTab.tabs.length;t++) {
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
                for (var t=0;t<ui.codeTab.tabs.length;t++) {
                    var tab = ui.codeTab.tabs[t];
                    tab.element.detach();
                    this.tabsForFiles.element.tabs("remove",'#'+tab.element.attr("id"));
                    tabsForFiles.addTab(tab);
                }
                this.tabsForFiles = tabsForFiles;
            }            
        },
        saveTabs: function () {
            var hash = {};
            teacss.jQuery(".ui-tabs-panel").each(function(){
                var tab = teacss.jQuery(this).data("tab");
                var id = tab.options.id;
                var active_href = $(this).parent().find("> .ui-tabs-nav .ui-tabs-selected a").attr("href");
                var selected = ("#"+id)==active_href;
                
                if (tab && tab.Class==teacss.ui.codeTab) {
                    hash[tab.options.file] = selected;
                }
            });
            dayside.storage.set("tabs",hash);
        },
        loadTabs: function () {
            var me = this;
            var hash = dayside.storage.get("tabs");
            if (hash) setTimeout(function () {
                for (var file in hash) {
                    var tab = new teacss.ui.codeTab({file:file,closable:true,editorPanel:me});
                    me.tabsForFiles.push(tab);
                    if (hash[file])
                        me.tabsForFiles.selectTab(tab);
                }
            },1);
        }
        
    });
})(teacss.jQuery);