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
                    this.element.append($("<img>").attr("src",file));
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
            if (ext=='coffee') mode = 'coffeescript';
            if (ext=='htm' || ext=='html') mode = 'php';
            
            this.editor = CodeMirror(this.element[0],{
                value:data,
                lineNumbers:true,
                mode: mode,
                onChange: function () {
                    me.editorChange();
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
                    me.editorPanel.trigger("editorChanged",me);
                }
            });
            
            teacss.jQuery(function(){
                setTimeout(function(){
                    me.editor.refresh();
                    me.editorPanel.trigger("editorChanged",me);
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
            this.editorPanel.trigger("codeChanged",this);
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
        }
    });
})(teacss.jQuery);