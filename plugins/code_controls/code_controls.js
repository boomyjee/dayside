require("./code_controls.css",true);

window.teapot = dayside.plugins.teapot = {ui:{}}
dayside.ready(function(){
    // helper function to show expanded controls independent on hScroll
    teapot.compensateScroll = function (els) {
        els = els || teacss.jQuery(".widget.right,.widget.active-line");
        var parent = els.parent().eq(0);
        if (!parent.length) return;
        var w = parent.width()+parseFloat(parent.css("padding-left"));
        var left = parseFloat(parent[0].style.left);
        els.width(left+w-24);
    }
        
    function bindEvents(tab) {
        var editor = tab.editor;
        editor.on("scroll",function(){teapot.compensateScroll()});        
        editor.on("cursorActivity", function() {
            var line = editor.getCursor().line;
            var lineInfo = editor.lineInfo(line);
            
            if (editor.activeLine) {
                editor.setLineClass(editor.activeLine, (editor.activeLine.className || "").replace(" active-line",""));
                if (editor.activeLine.widgets) for (var w=0;w<editor.activeLine.widgets.length;w++) {
                    $(editor.activeLine.widgets[w].node).removeClass("active-line");
                }
            }
            
            if (lineInfo.handle.className && lineInfo.handle.className.indexOf("active-line")==-1) {
                editor.activeLine = editor.setLineClass(line, (lineInfo.handle.className || "")+" active-line");
                if (lineInfo.widgets) for (var w=0;w<lineInfo.widgets.length;w++) {
                    $(lineInfo.widgets[w].node).addClass("active-line");
                    teapot.compensateScroll($(lineInfo.widgets[w].node));
                }
            }
        });        
        
        setTimeout(function(){
            teapot_codeChanged(tab,true);
            setTimeout(function(){
                editor.refresh();
            },1);
        },1);
    }

    // for new tabs
    dayside.editor.bind("editorCreated",function(b,e){
        if (e.tab.options.file.split(".").pop()=="tea") bindEvents(e.tab);
    });
    dayside.editor.mainPanel.leftSplitter.bind("change",function(){teapot.compensateScroll()});
    dayside.editor.mainPanel.rightSplitter.bind("change",function(){teapot.compensateScroll()});
    
    // for existing (plugin can be called with tabs already open)
    for (var i=0;i<teacss.ui.codeTab.tabs.length;i++) {
        var tab = teacss.ui.codeTab.tabs[i];
        if (tab.options.file.split(".").pop()=="tea") {
            if (tab.editor) bindEvents(tab);
        }
    }

    // update controls on code changes
    dayside.editor.bind("codeChanged",function(b,tab){
        if (teapot.skip===true) return;
        if (tab.activeControls) for (var i=0;i<tab.activeControls.length;i++) {
            //tab.activeControls[i].element.css("visibility","hidden");
        }
        // as this update comes with realtime typing do it only when typing stops to avoid lags
        // and also disable controls because they can be irrelevant to current code state
        clearTimeout(tab.teapotCodeChangedTimeout);
        tab.teapotCodeChangedTimeout = setTimeout(function(){
            teapot_codeChanged(tab);
            if (tab.activeControls) for (var i=0;i<tab.activeControls.length;i++) {
                tab.activeControls[i].element.css("visibility","");
            }
        },200);
    });
});

teapot.property = function(options) {
    options.filter = function (meta) {
        if (meta.name!="rule") return;
        if (meta.selector_key==options.key && meta.selector_value.indexOf("@")==-1)
            return {value:teacss.trim(meta.selector_value),pre: meta.selector_key+": ",post:";"};
    }
    options.callback = function (meta,control,cm) {
        var s = meta.selector_key + ": "+control.getValue().toString();
        teapot_controlChanged(cm,control,s);
    }
    return options;
}

teapot.variable = function(options) {
    var re = /^(@\s*)(var\s+)?([\w\.]+)(\s*=\s*")([^"]*)(".*)/;
    options.filter = function (meta) {
        if (meta.name=="js_line") {
            var matches = re.exec(meta.data);
            if (matches && matches[3].toLowerCase().indexOf(options.key.toLowerCase())!=-1) {
                meta.variable_name = matches[3];
                return {value:matches[5],pre:matches[1]+(matches[2]||"")+matches[3]+matches[4],post:matches[6]};
            }
        }
    }
    options.callback = function (meta,control,cm) {
        var s = meta.data.replace(re,"$1$2$3$4"+control.getValue().toString()+"$6");
        teapot_controlChanged(cm,control,s);
    }
    return options;    
}
    
