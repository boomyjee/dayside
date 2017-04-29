(function ($,ui) {

dayside.plugins.tracker = $.Class.extend({

    buffer: [],

    init: function (options) {
        var me = this;
        this.options = $.extend({},options);

        if (!this.options.url) return;

        me.session_id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});

        dayside.ready(function(){
            dayside.editor.bind("editorCreated",function(b,e){

                var editor = e.editor;
                var tab = e.tab;

                tab.bind("close",function(o,e){ 
                    if (!e.cancel) {
                        me.changed(tab,editor,{type:'close'});
                    }
                });

                me.changed(tab,editor,{type:'created',text:editor.getValue()});

                editor.getModel().onDidChangeContent(function(e){ 
                    var e_copy = $.extend(true,{type:'change'},e);
                    me.changed(tab,editor,e_copy);
                });                
            });
        });

        setInterval(function(){
            if (!me.buffer.length) return;
            $.ajax({
                url: me.options.url,
                type: 'POST',
                data: {
                    buffer: JSON.stringify(me.buffer)
                }
            });
            me.buffer = [];
        },2000);
    },

    changed: function (tab,editor,data) {
        data.file = tab.options.file;
        data.center = editor.getCenteredRangeInViewport();
        data.pos = editor.getPosition();
        data.timestamp = Date.now();
        data.root = dayside.options.root;
        data.session_id = this.session_id;
        this.buffer.push(data);
    }
     
});
    
    
})(teacss.jQuery,teacss.ui);