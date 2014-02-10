teacss.ui.dockPanel = (function($){
    return teacss.ui.panel.extend({
        init: function (options) {
            var ui = teacss.ui;
            var me = this;
            var lc = ui.panel({items:[
                this.leftPanel = ui.tabPanel(),
                this.centerPanel = ui.tabPanel(),
                this.leftSplitter = ui.splitter({panels:[this.leftPanel,this.centerPanel ],align:'left',size:2})
            ]});
            var lcr = ui.panel({items:[
                lc,
                this.rightPanel = ui.tabPanel(),
                this.rightSplitter = ui.splitter({panels:[this.rightPanel,lc],align:'right',size:2})
            ]});
            this._super($.extend({},options,{margin:0,items:[
                lcr,
                this.bottomPanel = ui.tabPanel(),
                this.bottomSplitter = ui.splitter({panels:[this.bottomPanel,lcr],align:'bottom',size:2})
            ]}));
            
            this.linkSplitter(this.leftPanel,this.leftSplitter);
            this.linkSplitter(this.rightPanel,this.rightSplitter);
            this.linkSplitter(this.bottomPanel,this.bottomSplitter);
            
            this.dropDiv = $("<div>").addClass("ui-drop-icons").hide().append(
                $("<div>").html("◄").data("tabPanel",this.leftPanel),
                $("<div>").html("▼").data("tabPanel",this.bottomPanel),
                $("<div>").html("►").data("tabPanel",this.rightPanel)
            )
            .appendTo(this.centerPanel.element);
            
            this.dropDiv.children().droppable({
                hoverClass: "hover",
                drop: function (e,ui) {
                    var sel = ui.draggable.find("a").attr("href");
                    var panel = $(sel);
                    var tab = panel.data("tab");
                    me.reorderTab($(this).data("tabPanel"),tab);
                    ui.draggable.data("dropped",true);
                }
            })
        },
        linkSplitter: function (panel,splitter) {
            function hide() {
                splitter.hidden = false;
                var val = splitter.getValue();
                splitter.setValue(-splitter.options.size);
                splitter.value = val;
                splitter.element.hide();
                splitter.hidden = true;
                panel.element.hide();
            }
            function show() {
                splitter.hidden = false;
                splitter.setValue(splitter.value);
                splitter.element.show();
                panel.element.show();
            }
            panel.element.data("tabPanel",panel);
            
            var old_setValue = splitter.setValue;
            splitter.setValue = function (val) {
                this.value = val;
                if (!splitter.hidden) old_setValue.call(this,val);
            }
                
            var me = this;
            splitter.change(function(){me.trigger("change")});
            
            hide();
            panel.bind("refresh",function(){
                if (this.count()) show(); else hide();
            })
            
            var cls = 'dock-nav';
            panel.element.find(".ui-tabs-nav").addClass(cls).sortable("destroy").sortable({
                connectWith: "."+cls,
                placeholder: 'ui-state-highlight ui-sortable-placeholder',
                forcePlaceholderSize: true,
                distance: 3,
                sort: function (event, ui) {
                    var that = $(ui.placeholder).parent();
                    var x = ui.offset.left;
                    that.children().each(function () {
                        if ($(this).hasClass('ui-sortable-helper') || $(this).hasClass('ui-sortable-placeholder')) return true;
                        var x2 = $(this).offset().left;
                        var w2 = $(this).width();
                        if (x>=x2 && x<=x2+w2) {
                            var holder = $('.ui-sortable-placeholder', that);
                            if (holder.index()<$(this).index())
                                holder.insertAfter(this);
                            else
                                holder.insertBefore(this);
                            return false;
                        }
                    });
                },
                helper: function(e, item) {
                    var h = item;
                    h.width(item.width()+2);
                    return h;
                },                    
                start: function (e,ui) {
                    $(this).css("overflow","visible").height($(this).height());
                    $(".ui-drop-icons").show();
                },
                stop: function (e,ui) {
                    $(this).css({overflow:"",height:""});
                    $(".ui-drop-icons").hide();
                    ui.item.css('width','');
                },
                receive: function (e,ui) {
                    var sel = ui.item.find("a").attr("href");
                    var panel = $(sel);
                    var tab = panel.data("tab");
                    var idx = ui.item.index();
                    $(ui.sender).sortable("cancel");
                    if (ui.item.data("dropped")) return;
                    me.reorderTab($(this).parent().data("tabPanel"),tab,idx);
                }
            });
        },      
        reorderTab: function (panel,tab,idx) {
            if (tab && panel) {
                var sel = $("#"+tab.options.id);
                setTimeout(function(){
                    tab.element.detach();
                    if (tab.tabPanel) tab.tabPanel.closeTab(tab,true);
                    panel.addTab(tab,idx);
                    panel.selectTab(tab);
                    
                    setTimeout(function(){
                        tab.element.find(".ui-accordion").accordion("resize");
                    },1);
                },1);
                
                if (tab.dockId) {
                    var pos = "left";
                    if (panel==this.rightPanel) pos = "right";
                    if (panel==this.bottomPanel) pos = "bottom";
                    
                    this.value = this.getValue();
                    this.value.tabs[tab.dockId] = pos;
                    this.trigger("change");
                }
            }
        },
        addTab: function (tab,id,defaultPos) {
            id = id || tab.element.attr("id");
            defaultPos = defaultPos || "left";
            
            var panel = this[defaultPos+"Panel"];
            this.value = this.getValue();
            if (id) {
                if (this.value.tabs[id]) {
                    var name = this.value.tabs[id]+"Panel";
                    panel = this[name];
                } else {
                    this.value.tabs[id] = defaultPos;
                    this.trigger("change");
                }
                tab.dockId = id;
            }
            panel.addTab(tab);
            return tab;
        },
        getValue: function () {
            return {
                left: this.leftSplitter.value,
                right: this.rightSplitter.value,
                bottom: this.bottomSplitter.value,
                tabs: (this.value && this.value.tabs) ? this.value.tabs : {}
            }
        },
        setValue: function (value) {
            this._super(value);
            if (value && value.left!==undefined && value.right!==undefined && value.bottom!==undefined) {
                this.leftSplitter.setValue(value.left);
                this.rightSplitter.setValue(value.right);
                this.bottomSplitter.setValue(value.bottom);
            }
        }
    })
})(teacss.jQuery);