teapot.mixin = function(options) {
    //              $1 - name         $2 - alias        $3 - args   $4
    var re = /^(\.[-0-9A-Za-z_\.]+)(<[-0-9A-Za-z_]+>)*(\([\s\S]*\))(\s*)$/m;
    options.filter = function (meta) {
        if (meta.name=="rule" && !meta.is_block) {
            var matches = re.exec(meta.data);
            if (matches && matches[1].toLowerCase().indexOf(options.key.toLowerCase())!=-1) {
                meta.mixin_name = matches[1];
                var value;
                try {
                    value = eval(matches[3]);
                } catch (e) {}
                return {value:value,pre:matches[1]+"(",post:")"};
            }
        }
    }
        
    function stringify(obj,offset) {
        if (obj===null) return "null";
        if (obj===false) return "false";
        
        if (teacss.jQuery.isArray(obj)) {
            var parts = [];
            for (var i=0;i<obj.length;i++)
                parts.push(stringify(obj[i]));
            return "["+parts.join(",")+"]";
        }
        
        var type = typeof obj;
        if (type=="string") return JSON.stringify(obj);
        if (type=="number") return obj.toString();
        
        var parts = [];
        var offset2 = offset + "    ";
        for (var key in obj) {
            if (obj[key]!==undefined) {
                var skey = /^[\w0-9]+$/.test(key) ? key : JSON.stringify(key);
                parts.push(skey + ": " + stringify(obj[key],offset2));
            }
        }
        return "{\n"+offset2+parts.join(",\n"+offset2)+"\n"+offset+"}";
    }
        
    options.callback = function (meta,control,cm) {
        var start = cm.posFromIndex(meta.start);
        var val = control.getValue();
        if (typeof val!="string") {
            val = stringify(val,new Array(start.ch+1).join(" "));
        }
        var s = meta.data.replace(re,"$1$2("+val+")$4");
        teapot_controlChanged(cm,control,s);
    }    
    return options;
}
    
teapot.fieldset = function () {
    return {
        filter: function (meta) {
            if (meta.name=="comment_line") {
                var re = /\/\/\s*#(.*)/;
                var matches = re.exec(meta.data);
                if (matches) {
                    return {pre:"",value:teacss.trim(matches[1]),post:""};
                }
            }
        },
        control: ui.control.extend({
            init: function (o) {
                this._super(o);
                this.element = $("<h3>");
            },
            setValue: function (v) {
                this.element.html(v);
            }
        }),
        hidden: true
    }        
}
    
function teapot_controlChanged(cm,control,s) {
    teapot.skip = true;
    var list = control.others;
    var meta = control.meta;
    
    var start = cm.posFromIndex(meta.start);
    var end   = cm.posFromIndex(meta.end);
    
    cm.operation(function(){
        // correct meta offsets
        var delta = s.length - (meta.end - meta.start);
        if (delta!=0) {
            for (var i=0;i<list.length;i++) {
                var other = list[i];
                if (other.meta.start >= meta.end) {
                    other.meta.start += delta;
                    other.meta.end += delta;
                }
            }
            meta.end = meta.start + s.length;
        }
        
        var foldData = control.foldData;
        if (foldData && foldData.fold) {
            cm.unfoldLines(foldData.fold);
        }
        
        cm.replaceRange(s,start,end);
        var new_end = cm.posFromIndex(meta.end);
        
        // correct saved foldData
        if (foldData) {
            var foldDelta = new_end.line - foldData.end;
            if (foldDelta!=0) {
                for (var i=0;i<list.length;i++) {
                    var other = list[i];
                    if (!other.foldData) continue;
                    if (other.foldData.start >= end.line) {
                        other.foldData.start += foldDelta;
                        other.foldData.end += foldDelta;
                    }
                }
                foldData.start = start.line;
                foldData.end = new_end.line;
            }
            
            if (foldData.fold) {
                foldData.fold = cm.foldLines(foldData.start+1,foldData.end+1,{showWidgets:true});
            }
        }
    });
    teapot.skip = false;
    
    clearTimeout(control.codeTab.controlChangedTimeout);
    control.codeTab.controlChangedTimeout = setTimeout(function(){
        teapot.skip = control;
        teapot_codeChanged(false,control.codeTab);
        teapot.skip = false;
    },1000);
}
    
