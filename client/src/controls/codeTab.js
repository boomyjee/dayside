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
            
            this.tabs = new teacss.ui.tabPanel({});
            this.tabs.element
                .css({position:'absolute',left:0,right:0,top:0,bottom:0})
                .appendTo(this.element);
            
            this.codeTab = new teacss.ui.tab({caption:'Code'});
            this.tabs.addTab(this.codeTab);
            
            this.editorElement = this.codeTab.element;

            var file = this.apiPath = this.options.file;
            if (!this.Class.fileData[file]) {
                var parts = file.split(".");
                var ext = parts[parts.length-1];
                if (ext=='png' || ext=='jpg' || ext=='jpeg' || ext=='gif') {
                    this.element.html("");
                    this.element.append($("<img>").attr("src",file));
                } else {
                    var me = this;
                    FileApi.file(file,function (answer){
                        var data = answer.error || answer.data;
                        me.Class.fileData[file] = {text:data,changed:false};
                        me.createEditor();
                    });
                }
            } else {
                this.createEditor();
            }
            this.Class.tabs[options.file] = this;
            
            this.tabs.showNavigation(false);
            this.trigger("init");
            
            this.bind("close",function(o,e){
                if (this.Class.fileData[file].text!=this.editor.getValue()) {
                    e.cancel = !confirm(this.options.caption+" is not saved. Sure to close?");
                }
            });
        },
        
        createEditor: function() {
            var me = this;
            var file = this.apiPath;
            var data = this.Class.fileData[file].text;

            this.editorElement.html("");

            var parts = file.split(".");
            var ext = parts[parts.length-1];

            var mode = undefined;
            if (ext=='css') mode = 'css';
            if (ext=='tea') mode = 'teacss';
            if (ext=='php') mode = 'php';
            if (ext=='js')  mode = 'javascript';
            if (ext=='haml') mode = 'css';
            if (ext=='liquid') mode = 'liquid';
            if (ext=='coffee') mode = 'coffeescript';
            if (ext=='htm' || ext=='html') mode = 'php';
            if (ext=="md") mode = "gfm";
            
            var editorOptions = {
                value:data,
                lineNumbers:true,
                mode: mode,
                onChange: function () {
                    me.editorChange();
                },
                tabMode:"shift",
                indentUnit:4,
                matchBrackets: true,
                extraKeys: {"Tab": "indentMore", "Shift-Tab": "indentLess"},
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
                    me.editorPanel.trigger("editorChanged",me);
                }
            };
            
            var data = {options:editorOptions};
            me.options.editorPanel.trigger("editorOptions",data);
            editorOptions = data.options;
            
            this.editor = CodeMirror(this.editorElement[0],editorOptions);
            
            teacss.jQuery(function(){
                setTimeout(function(){
                    me.editor.refresh();
                    me.editorPanel.trigger("editorChanged",me);
                },100)
            })
        },
        editorChange: function() {
            var text = this.editor.getValue();
            var tabs = this.element.parent().parent();
            var tab = tabs.find("a[href=#"+this.options.id+"]").parent();
            
            var changed = (text!=this.Class.fileData[this.options.file].text);
            this.Class.fileData[this.options.file].changed = changed;
            
            if (!changed)
                tab.removeClass("changed");
            else
                tab.addClass("changed");
            this.editorPanel.trigger("codeChanged",this);
        },
        saveFile: function() {
            var me = this;
            var tabs = this.element.parent().parent();
            var tab = tabs.find("a[href=#"+this.options.id+"]").parent();
            var text = this.editor.getValue();
            FileApi.save(this.apiPath,text,function(answer){
                var data = answer.error || answer.data;
                if (data=="ok") {
                    me.Class.fileData[me.options.file].text = text;
                    me.Class.fileData[me.options.file].changed = false;
                    tab.removeClass("changed");
                    if (me.callback) me.callback();
                } else {
                    alert(data);
                }
            });
        },
        onSelect: function () {
            var me = this;
            setTimeout(function(){
                me.editor.refresh();
            },100);
        }
    });
})(teacss.jQuery);