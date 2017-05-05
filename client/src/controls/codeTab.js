teacss.ui.codeTab = (function($){
    return teacss.ui.Panel.extend("teacss.ui.codeTab",{
        tabs: [],
        serialize: function (tab) {
            return tab.options.file;
        },
        deserialize: function (data) {
            return new this({file:data,closable:true});
        },
        languageFromFilename: function (file) {
            var parts = file.split(".");
            var ext = parts[parts.length-1];
            var lang = undefined;
            if (ext=='css') lang = 'css';
            if (ext=='tea') lang = 'teacss';
            if (ext=='php') lang = 'php';
            if (ext=='phtml') lang = 'php';
            if (ext=='js')  lang = 'javascript';
            if (ext=='ts')  lang = 'typescript';
            if (ext=='py')  lang = 'python';
            if (ext=='htm' || ext=='html' || ext=='tpl') lang = 'php';
            return lang;            
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
                    if (me.tabPanel) me.tabPanel.closeTab(me,true);
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
            
            var lang = this.Class.languageFromFilename(file);
            var editorOptions = {
                value:data,
                lineNumbers:true,
                language: lang,
                theme:'vs',
                fontFamily: 'monospace',
                automaticLayout: true,
                autoClosingBrackets: false
            };
            
            var args = {options:editorOptions,tab:me};
            dayside.editor.trigger("editorOptions",args);
            editorOptions = args.options;            
            
            function makeEditor() {
                
                var tabs = me.element.parent().parent();
                var tab = tabs.find("a[href=#"+me.options.id+"]").parent();
                tab.attr("title",me.options.file);
                
                monaco_require.config({ paths: { 'vs': dayside.url + '/client/lib/monaco/dev/vs' }});
                monaco_require(['vs/editor/editor.main'], function() {
                    
                    me.editor = monaco.editor.create(me.editorElement[0], editorOptions, editorOptions.overrideOptions);
                    me.editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, function() {
                        if (me.changed) {
                            setTimeout(function(){
                                me.saveFile();
                            },100);
                        }
                    });                    

                    var model = me.editor.getModel();
                    model.setEOL('\n');
                    model.setValue(data);
                    model.onDidChangeContent(function(){ me.editorChange(); });
                    if (editorOptions.modelOptions) model.updateOptions(editorOptions.modelOptions);
                    me.restoreState();
                    
                    dayside.editor.trigger("editorCreated",{editor:me.editor,tab:me});
                    me.trigger("editorCreated",{editor:me.editor,tab:me});
                });            
            }
            
            if (this.editorElement.is(":visible") || me.options.invisibleEditorCreate) {
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
                data[me.options.file] = {viewState:this.editor.saveViewState()};
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
                    if (data.viewState) me.editor.restoreViewState(data.viewState);
                } else {
                    this.colorPicker.setValue(data);
                    this.colorPicker.trigger("change");
                }
            }
            if (this.editor) {
                this.editor.onDidScrollChange(function(){me.saveState()});
            }
        },
        editorReady: function (callback) {
            var me = this;
            if (me.editor) {
                callback.call(me,me.editor);
            } else {
                this.bind("editorCreated",function(){
                    callback.call(me,me.editor);
                });
            }
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

            var saving_event = {text:text,cancel:false};
            this.trigger("saving",saving_event);
            if (saving_event.cancel) return;

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
        }
    });
})(teacss.jQuery);