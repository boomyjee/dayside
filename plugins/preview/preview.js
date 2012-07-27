window.dayside.plugins.push(function($){
    var previewTab = new teacss.ui.previewTab();
    window.dayside.editor.tabs2.addTab(previewTab);
});

teacss.ui.previewTab = (function($){
    return teacss.ui.tab.extend({
        init: function (options) {
            this._super($.extend({caption:"Preview"},options));
            this.element.css({background:"transparent"});
            
            dayside.editor.splitter.change(this.updatePreview);            
            this.updatePreview();
            
            dayside.editor.bind("codeChanged",this.codeChanged);
            dayside.editor.bind("editorChanged",this.editorChanged);
        },
        
        updatePreview : function() {
            var top = 62; // magic numbers ((
            var left = dayside.editor.splitter.getValue() + dayside.editor.splitter.element.width();
            $("html").css({
                'margin-left': left,
                'margin-top': top
            });
        },
        
        codeChanged: function(e,tab) {
            var me = tab;
            var file = tab.options.file;
            var text = tab.editor.getValue();
            
            var old_parsed = teacss.parsed[file];
            if (!old_parsed) return;
            teacss.parsed[file] = teacss.parse(text,file);
            
            clearTimeout(me.changeTimeout);
            me.changeTimeout = setTimeout(function(){
                try {
                    teacss.parsed[file].func = eval(teacss.parsed[file].js);
                    teacss.update();
                } catch (e) {
                    console.debug(e);
                    teacss.parsed[file] = old_parsed;
                    teacss.update();
                }
            },200);
        },

        editorChanged: function(e,tab) {
            
            if (!tab.editor) return;
            
            var me = tab;
            var cm = me.editor;
            var file = me.options.file;
            
            me.controls = me.controls || {};
            
            // div for widgets in CodeMirror editor
            if (!me.widgetsDiv) {
                 $(cm.getWrapperElement()).find(".CodeMirror-scroll")
                     .append(
                         me.widgetsDiv = $("<div>").addClass("widgets")
                     );
            }
            
            // reset control list indices
            for (var ckey in me.controls) {
                me.controls[ckey].index = 0;
                for (var i=0;i<me.controls[ckey].length;i++) {
                    var ctl = me.controls[ckey][i];
                    ctl.element.css("display","none");
                }
            }
            // recursively parse tea file metadata to insert embedded controls
            function parseMeta(meta,scope) {
                if (meta.name!="rule") return;
                
                var this_scope = false;
                if (meta.scope && teacss.tea[meta.scope]) this_scope = scope = meta.scope;
                for (var i=0;i<meta.children.length;i++)
                    parseMeta(meta.children[i],scope);
                if (meta.value_node) parseMeta(meta.value_node);
                
                var child = meta;
                if (this_scope) {
                    var key = "self";
                } else {
                    if (!child.selector) return;
                    if (child.selector.indexOf("@")!=-1) return;
                    if (child.selector.indexOf(":")==-1) return;
                    
                    var key = child.selector_key || child.selector;
                    var val = child.selector_value;
                }
                
                var scope_obj = teacss.tea[scope];
                var ui = scope_obj ? teacss.tea[scope].ui : false;
                if (ui && ui[key]) {
                    var ckey = scope+"."+key;
                    var list = me.controls[ckey];
                    
                    // if control stack for this type of property is not defined, create it
                    if (!list) {
                        list = me.controls[ckey] = [];
                        list.index = 0;
                    }
                    
                    try {
                        if (scope_obj.format=="string") {
                            var args = val;
                        } else {
                            var args = eval('['+val+']');
                            if (args.length==1) args = args[0];
                        }
                    } catch (e) {
                        return;
                    }
                    
                    if (this_scope) {
                        var control = list[list.index++];
                        if (!control) {
                            control = ui[key].control($.extend(ui[key].options,{value: args, meta:meta, codeMirror: cm}));
                            control.element.css({position:'absolute',right:0,top:0});
                            list.push(control);
                        }
                    } else {
                        // get control from stack
                        var control = list[list.index++];
                        if (!control) {
                            control = ui[key].control($.extend(ui[key].options,{value: args}));
                            control.bind("change",function(){
                                var val = this.getValue();
                                var str;
                                if (this.format=="string") {
                                    str = val.toString();
                                } else {
                                    if (val.constructor != Array) {
                                        if (val.constructor == Object) {
                                            str = JSON.stringify(val,false,"  ");
                                            str = str.split("\n").join("\n"+new Array(this.mixin.indent+1).join(" "));
                                        } else {
                                            str = JSON.stringify(val);
                                        }
                                    } else {
                                        str = JSON.stringify(val);
                                        str = str.substr(1,str.length-2);
                                    }
                                }
                                
                                str = this.meta.selector_key + ": " + str;
                                me.skip = this;
                                cm.replaceRange(str,cm.posFromIndex(this.meta.start),cm.posFromIndex(this.meta.end));
                            });
                            control.element.css({position:'absolute',right:0,top:0});
                            list.push(control);
                        }
                        if (me.skip!=control) {
                            control.setValue(args);
                        }
                    }
                    
                    var pos = cm.posFromIndex(child.start);
                    var linePre = $(cm.getWrapperElement())
                        .find(".CodeMirror-lines > div > div:nth-child(4) > pre:nth-child("+(pos.line+1)+")");
                    control.element.css({top:linePre.position().top});
                    control.meta = child;
                    control.format = scope_obj.format;
                    control.codeMirror = cm;
                    control.element.css({display:""});
                    me.widgetsDiv.append(control.element);
                }
            }
            
            if (teacss.parsed[file]) {
                var meta = teacss.parsed[file].ast;
                parseMeta(meta,'Style');
            }
            me.skip = false;
        }         
    })
})(teacss.jQuery);