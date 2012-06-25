teacss.ui.codeTab = (function($){
    return teacss.ui.tab.extend({
        find: function (file) {
            var tab = this.tabs[file];
            return tab;
        },
        fileData: {
            /* fileName: {text:fileText,changed:wasFileChangedInEditor}  */
        },
        tabs: {
            /* fileName: tab */
        }
    },{
        init: function (options) {
            this._super(options);

            var caption = this.options.file.split("/").pop().split("\\").pop();
            this.options.caption = caption;

            var file = this.apiPath = this.options.file;
            if (!this.Class.fileData[file]) {
                var parts = file.split(".");
                var ext = parts[parts.length-1];
                if (ext=='png' || ext=='jpg' || ext=='jpeg' || ext=='gif') {
                    this.element.html("");
                    this.element.append($("<img>").attr("src",'/apps/'+FileApi.root+file));
                } else {
                    var data = FileApi.file(file);
                    this.Class.fileData[file] = {text:data,changed:false};
                    this.createEditor();
                }
            } else {
                this.createEditor();
            }

            this.Class.tabs[options.file] = this;
        },
        createEditor: function() {
            var me = this;
            var file = this.apiPath;
            var data = this.Class.fileData[file].text;

            this.element.html("");

            var parts = file.split(".");
            var ext = parts[parts.length-1];

            var mode = undefined;
            if (ext=='css') mode = 'css';
            if (ext=='tea') mode = 'teacss';
            if (ext=='php') mode = 'php';
            if (ext=='js')  mode = 'javascript';
            if (ext=='haml') mode = 'css';
            if (ext=='liquid') mode = 'liquid';
            if (ext=='htm' || ext=='html') mode = 'php';
            
            this.editor = CodeMirror(this.element[0],{
                value:data,
                lineNumbers:true,
                mode: mode,
                onChange: function () {
                    clearTimeout(me.changeTimeout);
                    me.changeTimeout = setTimeout(function(){
                        me.editorChange();
                    },200);
                },
                tabMode:"shift",
                indentUnit:4,
                matchBrackets: true,
                theme:'default',
                onKeyEvent: function (editor,e) {
                    var event = $.event.fix(e);
                    if (event.type=='keydown' && event.ctrlKey && event.which == 83) {
                        event.preventDefault();
                        if (me.Class.fileData[me.options.file].changed) {
                            setTimeout(function(){
                                me.saveFile(me.options.file);
                            },100);
                        }
                        return true;
                    }
                    return false;
                },
                onUpdate: function (editor) {
                    if (mode=='teacss') {
                        me.updateControls();
                    }
                }
            });
            
            teacss.jQuery(function(){
                setTimeout(function(){
                    me.editor.refresh();
                    me.updateControls();
                },100)
            })
        },
        editorChange: function() {
            var data = this.editor.getValue();
            var tabs = this.element.parent().parent();
            var tab = tabs.find("a[href=#"+this.options.id+"]").parent();
            
            if (this.editor.historySize().undo) {
                this.Class.fileData[this.options.file] = {text:data,changed:true}
                tab.addClass("changed");
            } else {
                this.Class.fileData[this.options.file] = {text:data,changed:false}
                tab.removeClass("changed");
            }
            this.textUpdate();
        },
        saveFile: function() {
            var me = this;
            var tabs = this.element.parent().parent();
            var tab = tabs.find("a[href=#"+this.options.id+"]").parent();
            var data = FileApi.save(this.apiPath,me.Class.fileData[this.options.file].text);
            if (data=="ok") {
                me.Class.fileData[this.options.file].changed = false;
                tab.removeClass("changed");
                if (me.callback) me.callback();
            } else {
                alert(data);
            }
        },
        onSelect: function () {
            var me = this;
            setTimeout(function(){
                me.editor.refresh();
            },100);
        },

        controls: {},
        
        textUpdate: function () {
            var file = this.options.file;
            var text = this.editor.getValue();
            try {
                var old_parsed = teacss.parsed[file];
                if (!old_parsed) return;
                teacss.parsed[file] = teacss.parse(text,file);
                teacss.parsed[file].func = eval(teacss.parsed[file].js);
                editor.update();
            } catch (e) {
                console.debug(e);
                teacss.parsed[file] = old_parsed;
                editor.update();
            }
        },
        
        updateControls: function() {
            return;
            var me = this;
            var cm = this.editor;
            var file = this.options.file;
            
            // div for widgets in CodeMirror editor
            if (!this.widgetsDiv) {
                 $(cm.getWrapperElement()).find(".CodeMirror-scroll")
                     .append(
                         this.widgetsDiv = $("<div>").addClass("widgets")
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
                
                /*// syntax highlight
                if (!meta.is_block) {
                    
                    if (meta.start && meta.end && !me.marking) {
                        var start = cm.posFromIndex(meta.start);
                        var end = cm.posFromIndex(meta.end);
                        me.marking = true;
                        cm.markText(start,end,"cm-string");
                        me.marking = false;
                    }
                    
                } else {
                }*/
                
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
                
                
                var ui = teacss.tea[scope].ui;
                if (ui && ui[key]) {
                    var ckey = scope+"."+key;
                    var list = me.controls[ckey];
                    
                    // if control stack for this type of property is not defined, create it
                    if (!list) {
                        list = me.controls[ckey] = [];
                        list.index = 0;
                    }
                    
                    try {
                        var args = eval('['+val+']');
                        if (args.length==1) args = args[0];
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
                    control.codeMirror = cm;
                    control.element.css({display:""});
                    me.widgetsDiv.append(control.element);
                }
            }
            
            if (teacss.parsed[file]) {
                var meta = teacss.parsed[file].ast;
                parseMeta(meta,'Css');
            }
            me.skip = false;
        }        
    });
})(teacss.jQuery);