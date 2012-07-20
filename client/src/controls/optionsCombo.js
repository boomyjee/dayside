teacss.ui.optionsCombo = (function($){
    return teacss.ui.Combo.extend({},{
        init: function (options) {
            this.value = options.value || {
                fontSize: 14,
                editorLayout: 'right'
            };
            
            var ui = teacss.ui;
            var me = this;
            var items = [
                this.fontLabel = ui.label({template:'Font size: ${value}px'}),
                this.fontSlider = ui.slider({
                        min:10,max:24,margin:"0px 15px 5px",change:function(){
                        me.value.fontSize = this.value;
                        me.setValue(me.value);
                        me.trigger("change");
                    }
                }),
                ui.label({template:'Editor layout'}),
                this.editorLayoutSelect = new (ui.Control.extend({
                    init: function () {
                        this._super({});
                        this.element = $("<div>").css({padding:"0 0 10px 15px",'font-size':12});
                        
                        var values = {
                            'Left panel' : 'left',
                            'Right panel' : 'right'
                        };
                        
                        for (var key in values) {
                            var val = values[key];
                            this.element.append(
                                "<label><input style='display:inline' type='radio' name='editorLayout' value='{val}'> {key}</label><br>"
                                .replace("{val}",val)
                                .replace("{key}",key)
                            );
                        }
                        
                        var me_editor = this;
                        this.element.on("change","input",function(){
                            me_editor.value = $(this).val();
                            me_editor.trigger("change");
                            
                            me.value.editorLayout = me_editor.value;
                            me.setValue(me.value);
                            me.trigger("change");
                        });
                    },
                    setValue: function (val) {
                        this._super(val);
                        this.element
                            .find("input")
                            .filter(function(){
                                return $(this).attr("value")==val
                            })
                            .attr("checked",true);
                    }
                }))
            ];
            this._super($.extend(options,{items:items}));
            this.loadValue();
        },
        saveValue: function () {
            $.jStorage.set("editorPanel_options_"+location.href,this.value);
        },
        loadValue: function () {
            this.setValue(
                $.jStorage.get("editorPanel_options_"+location.href,{
                    fontSize: 14,
                    editorLayout: 'right'
                })
            );
        },
        setValue: function (value) {
            this.value = value;
            this.fontLabel.setValue(this.value.fontSize);
            this.fontSlider.setValue(this.value.fontSize);
            this.editorLayoutSelect.setValue(this.value.editorLayout);
            
            this.saveValue();
        }
    });
})(teacss.jQuery);