teacss.ui.editorPanel = (function($){
    return teacss.ui.panel.extend({
        
        selectFile: function (file) {
            var me = this;
            var ui = teacss.ui;
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
            return tab;
        },
        
        init : function (options) {
            var me = this;
            var ui = teacss.ui;
            
            this.mainPanel = ui.dockPanel({});
            this.mainPanel.element.css({position:'absolute',left:0,right:0,top:27,bottom:0,'z-index':1});
            
            this.mainPanel.bind("change",function(){
                dayside.storage.set("mainLayout",this.getValue());
            });
            this.mainPanel.setValue(dayside.storage.get("mainLayout"));
            
            this.sidebarTabs = this.tabs = this.mainPanel.leftPanel;
            this.contentTabs = this.tabs2 = this.mainPanel.centerPanel;
            this.tabsForFiles = this.tabs2;
            
            // file tree tab
            this.filesTab = this.mainPanel.addTab(ui.panel("Files"),"filesTab");
            this.filePanel = ui.filePanel({
                jupload: options.jupload,
                onSelect: function (file) {
                    me.selectFile(file);
                }
            });
            this.filesTab.element.append(this.filePanel.element);
            
            // toolbar
            this.toolbar = new ui.panel({margin:0})
            this.toolbar.element
                .css({position:'absolute',left:0,right:0,top:0,padding:""})
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
            this.element.css({position:'fixed',left:0,top:0,right:0,bottom:0});
            
            this.element.appendTo("body").addClass("teacss-ui");
            
            // tabs state save
            this.bind("codeTabCreated",function(b,tab){
                setTimeout(me.saveTabs,1);
                tab.bind("close",function(){setTimeout(me.saveTabs,1)});
            });
            
            this.tabsForFiles.bind("select",function(){ me.saveTabs() });
            this.tabsForFiles.bind("sortstop",function(){ me.saveTabs() });
            
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
            
            var theme = value.theme || 'default';
            $("body").attr("class","cm-s-"+theme);
            
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
            styles.html(".CodeMirror {font-size:"+value.fontSize+"px !important; }");
            for (var t=0;t<ui.codeTab.tabs.length;t++) {
                var e = ui.codeTab.tabs[t].editor;
                if (e) e.refresh();
            }            
        },
        saveTabs: function () {
            var list = [];
            teacss.jQuery(".ui-tabs-panel").each(function(){
                var tab = teacss.jQuery(this).data("tab");
                var id = tab.options.id;
                var active_href = $(this).parent().find("> .ui-tabs-nav .ui-tabs-active a").attr("href");
                var selected = ("#"+id)==active_href;
                
                if (tab && tab.Class==teacss.ui.codeTab) {
                    list.push({file:tab.options.file,selected:selected});
                }
            });
            dayside.storage.set("tabs",list);
        },
        loadTabs: function () {
            var me = this;
            var list = dayside.storage.get("tabs");
            if (list && $.isArray(list)) setTimeout(function () {
                $.each(list,function(){
                    var tab = new teacss.ui.codeTab({file:this.file,closable:true,editorPanel:me});
                    me.tabsForFiles.push(tab);
                    if (this.selected)
                        me.tabsForFiles.selectTab(tab);
                });
            },1);
        }
        
    });
})(teacss.jQuery);