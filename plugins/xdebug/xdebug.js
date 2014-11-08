(function ($,ui) {


var breakpointsPanel = ui.panel.extend({
    init: function (o) {
        this._super(o);
        this.element.addClass("breakpoints-panel");
        this.table = $("<table>").css({width:"100%"}).appendTo(this.element);
        
        var plugin = o.plugin;
        this.element.on("click","a.remove",function(e){
            e.preventDefault();
            var data = $(this).parents("tr").data("breakpoint");
            plugin.setBreakpoint(data.file,data.line,false);
        });
        this.element.on("click","a.goto",function(e){
            e.preventDefault();
            var data = $(this).parents("tr").data("breakpoint");
            plugin.breakOn(data.file,data.line,false);
        });
    },
    
    setValue: function (val) {
        this._super(val);
        this.table.empty();

        var me = this;
        $.each(val,function(file,list){
            $.each(list,function(line,text) {
                line = parseInt(line);
                me.table.append(
                    $("<tr>").append(
                        $("<td>").addClass('remove').append(
                            $("<a href='#'>").addClass("remove").append(
                                $("<span class='ui-icon ui-icon-close'>")
                            )
                        ),
                        $("<td>").append(
                            $("<a href='#'>").addClass("goto").text(file+" ("+line+")"),
                            $("<pre>").text(text)
                        )
                    ).data("breakpoint",{file:file,line:line})
                );
            });
        });
    }
});
    
var stackPanel = ui.panel.extend({
    init: function (o) {
        this._super(o);
        this.element.addClass("breakpoints-panel");
        this.table = $("<table>").css({width:"100%"}).appendTo(this.element);
        
        var plugin = o.plugin;
        this.element.on("click","a.goto",function(e){
            e.preventDefault();
            var data = $(this).parents("tr").data("stack");
            plugin.breakOn(data.file,data.line,false);
        });
    },
    
    setValue: function (val) {
        val = val || [];
        this._super(val);
        this.table.empty();

        var me = this;
        $.each(val,function(i,data) {
            var line = parseInt(data.line);
            var file = data.file;
            me.table.append(
                $("<tr>").append(
                    $("<td>").append(
                        $("<a href='#'>").addClass("goto").text(file+" ("+line+")"),
                        $("<pre>").text(data.where)
                    )
                ).data("stack",{file:file,line:line})
            );
        });
    }
});
    
var watchPanel = ui.panel.extend({
    init: function (o) {
        this._super(o);
        this.element.addClass("breakpoints-panel");
        this.tree = $("<div>")
            .appendTo(this.element)
            .jstree({
                core: {
                    html_titles: true
                },
                json_data: {
                    data: []
                },
                plugins : ["json_data","themes","cookies"]  
            })
        
        var plugin = o.plugin;
        var me = this;
        
        this.element.css({overflow:"hidden"});
        this.element.on("click",function(e){
            e.preventDefault();
        });
        this.setValue(false);
    },
    
    setValue: function (val) {
        val = val || [];
        // val = [{fullname:"bla",value:"123"},{fullname:"bla",children:[{fullname:"123",value:"123"},{fullname:"234"}]}];
        this._super(val);
        
        console.debug('watch',val);
        
        function json_data(list,data,depth) {
            depth = depth || 0;
            var res = {};
            if (data && data.fullname) {
                res.data = data.fullname;
                res.attr = { id: 'id_'+data.fullname.replace(/[^0-9a-zA-Z]/g, "__") };
                if (data.value) {
                    res.data += "<div style='left:-"+(depth*18)+"px'><span>"+data.value+"</span></div>";
                }
            }
            if (list) {
                res.children = [];
                $.each(list,function(){
                    res.children.push(json_data(this.children,this,depth+1));
                });
            }
            return res;
        }
        
        var settings = $.jstree._reference(this.tree[0])._get_settings();
        settings.json_data.data = json_data(val).children;
        this.tree.jstree('refresh',-1);
    }    
});

dayside.plugins.xdebug = teacss.jQuery.Class.extend({
    init: function (options) {
        var me = this;
        
        if (this.Class.instance) return;
        this.Class.instance = this;
        
        me.options = teacss.jQuery.extend({
            cookie: 'dayside-xdebug'
        },options);
        
        dayside.ready(function(){
            dayside.editor.bind("editorOptions",function(b,e){
                
                if (e.tab.options.file.split(".").pop()!="php") return;
                
                var gutters = e.options.gutters || [];
                gutters.push("breakpoints");
                e.options.gutters = gutters;
            });

            dayside.editor.bind("editorCreated",function(b,e){
                
                var file = e.tab.options.file;
                if (e.tab.options.file.split(".").pop()!="php") return;
                
                var cm = e.cm;
                var br_list = me.breakpoints[file] || {};
                for (var n in br_list) {
                    n = parseInt(n);
                    me.setBreakpoint(file,n,cm.getLine(n),cm,true);
                }
                
                cm.on("gutterClick", function(cm, n) {
                    var info = cm.lineInfo(n);
                    var isset = info.gutterMarkers && info.gutterMarkers.breakpoints;
                    me.setBreakpoint(file,n,isset ? false : cm.getLine(n),cm);
                });
                
                if (me.debugCurrent && me.debugCurrent.file==file) {
                    me.breakOn(me.debugCurrent.file,me.debugCurrent.line,true);
                }
            });
            
            me.breakpoints = dayside.storage.get("xdebug_breakpoints") || {};
            me.breakpointsChanged();
            me.enabled = false;
            
            me.button = new teacss.ui.button({
                label:"Debug",
                icons:{primary:'ui-icon-wrench'}, margin: 0,
                click: function () {
                    if (!me.enabled) {
                        me.enable();
                    } else {
                        me.disable();
                    }
                }
            });
            me.button.element.appendTo(dayside.editor.toolbar.element);            
            
            me.runButton = new teacss.ui.button({
                label:"Run",
                icons:{primary:'ui-icon-triangle-1-e'},margin: 0,
                click: function () { me.run() }
            });
            me.stepIntoButton = new teacss.ui.button({
                label:"Step In",
                icons:{primary:'ui-icon-arrowstop-1-s'},margin: 0,
                click: function () { me.stepInto() }
            });
            me.stepOverButton = new teacss.ui.button({
                label:"Step Over",
                icons:{primary:'ui-icon-arrowthick-1-e'},margin: 0,
                click: function () { me.stepOver() }
            });
            me.stepOutButton = new teacss.ui.button({
                label:"Step Out",
                icons:{primary:'ui-icon-arrowreturnthick-1-n'},margin: 0,
                click: function () { me.stepOut() }
            });
            
            me.controlButtons = me.runButton.element
                .add(me.stepIntoButton.element)
                .add(me.stepOverButton.element)
                .add(me.stepOutButton.element)
            
            dayside.editor.toolbar.element.append(me.controlButtons.hide());
            
            this.root = false;
            FileApi.request('xdebug_path',{path:FileApi.root},true,function(res){
                me.root = "file://"+res.data.path;
            });
            
            dayside.editor.bind("codeSaved",function(b,tab){ me.codeSaved(tab); });
            
            var keys = {
                "f10" : me.stepOver,
                "f11" : me.stepInto,
                "shift+f11" : me.stepOut,
                "f8" : me.run
            };
            
            teacss.jQuery.each(keys,function(key,f){
                teacss.jQuery(document).bind("keydown",key,function(e){
                    e.preventDefault();
                    return false;
                });
                teacss.jQuery(document).bind("keyup",key,function(e){
                    f.call(me);
                    e.preventDefault();
                    return false;
                });
            });            
            
            dayside.editor.bind("editorCreated",function(b,e){
                var cm = e.cm;
                teacss.jQuery.each(keys,function(key,f){
                    $(e.cm.display.input).bind("keydown",key,function(e){
                        e.preventDefault();
                        return false;
                    });
                    $(e.cm.display.input).bind("keyup",key,function(e){
                        f.call(me);
                        e.preventDefault();
                        return false;
                    });
                });
            });
        });

        
        this.tid = 1;
        this.status = "stop";
    },
    
    breakpointsChanged: function () {
        var me = this;
        if (me.breakpointsPanel) me.breakpointsPanel.setValue(me.breakpoints);
        dayside.storage.set("xdebug_breakpoints",me.breakpoints);
    },
    
    setBreakpoint: function (file,n,text,cm,silent) {
        var me = this;
        
        if (!cm) {
            $.each(ui.codeTab.tabs,function(i,tab){
                if (tab.options.file==file) {
                    cm = tab.editor;
                }
            });
        }
        
        function makeMarker() {
            var marker = document.createElement("div");
            marker.style.color = "#822";
            marker.innerHTML = "●";
            return marker;
        }    
        
        me.breakpoints[file] = me.breakpoints[file] || {};
        if (text!==false) {
            me.breakpoints[file][n] = text;
            if (cm) cm.setGutterMarker(n, "breakpoints", makeMarker());
        } else {
            delete me.breakpoints[file][n];
            if (cm) cm.setGutterMarker(n, "breakpoints", null);
        }
        if (!silent) {
            me.breakpointsChanged();
            if (me.status!="stop") {
                me.sendBreakpoint(file,n,text ? false:true);
            }
        }
        
        if (cm && me.debugCurrent && me.debugCurrent.file==file && me.debugCurrent.line==n) {
            me.breakOn(file,n,true);
        }
    },
    
    codeSaved: function (tab) {
        var me = this;
        me.breakpoints[tab.options.file] = {};
        for (var j = 0; j < tab.editor.lineCount(); j++) {
            var markers = tab.editor.lineInfo(j).gutterMarkers;
            if (markers && markers.breakpoints) {
                me.breakpoints[tab.options.file][j] = tab.editor.getLine(j);
            }
        }
        me.breakpointsChanged();
    },
    
    setReadOnly: function (readonly) {
        var me = this;
        var tabs = teacss.ui.codeTab.tabs;
        teacss.jQuery.each(tabs,function(t,tab){
            if (tab.editor) {
                if (readonly) {
                    tab.readOnly_bkup = tab.editor.getOption("readOnly");
                    tab.editor.setOption("readOnly",true);
                } else {
                    tab.editor.setOption("readOnly",tab.readOnly_bkup);
                }
            }
        });
        me.readOnly = readonly;
        
        if (!this.readOnlyEvent) {
            this.readOnlyEvent = dayside.editor.bind("editorCreated",function(b,e){
                var tab = e.tab;
                if (me.readOnly) {
                    tab.editor.readOnly_bkup = tab.editor.getOption("readOnly");
                    tab.editor.setOption("readOnly",true);
                }
            });
        }
    },
    
    enable: function () {
        var me = this;
        if (!me.root) return;
        
        var allSaved = true;
        teacss.jQuery.each(teacss.ui.codeTab.tabs,function(i,tab){
            if (tab.changed) allSaved = false;
        });
        if (!allSaved) {
            alert('Save your files before starting debug session');
            return;
        }
        
        me.enabled = true;
        me.button.element.css({background:"#f90"});
        
        
        if (!me.tabs) {
            me.breakpointsPanel = new breakpointsPanel({plugin:me,label:"Breakpoints"});
            me.stackPanel = new stackPanel({plugin:me,label:"Stack"});
            me.watchPanel = new watchPanel({plugin:me,label:"Locals"});
            me.tabs = {
                watch: me.watchPanel,
                stack: me.stackPanel,
                breakpoints: me.breakpointsPanel
            };
            me.breakpointsChanged();
        }
        for (var key in me.tabs) {
            dayside.editor.mainPanel.addTab(me.tabs[key],"xdebug_"+key,"bottom");
        }
        me.setReadOnly(true);
        me.connect();
        
        teacss.jQuery.cookie('XDEBUG_SESSION', me.options.cookie, { expires: 1, path: '/' });
        me.controlButtons.css({display:""});
        me.sentBreakpoints = {};
        me.recvBreakpoints = {};
    },
    
    disable: function () {
        var me = this;
        me.enabled = false;
        me.button.element.css({background:""});
        for (var key in me.tabs) {
            var $ = teacss.jQuery;
            var tab = me.tabs[key];
            tab.element.detach();
            tab.tabPanel.closeTab(tab);
        }
        me.status = "stop";
        me.send("stop");
        me.disconnect();
        me.setReadOnly(false);
        me.clearCurrent();
        me.debugCurrent = false;
        teacss.jQuery.cookie('XDEBUG_SESSION', null, { path: '/' });
        me.controlButtons.hide();
        me.stackPanel.setValue(false);
        me.watchPanel.setValue(false);
    },
    
    disconnect: function () {
        clearTimeout(this.connectTimeout);
    },
    
    connect: function (currentData,time) {
        var me = this;
        var id = this.tid++;
        clearTimeout(this.connectTimeout);
        if (currentData) {
            currentData += " -i "+id;
        } else {
            currentData = "";
        }
        
        FileApi.request('xdebug',
            {
                key: me.options.cookie,
                data: currentData
            },
            false,
            function(res){
                var data = res.data;
                if (data!="none" && data!="error") me.receive(data);
            }
        );
        this.connectTimeout = setTimeout(function(){me.connect()},time || 1000);        
        return id;
    },
    
    send: function (data) {
        console.debug(data);
        return this.connect(data,100);
    },
    
    sendBreakpoint: function (file,line,remove) {
        var me = this;
        var fname = me.root + file.substring(FileApi.root.length);
        var ln = parseInt(line);
        
        if (!remove) {
            var id = this.send("breakpoint_set -t line -f "+fname+" -n "+(ln+1));
            me.sentBreakpoints[id] = {file:file,line:ln};
        } else {
            $.each(me.recvBreakpoints,function(b_id,data){
                if (data.file==file && data.line==line) {
                    me.send("breakpoint_remove -d "+b_id);
                    return false;
                }
            });
        }
    },
    
    receive: function (data) {
        
        console.debug(data);
        var me = this;
        var parts = data.split("\0");
        var messages = [];
        
        for (var m=1;m<parts.length;m+=2) {
            var part = parts[m];
            if (part) messages.push($($.parseXML(part)));
        }
        
        $.each(messages,function(m,xml){
            if (xml.find("init").length) {
                for (var file in me.breakpoints) {
                    for (var line in me.breakpoints[file]) {
                        me.sendBreakpoint(file,line);
                    }
                }
                me.status = "running";
                me.send("feature_set -n max_depth -v 10");
                me.send("run");
            }

            var resp = xml.find("response");
            if (resp.length) {

                var command = resp.attr("command");
                var status = resp.attr("status");

                if (status=="break" && command!="property_get") {
                    var msg = resp.find("xdebug\\:message,message");
                    if (msg.length) {
                        var file = msg.attr("filename");
                        var line = parseInt(msg.attr("lineno"))-1;
                        file = FileApi.root + file.substring(me.root.length);
                        me.breakOn(file,line,true);
                    }
                    me.status = "break";
                }
                if (status=="stopping") {
                    me.disable();
                }

                if (command=="breakpoint_set") {
                    var b_id = resp.attr("id");
                    var t_id = resp.attr("transaction_id");

                    if (me.sentBreakpoints && me.sentBreakpoints[t_id]) {
                        me.recvBreakpoints[b_id] = me.sentBreakpoints[t_id];
                    }
                }

                if (command=="stack_get") {
                    var stack = [];
                    resp.find("stack").each(function(){
                        var s = $(this);
                        var file = s.attr("filename");
                        stack.push({
                            type: s.attr("type"),
                            line: s.attr("lineno"),
                            file: FileApi.root + file.substring(me.root.length),
                            where: s.attr("where")
                        });
                    });
                    me.stackPanel.setValue(stack);
                }

                if (command=="context_get") {
                    function readProp(prop) {
                        var res = {};
                        $.each(prop.attributes,function(){
                            if (this.specified) res[this.name] = this.value;
                        });
                        var ch = $(prop).children("property");
                        if (ch.length) {
                            res.children = [];
                            ch.each(function(){
                                res.children.push(readProp(this));
                            });
                        } else {
                            res.value = $(prop).text();
                        }
                        return res;
                    }

                    var context = readProp(resp[0]).children || [];
                    me.watchPanel.setValue(context);
                }
            }
        });                
    },
    
    clearCurrent: function () {
        var me = this;
        if (me.debugCurrent) {
            me.debugCurrent.editor.removeLineClass(me.debugCurrent.line,"background","xdebug-current");
        }
    },
    
    breakOn: function (file,line,debug) {
        var me = this;
        var tab = dayside.editor.selectFile(file);
        function selectLine() {
            if (debug) {
                me.clearCurrent();
                tab.editor.addLineClass(line,"background","xdebug-current");
                me.debugCurrent = {file:file,line:line,editor:tab.editor};
                me.send("stack_get");
                me.send("context_get");
            }
            tab.editor.scrollIntoView({line:line,ch:0});
        }
        if (tab.editor) selectLine(); else tab.bind("editorCreated",selectLine);
    },
    
    stepOver: function () {
        var me = this;
        if (me.status!="break") return;
        me.send("step_over");
    },
    
    stepInto: function () {
        var me = this;
        if (me.status!="break") return;
        me.send("step_into");
    },    
    
    stepOut: function () {
        var me = this;
        if (me.status!="break") return;
        me.send("step_out");
    },    
    
    run: function () {
        var me = this;
        if (me.status!="break") return;
        me.send("run");
    }
});

})(teacss.jQuery,teacss.ui)