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

teacss.ui.previewPanel = (function($){
    return teacss.ui.Panel.extend({},{
        init : function (options) {
            var me = this;
            this._super(options||{});
            
            this.header = $("<div>").appendTo(this.element).html("Template: ")
                .css({position:'absolute',left:0,right:0,top:0,padding:"8px 8px 0px 8px",background:'#eee'});
            
            this.viewSelect = new teacss.ui.select();
            this.viewSelect.element.appendTo(this.header);
            this.viewSelect.change(function(){ 
                me.value = this.getValue();
                editor.update(); 
            });
            
            this.exportButton = new teacss.ui.button({label:"Export",click:$.proxy(this.export,this)});
            this.exportButton.element.appendTo(this.header).css({float:'right','font-size':12,margin:0});
                
            this.view = $("<div>").appendTo(this.element)
                .css({position:'absolute',left:0,right:0,top:42,bottom:3});
            
            this.iframe = $("<iframe src='/blank.htm'>").appendTo(this.view)
                .css({width:'100%',height:'100%'});
            
            this.value = false;
            this.current = false;
        },
        export: function () {
            editor.export();
        },
        update: function (css) {
            if (!teacss.tea.Template) return;
            
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
            this.viewSelect.setOptions(options);
            this.viewSelect.setValue(this.value);
            
            var current = this.value;
            if (current) {
                var parts = current.split(":",2);
                var tpl = parts[0];
            }
            
            if (!current || !list[tpl])
                this.iframe.contents().find("html").html("");
            else {
                if (parts.length<2) {
                    var html = list[tpl].liquid.render({});
                } else {
                    var fix = parts[1];
                    var html = list[tpl].liquid.render(list[tpl].fixtures[fix]);
                }
                
                this.iframe.contents().find("html").html(html);
                
                if (html.indexOf(teacss.tea.Template.styleMark)!=-1)
                    teacss.tea.Style.insert(this.iframe[0].contentWindow.document);
                
                var r = new RegExp(teacss.tea.Template.scriptMark.replace("name","(.*?)"),"g");
                var scripts = [];
                var s;
                while (s = r.exec(html)) scripts.push(s[1]);
                if (scripts.length) {
                    teacss.tea.Script.insert(this.iframe[0].contentWindow.document,scripts);
                }
            }
        },
        update2: function () {
            var me = this;
            teacss.process(this.makefile,function(){
                me.previewPanel.update();
            },this.previewPanel.iframe[0].contentWindow.document);
        },
        export2: function () {
            var base = this.makefile.replace("/dev/index.tea","");
            var stylePath = base + "/view/assets/default.css";
            var scriptPath = base + "/view/assets";
          
            teacss.build(this.makefile,{
                scriptPath: base + "/view/assets",
                stylePath: base + "/view/assets",
                imagesPath: base + "/view/assets/images",
                
                templatePath: base + "/view",
                templateScriptPath: "view/assets",
                templateStylePath: "view/assets",
                
                callback: function (files) {
                    var message = 'Export successfull:\n\n';
                    for (var name in files) {
                        FileApi.save(name,files[name]);
                        message += name + "\n";
                    }
                    console.debug(files);
                    alert(message);
                }
            });
        }
        
    });
})(teacss.jQuery);