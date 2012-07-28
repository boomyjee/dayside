teacss.ui.codeTab = (function($){
    return teacss.ui.tab.extend({
        tabs: []
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
            var me = this;
            var parts = file.split(".");
            var ext = parts[parts.length-1];
            if (ext=='png' || ext=='jpg' || ext=='jpeg' || ext=='gif') {
                this.element.html("");
                this.element.append($("<img>").attr("src",file));
            } else {
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
                    e.cancel = !confirm(this.options.caption+" is not saved. Sure to close?");
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
                    var id = me.element.parent().attr("id");
                    me.element.parent().parent().tabs("remove","#"+id);
                }
            });
            
            this.Class.tabs.push(this);
        },
        
        createEditor: function() {
            var me = this;
            var file = this.apiPath;
            var data = FileApi.cache[file];

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
                        if (me.changed) {
                            setTimeout(function(){
                                me.saveFile();
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
            
            var args = {options:editorOptions};
            me.options.editorPanel.trigger("editorOptions",args);
            editorOptions = args.options;
            
            me.editor = CodeMirror(this.editorElement[0],editorOptions);
            
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
            
            var changed = (text!=FileApi.cache[this.options.file]);
            this.changed = changed;
            
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
                    me.changed = false;
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