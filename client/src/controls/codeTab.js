teacss.ui.codeTab = (function($){
    return teacss.ui.Panel.extend("teacss.ui.codeTab",{
        tabs: [],
        serialize: function (tab) {
            return tab.options.file;
        },
        deserialize: function (data) {
            return new this({file:data,closable:true});
        }
    },{
        init: function (options) {
            this._super(options);

            if (!this.options.label) {
                var label = this.options.file.split("/").pop().split("\\").pop();
                this.options.label = label;
            }
            
            this.tabs = new teacss.ui.tabPanel({width:'100%',height:'100%'});
            this.tabs.element
                .css({position:'absolute',left:0,right:0,top:0,bottom:0})
                .appendTo(this.element);
            
            this.codeTab = teacss.ui.panel("Code");
            this.tabs.addTab(this.codeTab);
            
            this.editorElement = this.codeTab.element;

            var file = this.options.file;
            var me = this;
            var parts = file.split(".");
            var ext = parts[parts.length-1];
            if (ext=='png' || ext=='jpg' || ext=='jpeg' || ext=='gif') {
                this.element.html("");
                this.element.append($("<img>").attr("src",file+"?t="+Math.floor(Math.random()*0x10000).toString(16)));
                
                var colorPicker = this.colorPicker = new teacss.ui.colorPicker({width:40,height:30});
                colorPicker.change(function(){
                    me.element.css({ background: this.value });
                    me.saveState();
                });
                this.element.append(
                    colorPicker.element.css({
                        position:'absolute',
                        left: 5,
                        bottom: 5
                    })
                );
                this.restoreState();
            } else {
                me.editorElement.append("<div style='padding:10px'>Loading...</div>");
                FileApi.file(file,function (answer){
                    var data = answer.error || answer.data;
                    me.createEditor();
                });
            }
            
            this.tabs.showNavigation(false);
            this.trigger("init");
            this.changed = false;
            
            this.bind("close",function(o,e){
                if (this.changed) {
                    e.cancel = !confirm(this.options.label+" is not saved. Sure to close?");
                }
                if (!e.cancel) {
                    var index = this.Class.tabs.indexOf(this);
                    if (index!=-1) this.Class.tabs.splice(index, 1);
                }
            });
            
            this.bind("select",function(o,e){
                setTimeout(function(){
                    if (me.editor) me.editor.refresh();
                },1);
            });
            
            FileApi.events.bind("move",function(o,e){
                if (e.path==me.options.file) me.options.file = e.new_path;
            });
            FileApi.events.bind("rename",function(o,e){
                if (e.path==me.options.file) {
                    me.options.file = e.new_path;
                    var caption = e.new_path.split("/").pop();
                    var id = me.element.parent().attr("id");
                    me.element.parent().parent().find("a[href=#"+id+"]").html(caption);
                }
            });
            FileApi.events.bind("remove",function(o,e){
                if (e.path==me.options.file) {
                    var id = me.element.parent().attr("id");
                    me.element.parent().parent().tabs("remove","#"+id);
                }
            });
            
            this.Class.tabs.push(this);
            
            this.editorPanel = dayside.editor;
            dayside.editor.trigger("codeTabCreated",this);
        },
        
        createEditor: function() {
            var me = this;
            var file = this.options.file;
            var data = FileApi.cache[file];

            this.editorElement.html("");

            var parts = file.split(".");
            var ext = parts[parts.length-1];

            var mode = undefined;
            if (ext=='css') mode = 'css';
            if (ext=='tea') mode = 'teacss';
            if (ext=='php') mode = 'application/x-httpd-php';
            if (ext=='js')  mode = 'javascript';
            if (ext=='haml') mode = 'css';
            if (ext=='liquid') mode = 'liquid';
            if (ext=='xml') mode = 'xml';
            if (ext=="yaml") mode = 'yaml';
            if (ext=='coffee') mode = 'coffeescript';
            if (ext=='htm' || ext=='html' || ext=='tpl') mode = 'application/x-httpd-php';
            if (ext=="md") mode = "gfm";
            if (ext=="java") mode = "text/x-java";
            if (ext=="h") mode = "text/x-c++hdr";
            if (ext=="c") mode = "text/x-c++src";
            if (ext=="cc") mode = "text/x-c++src";
            if (ext=="cpp") mode = "text/x-c++src";
            if (ext=="py") mode = "python";
            
            var editorOptions = {
                value:data,
                lineNumbers:true,
                mode: mode,
                tabMode:"shift",
                gutters: ["CodeMirror-linenumbers"],
                extraKeys: {
                    "Tab": "indentMore", 
                    "Shift-Tab": "indentLess",
                    "Ctrl-Space": "autocomplete",
                    "Ctrl-S": function () {
                        if (me.changed) {
                            setTimeout(function(){
                                me.saveFile();
                            },100);
                        }
                    }
                },
                theme:'no-direct-theme'
            };
            
            var args = {options:editorOptions,tab:me};
            dayside.editor.trigger("editorOptions",args);
            editorOptions = args.options;
            
            function makeEditor() {
                me.editor = CodeMirror(me.editorElement[0],editorOptions);
                dayside.editor.trigger("editorCreated",{cm:me.editor,tab:me});
                me.trigger("editorCreated",{cm:me.editor,tab:me});
                me.editor.on("change",function(){ me.editorChange(); })
                me.restoreState();
            }
            
            if (this.editorElement.is(":visible")) {
                makeEditor();
            } else {
                var f = this.bind("select",function(){
                    setTimeout(makeEditor);
                    me.unbind("select",f);
                });
            }
        },
        saveState: function () {
            var me = this;
            var data = dayside.storage.get("codeTabState");
            if (!data) data = {};
            if (this.editor) {
                var si = me.editor.getScrollInfo();
                data[me.options.file] = {x:si.left,y:si.top};
            } else {
                data[me.options.file] = this.colorPicker.value;
            }
            dayside.storage.set("codeTabState",data);
            
        },
        restoreState: function () {
            var me = this;
            var stateData = dayside.storage.get("codeTabState");
            if (stateData && stateData[me.options.file]) {
                var data = stateData[me.options.file];
                if (this.editor) {
                    setTimeout(function(){
                        me.editor.scrollTo(data.x,data.y);
                    },1);
                } else {
                    this.colorPicker.setValue(data);
                    this.colorPicker.trigger("change");
                }
            }
            if (this.editor)
                this.editor.on("scroll",function(){me.saveState()});
        },
        editorChange: function() {
            if (!this.editor) return;
            
            var text = this.editor.getValue();
            var tabs = this.element.parent().parent();
            var tab = tabs.find("a[href=#"+this.options.id+"]").parent();
            
            var changed = (text!=FileApi.cache[this.options.file]);
            this.changed = changed;
            
            if (!changed)
                tab.removeClass("changed");
            else
                tab.addClass("changed");
            this.editorPanel.trigger("codeChanged",this);
        },
        saveFile: function(cb) {
            var me = this;
            var tabs = this.element.parent().parent();
            var tab = tabs.find("a[href=#"+this.options.id+"]").parent();
            var text = this.editor.getValue();
            FileApi.save(this.options.file,text,function(answer){
                var data = answer.error || answer.data;
                if (data=="ok") {
                    me.changed = false;
                    tab.removeClass("changed");
                    me.editorPanel.trigger("codeSaved",me);
                    me.trigger("codeSaved");
                    if (me.callback) me.callback();
                    if (cb) cb(true);
                } else {
                    if (cb) 
                        cb(false);
                    else
                        alert(data);
                }
            });
        },
        onSelect: function () {
            var me = this;
            setTimeout(function(){
                if (me.editor) me.editor.refresh();
            },100);
        }
    });
})(teacss.jQuery);