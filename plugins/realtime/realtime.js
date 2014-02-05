(function($,ui){
    
dayside.realtime = dayside.plugins.realtime = $.Class.extend({
    init: function (o) {
        this.options = $.extend({},o);
        this.Class.instance = this;
    },
    startServer: function (cb) {
        var me = this;
        if (me.serverStarted) {
            console.debug('First start server was not successful');
            return;
        }
        
        me.startCallbacks = me.startCallbacks || [];
        me.startCallbacks.push(cb);
        
        clearTimeout(me.startTimeout);
        me.startTimeout = setTimeout(function(){
            me.serverStarted = true;
            $.ajax({
                url: FileApi.ajax_url,
                data: {_type:"realtime_start"},
                async: false,
                type: "POST",
                success: function (answer) {
                    $.each(me.startCallbacks,function(i,cb){
                        cb();
                    });
                }
            });      
        },1);
    }
});
    
dayside.realtime.client = $.Class.extend({
    init: function (o) {
        this.options = o;
        var url = teacss.path.absolute(FileApi.ajax_url);
        url = url.split("/");
        this.socket_url = "ws://"+url[2]+":8080";
        this.createSocket();
    },
    
    createSocket: function () {
        var me = this;
        var o = this.options;
        
        me.ws = new WebSocket(this.socket_url);
        me.ws.onopen = function () {
            if (o.onopen) o.onopen.apply(me,arguments);
        }
        me.ws.onmessage = function (e) {
            if (o.onmessage) {
                var data = $.parseJSON(e.data);
                o.onmessage.call(me,data);
            }
        }
        me.ws.onclose = function () {
            if (o.onclose) o.onclose.apply(me,arguments);
        }
        me.ws.onerror = function (e) {
            e.preventDefault();
            dayside.realtime.instance.startServer(function(){
                me.createSocket()
            });
        }
    },
    
    send: function (data) {
        this.ws.send(JSON.stringify(data));
    }
})
    
})(teacss.jQuery,teacss.ui);