function teapot_codeChanged(tab,foldByDefault) {
    if (!tab.editor) return;
    if (teapot.skip===true) return;
    var $ = teacss.jQuery;
    
    var me = tab;
    var cm = me.editor;
    var file = me.options.file;
    
    me.controls = me.controls || {};
    // reset control list indices
    for (var key in me.controls) {
        me.controls[key].index = 0;
    }
    
    teapot.controls = [];
    // recursively parse tea file metadata to insert embedded controls
    function parseMeta(meta,scope) {
        var this_scope = false;
        if (meta.scope && teacss.tea[meta.scope]) this_scope = scope = meta.scope;
        for (var i=0;i<meta.children.length;i++)
            parseMeta(meta.children[i],scope);
        if (meta.value_node) parseMeta(meta.value_node);
        
        var ui = dayside.plugins.teapot.ui;
        var child = meta;
        
        var args = false,found = false;
        for (var key in ui) {
            if (args = ui[key].filter(child)) {
                found = true;
                break;
            }
        }
        
        var scope_obj = teacss.tea[scope];
        if (found) {
            var list = me.controls[key];
            // if control stack for this type of property is not defined, create it
            if (!list) {
                list = me.controls[key] = [];
                list.index = 0;
            }
            
            // get control from stack
            var control = list[list.index++];
            if (!control) {
                control = ui[key].control($.extend(ui[key].options,{value: args.value}));
                control.bind("change",function(){
                    ui[key].callback(this.meta,this,cm);
                });
                list.push(control);
            }
            if (teapot.skip!==control) control.setValue(args.value);
            
            control.meta = child;
            control.key = key;
            control.args = args;
            control.element.css({margin:0,cursor:"pointer"});
            control.element.addClass("widget-control");
            control.others = teapot.controls;
            control.hidden = ui[key].hidden;
            control.codeTab = tab;
            teapot.controls.push(control);
        }
    }
    
    var ext = file.split(".").pop();
    if (ext=='tea') {
        var parsed = teacss.parse(tab.editor.getValue(),file);
        parseMeta(parsed.ast,'Style');
        
        function updateControl(control,unfold) {
            var foldData = control.foldData;
            if (foldData.fold) {
                control.markerElement.html("►");
                foldData.fold = cm.foldLines(foldData.start+1,foldData.end+1);
                
                if (cm.getCursor().line==foldData.start)
                    cm.setLineClass(foldData.start,"hidden-line active-line");
                else
                    cm.setLineClass(foldData.start,"hidden-line");
                control.widgetLine.removeClass("right");
            } else {
                control.markerElement.html("▼");
                if (unfold) cm.unfoldLines(unfold);
                cm.setLineClass(foldData.start,null);
                control.widgetLine.addClass("right");
                teapot.compensateScroll();
            }
        }
        
        if (teapot.controls.length) {
            tab.tabs.showNavigation(true);
            if (!tab.controlsTab) {
                tab.controlsTab = tab.tabs.addTab("Controls");
                tab.controlsTab.element.addClass("teapot-bare-controls");
                tab.controlsTab.bind("select",function(){
                    tab.controlsTab.element.empty();
                    for (var i=0;i<tab.activeControls.length;i++) {
                        var control = tab.activeControls[i];
                        tab.controlsTab.element.append(
                            $("<div>").append(control.element)
                        );
                    }
                })
                tab.codeTab.bind("select",function(){
                    for (var i=0;i<tab.activeControls.length;i++) {
                        var control = tab.activeControls[i];
                        if (control.hidden) continue;
                        control.widgetLine.find("span:first").after(control.element);
                    }
                })
            }
        } else {
            tab.tabs.showNavigation(false);
        }
        
        cm.operation(function() {
            cm.clearGutter("fold-gutter");
            if (tab.activeControls) for (var i=0;i<tab.activeControls.length;i++) {
                var control = tab.activeControls[i];
                if (control.hidden) continue;
                if (control.foldData.fold) cm.unfoldLines(control.foldData.fold);
                cm.setLineClass(control.foldData.start,null);
                
                control.element.detach();
                cm.removeLineWidget(control.widget);
            }
            tab.activeControls = [];
            
            for (var i=0;i<teapot.controls.length;i++) {
                var control = teapot.controls[i];
                tab.activeControls.push(control);
                
                if (control.hidden) continue;
                
                var start = cm.posFromIndex(control.meta.start);
                var end = cm.posFromIndex(control.meta.end);
                
                var lineInfo = cm.lineInfo(start.line);
                if (lineInfo.handle.foldData) {
                    control.foldData = lineInfo.handle.foldData;
                } else {
                    control.foldData = lineInfo.handle.foldData = {fold:foldByDefault};
                }
                
                if (!control.widgetLine) {
                    control.markerElement = $("<div>").css({color:"#aaa"});
                    control.widgetLine = $("<div>").addClass("widget");
                    
                    control.markerElement.click(control,function(e){
                        if ($(this).hasClass("widget")) {
                            if ($(e.target).parent()[0]!=this || e.target.tagName!="SPAN") return;
                        }
                        var control = e.data;
                        var foldData = control.foldData;
                        var unfold;
                        if (foldData.fold) {
                            unfold = foldData.fold;
                            foldData.fold = false;
                            var char = cm.coordsChar({left:e.pageX,top:e.pageY});
                            cm.focus();
                            cm.setCursor(char);
                        } else {
                            foldData.fold = true;
                        }
                        updateControl(control,unfold);
                    });
                }
                
                control.foldData.start = start.line
                control.foldData.end = end.line;
                
                cm.setGutterMarker(start.line,"fold-gutter",control.markerElement[0]);                
                
                var spaces = new Array(start.ch+1).join(" ");
                var pre = control.args.pre===undefined ? lineInfo.text : control.args.pre;
                var post = control.args.post;
                control.widgetLine.empty().append("<span>"+spaces+pre+"</span>",control.element,"<span>"+post+"</span>");
                control.widget = cm.addLineWidget(start.line,control.widgetLine[0],{noHScroll:true});
                
                updateControl(control);
            }
        });
        teapot.compensateScroll();
    }
}    