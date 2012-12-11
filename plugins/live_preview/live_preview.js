teacss.ui.editableCombo = teacss.ui.combo.extend({
    init: function (o) {
        var $ = teacss.jQuery;
        var input,me = this;
        this._super($.extend({
            items: [input = teacss.ui.html({html:
                "<input style='padding:5px;width:236px;border:1px solid #777' placeholder='Type to add items...'>"})],
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

exports = dayside.plugins.live_preview = teacss.jQuery.Class.extend({
    get_url: function (what) { 
        return FileApi.root+"/"+(what ? what.replace(/\/$/,'') : ""); 
    },
    events: teacss.ui.eventTarget(),
    instance: false
},{
    loadPages: function () {
        return dayside.storage.get("previewPages",{});
    },
    savePages: function (pages) {
        dayside.storage.set("previewPages",pages);
    },
    init: function () {
        var me = this;
        var ed = dayside.editor;
        var ui = teacss.ui;
        var $ = teacss.jQuery;
        
        var moving_tabs = false;
        
        me.live_preview = false;
        me.delay = 100;
        
        dayside.plugins.live_preview.instance = this;
        var changes = {};
        
        function tabChanged(tab) {
            changes[tab.options.id] = tab;
            clearTimeout(me.tabChangedTimeout);
            me.tabChangedTimeout = setTimeout(function(){
                for (var key in changes) {
                    me.Class.events.trigger("tabChanged",{tab:changes[key],plugin:me});
                }
                changes = {};
            },me.delay);
        }
        
        function tabClosed(tab) {
            tab.editor.getValue = function (){ return FileApi.cache[tab.options.file] };
            tabChanged(tab);
        }
        
        ed.bind("codeTabCreated",function (b,tab){
            tab.bind("close",function(b,e){
                if (!moving_tabs && tab && tab.editor && !e.cancel) tabClosed(tab);
            });
        })
        ed.bind("codeChanged",function(b,tab){ if (me.live_preview) tabChanged(tab) });
        ed.toolbar.push(
            me.button = teacss.ui.button({
                label:"Live preview",
                margin: 0,
                icons: { primary: "ui-icon-link" },
                click: function(){
                    me.live_preview = !me.live_preview;
                    dayside.storage.set("previewEnabled",me.live_preview);
                    
                    var codeTabs, layout_key, layout_def;
                    if (me.live_preview) {
                        codeTabs = ed.tabs;
                        layout_key = "mainLayout_live";
                        layout_def = {left:900,right:300,bottom:300};
                        this.element.css("background","#fc7");
                    } else {
                        codeTabs = ed.tabs2;
                        layout_key = "mainLayout";
                        layout_def = undefined;
                        this.element.css("background","");
                    }
                    
                    delete ed.mainPanel.listeners["change"];
                    ed.mainPanel.change(function (){
                        dayside.storage.set(layout_key,this.getValue());
                    });
                    ed.mainPanel.setValue(dayside.storage.get(layout_key,layout_def));
                    
                    moving_tabs = true;
                    if (ed.tabsForFiles != codeTabs) {
                        var selected = ed.tabsForFiles.selectedTab();
                        for (var t=0;t<ui.codeTab.tabs.length;t++) {
                            var tab = ui.codeTab.tabs[t];
                            tab.element.detach();
                            ed.tabsForFiles.element.tabs("remove","#"+tab.options.id);
                            codeTabs.addTab(tab);
                            tab.editorChange();
                        }
                        ed.tabsForFiles = codeTabs;
                        if (selected) {
                            ed.tabsForFiles.selectTab(selected);
                        }
                    }
                    moving_tabs = false;
                    me.Class.events.trigger("modeChanged",{plugin:me});
                }
            })
        );
    
        var frame;
        var pageCombo = ui.editableCombo({change:function(){
            me.savePages(this.getValue());
            var url = me.Class.get_url(this.getValue().selected);
            if (me.url!=url) loadPreview(url);
        }});
        pageCombo.setValue(me.loadPages());
        
        var initial_page = pageCombo.getValue().selected;
        if (!initial_page) initial_page = "";
        
        var previewTab = me.previewTab = ui.panel("Preview:").push(
            me.frame = frame = $("<iframe>")
                .attr("id","preview_frame")
                .attr("src", dayside.url+"/plugins/live_preview/blank.htm")
                .css({width: "100%", height: "100%"})
        );

        function loadPreview(url) {
            var pages = pageCombo.getValue();
            pages.selected = false;
            for (var i=0;i<pages.list.length;i++) {
                var test_url = me.Class.get_url(pages.list[i]);
                if (test_url==url) pages.selected = pages.list[i];
            }
            pageCombo.setValue(pages);
            me.url = url;
            
            $.cookie("live_preview_request", "1", { path: "/" });
            $.get(url,function(html){
                var data = { plugin: me, html: html };
                me.Class.events.trigger("beforeRefresh",data);
                html = data.html;
                var doc = me.frame[0].contentWindow.document;
                
                // replace all relative url to absolute 
                // because we're inserting content to new addresss
                html = html.replace(/(src|href)\s*=\s*('|")(.*?)('|")/gm,function(){
                    var attr = arguments[1];
                    var path = arguments[3];
                    
                    if (!teacss.path.isAbsoluteOrData(path) && path[0]!="#") {
                        var parts = url.split("/");
                        if (path) {
                            parts.pop();
                            var dir = parts.join("/");
                            path = dir+"/"+path;
                        } else {
                            path = url + path;
                        }
                    }
                    return attr+"='"+path+"'";
                });
                
                doc.open();
                doc.write(html);
                doc.close();
                
                $(doc).off("click");
                $(doc).on("click","a",function(e){
                    e.preventDefault();
                    var href = $(e.target).attr("href");
                    
                    if (!href) return;
                    if (href[0]=="#") return;
                    var link = doc.createElement("a");
                    link.href = href;
                    href = link.href.split("#")[0];
                    if (href!=me.url) loadPreview(href);
                });
                me.Class.events.trigger("refresh",data);
            });
        }
        loadPreview(me.Class.get_url(initial_page));

        previewTab.bind("select",function(){
            for (var t=0;t<ui.codeTab.tabs.length;t++) {
                var tab = ui.codeTab.tabs[t];
                tabChanged(tab);
            }
        });
        
        if (dayside.storage.get("previewEnabled")) {
            me.button.element.click();
        }
        
        ed.tabs2.addTab(previewTab,0);
        previewTab.element.parent().addClass("iframe-tab");
        if (dayside.storage.get("previewSelected")) ed.tabs2.selectTab(previewTab);
        ed.tabs2.bind("select",function(b,tab){
            dayside.storage.set("previewSelected",tab==previewTab);
        });
        
        ed.tabs2.element.find("ul:first-child li:first-child").eq(0)
        .append(
            pageCombo.element,
            $("<span class='ui-icon ui-icon-refresh'>").css({display:"inline-block",float:"none"})
            .click(function(e){
                loadPreview(me.url);
                ed.tabs2.selectTab(previewTab);
            })
        )
    }
});

// handler for css files out of the box
dayside.plugins.live_preview.events.bind("tabChanged", function (b,e) {
    var tab = e.tab;
    var frame = e.plugin.frame;
    
    var file = tab.options.file;
    var ext = file.split(".").pop();
    if (ext!="css") return;
    
    var found = false;
    var $ = teacss.jQuery;
    
    frame.contents().find("link").each(function(){
        var href = $(this).attr("href");
        var a = frame[0].contentWindow.document.createElement("a");
        a.href = href;
        href = a.href;
        
        if (href==file) {
            found = this;
        }
    });
    var id = file.replace(/[^A-Za-z_]/g,'_');
    if (!found)
        found = frame.contents().find("#"+id)[0];

    if (found) {
        var css = tab.editor.getValue();
        var node = frame[0].contentWindow.document.createElement("style");
        node.type = "text/css";
        node.id = id;

        var rules = document.createTextNode(css);
        if (node.styleSheet) {
            node.styleSheet.cssText = rules.nodeValue;
        } else {
            node.innerHTML = "";
            node.appendChild(rules);
        }
        $(found).after(node).remove();
    }
});