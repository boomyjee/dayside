dayside.plugins.push(function(){
    var tab = new teacss.ui.layoutBuilderTab({caption:"Layout preview"});
    dayside.editor.tabs2.addTab(tab);
});

teacss.ui.select = (function($){
    return teacss.ui.Control.extend({},{
        init: function (options) {
            var me = this;
            this._super(options||{});
            this.element = $("<select>");
            this.element.change(function(){
                me.value = $(this).val();
                me.trigger("change");
            });
            this.setOptions(this.options.options || {});
        },
        setOptions: function (list) {
            var found = false;
            this.element.html("");
            for (var key in list) {
                this.element.append($("<option>").html(key).val(list[key]));
                if (list[key]==this.value) found = true;
            }
            if (!found) {
                this.value = false;
                for (var key in list) {
                    this.setValue(list[key]);
                    break;
                }
            }
            this.element.val(this.value);
        },
        setValue: function (val) {
            this._super(val);
            this.element.val(val);
        }
    });
})(teacss.jQuery);

teacss.ui.layoutBuilderTab = (function($){
    return teacss.ui.tab.extend({},{
        init : function (options) {
            var me = this;
            this._super(options||{});
            
            this.header = $("<div>").appendTo(this.element).html("Template: ")
                .css({position:'absolute',left:0,right:0,top:0,padding:"8px 8px 0px 8px",background:'#eee'});
            
            this.viewSelect = new teacss.ui.select();
            this.viewSelect.element.appendTo(this.header);
            this.viewSelect.change(function(){ 
                me.value = this.getValue();
                me.update(); 
            });
            
            this.exportButton = new teacss.ui.button({label:"Export",click:$.proxy(this.export,this)});
            this.exportButton.element.appendTo(this.header).css({float:'right','font-size':12,margin:0});
                
            this.view = $("<div>").appendTo(this.element)
                .css({position:'absolute',left:0,right:0,top:42,bottom:3});
            
            this.iframe = $("<iframe src='"+dayside.url+"/plugins/layout-builder/blank.htm'>").appendTo(this.view)
                .css({width:'100%',height:'100%'});
            
            this.value = false;
            this.current = false;
            
            if (dayside.options.makefile)
                this.makefile = dayside.options.makefile;
            else
                this.makefile = dayside.options.root + "index.tea";
            
            dayside.editor.bind("codeChanged",$.proxy(this.codeChanged,this));
            
            $(function(){
                me.update();
            });
        },
        
        codeChanged: function(e,tab) {
            var me = this;
            var file = tab.options.file;
            var text = tab.editor.getValue();
            
            var old_parsed = teacss.parsed[file];
            console.debug(file);
            if (!old_parsed) return;
            teacss.parsed[file] = teacss.parse(text,file);
            
            clearTimeout(me.changeTimeout);
            me.changeTimeout = setTimeout(function(){
                try {
                    teacss.parsed[file].func = eval(teacss.parsed[file].js);
                    me.update();
                } catch (e) {
                    console.debug(e);
                    teacss.parsed[file] = old_parsed;
                    me.update();
                }
            },200);
        },        
        
        export: function () {
            alert('Export');
        },
        
        update: function () {
            if (!teacss.tea.Template) return;
            var me = this;
            teacss.process(me.makefile,function(){
                var list = teacss.tea.Template.templates,options = {};
                options["no template"] = false;
                for (var key in list) {
                    var fixtures = list[key].fixtures;
                    var count = 0;
                    for (var fix in fixtures) count++;
                    if (count) {
                        for (var fix in fixtures) {
                            if (fix=="default")
                                options[key] = key+":"+fix;
                            else
                                options[key+" ("+fix+")"] = key+":"+fix;
                        }
                    } else {
                        options[key] = key;
                    }
                }
                me.viewSelect.setOptions(options);
                me.viewSelect.setValue(me.value);
                
                var current = me.value;
                if (current) {
                    var parts = current.split(":",2);
                    var tpl = parts[0];
                }
                
                if (!current || !list[tpl])
                    me.iframe.contents().find("html").html("");
                else {
                    if (parts.length<2) {
                        var html = list[tpl].liquid.render({});
                    } else {
                        var fix = parts[1];
                        var html = list[tpl].liquid.render(list[tpl].fixtures[fix]);
                    }
                    
                    me.iframe.contents().find("html").html(html);
                    
                    if (html.indexOf(teacss.tea.Template.styleMark)!=-1)
                        teacss.tea.Style.insert(me.iframe[0].contentWindow.document);
                    
                    var r = new RegExp(teacss.tea.Template.scriptMark.replace("name","(.*?)"),"g");
                    var scripts = [];
                    var s;
                    while (s = r.exec(html)) scripts.push(s[1]);
                    if (scripts.length) {
                        teacss.tea.Script.insert(me.iframe[0].contentWindow.document,scripts);
                    }
                }
            },me.iframe[0].contentWindow.document);
        }
    });
})(teacss.jQuery);