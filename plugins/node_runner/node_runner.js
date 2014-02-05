(function($,ui){
    
dayside.plugins.node_runner = $.Class.extend({
    init: function (o) {
        this.options = $.extend({},o);
        this.Class.instance = this;
        var me = this;
        dayside.ready(function(){me.ready()});
    },
        
    ready: function() {
        var me = this;

        FileApi._async = false;
        FileApi.request('xdebug_path',{path:FileApi.root},true,function(res){
            me.root = res.data.path;
        });
        FileApi._async = true;
        
        me.nodeCommand = "echo Restarting node... ; killall -9 node ; node "+me.root+"server.js 2>&1";
        me.nodeUrl = "http://"+teacss.path.absolute(FileApi.ajax_url).split("/")[2]+":8888";
        
        this.consoleClient = new dayside.realtime.client({
            onopen: function () {
                me.consoleTab = ui.panel("Console");
                me.consoleTab.element.css({overflowY:'scroll'});
                me.consoleTab.pre = $("<pre>")
                    .css({display:'block',padding:10,fontSize:14,'white-space':'pre-wrap'})
                    .appendTo(me.consoleTab.element);
                dayside.editor.mainPanel.addTab(me.consoleTab,"node_runner_console","right");
                
                me.browserTab = ui.panel("Preview");
                dayside.editor.mainPanel.addTab(me.browserTab,"node_runner_browser","right");
                
                me.runButton = new teacss.ui.button({
                    label:"Node Run",
                    icons:{primary:'ui-icon-play'},margin: 0,
                    click: function () { me.run() }
                });
                me.controlButtons = me.runButton.element;
                dayside.editor.toolbar.element.append(me.controlButtons);                
                
                this.send({type:"shell",cmd:me.nodeCommand});
                
                setTimeout(function(){
                    var frameDiv = $("<div>").css({position:'absolute',left:0,right:0,top:0,bottom:0});
                    me.browserTab.element.append(frameDiv);
                    me.frame = $("<iframe>",{src:me.nodeUrl}).css({width:"100%",height:"100%"}).appendTo(frameDiv);
                },10);
                
                me.loaded = true;
            },
            onmessage: function (data) {
                console.debug(data);
                if (data.type=="shell" && !data.finished) {
                    me.consoleTab.pre.append(data.result);
                    var el = me.consoleTab.element;
                    el.scrollTop(el[0].scrollHeight);
                    
                    if (me.needFrameReload) {
                        me.frame[0].src = me.frame[0].src;
                        me.needFrameReload = false;
                    }
                }
            }
        });
        
        dayside.editor.bind("editorOptions",function(b,ev){
            ev.options.onKeyEvent = function (editor,e) {
                // ctrl+r in editor
                if (e.which==82 && e.ctrlKey) {
                    e.originalEvent.preventDefault();
                    me.run();
                    return true;
                }
            }
        });
        $(document).bind("keydown","ctrl+r",function(e){
            e.preventDefault();
            e.stopPropagation();
            me.run();
            return false;
        });
    },
    
    run: function () {
        var me = this;
        if (!me.loaded) return;
        
        var q = teacss.queue(10);
        
        $.each(ui.codeTab.tabs,function(t,tab){
            if (tab.changed) {
                q.defer(function(done){
                    tab.saveFile(function(){
                        console.debug('saved');
                        done();
                    });
                });
            }
        });
        
        q.await(function(){
            console.debug('shell send');
            me.consoleClient.send({type:"shell",cmd:me.nodeCommand});
            me.needFrameReload = true;
        });
    }
});

    
})(teacss.jQuery,teacss.ui);

