(function($,ui){

if (window.phpdesktop) {
	// desktop version
    dayside.realtime = {};
	dayside.realtime.client = function (o) {
		var me = this;
		me.process = window.phpdesktop.CreateProcess();
        
        function read() {
            var res = me.process.read_stdout();
			if (o.onmessage) {
				if (res.buffer) o.onmessage.call(this,{type:"shell",result:res.buffer});
				if (res.count==-1) o.onmessage.call(this,{type:"shell",finished:true});
			}
            if (res.count!=-1) me.timeout = setTimeout(read,100);
        }

		this.send = function (data) {
			if (data.type=="shell" && data.cmd) {
                clearTimeout(me.timeout);
                var killres = me.process.kill();
                console.debug('kill process',killres);
                setTimeout(function(){
                    var res = me.process.spawn(data.cmd);
                    if (res) {
                        me.timeout = setTimeout(read,100);
                    } else {
                        console.debug('process spawn failed');
                    }
                },1);
			}
		}
		if (o.onopen) o.onopen.call(this);
	};
}
    
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
        
        var package = false;
        FileApi.file(FileApi.root+"/package.json",function(res){
            if (res && res.data) {
                try {
                    var data = $.parseJSON(res.data);
                    package = data.scripts.start;
                } catch (e) {}
            }
        });
        
        if (!package) {
            console.debug('No package.json found');
            return;
        } else {
            package = package.replace(/node[ ]*/g,'');
        }
        
        FileApi.request('xdebug_path',{path:FileApi.root},true,function(res){
            me.root = res.data.path;
            if (me.root.indexOf("win://")==0)
                me.root = me.root.substring("win://".length);
            me.root = me.root.replace(/\/$/, "");
        });
        FileApi._async = true;
        
        me.nodePort = 8888;
        if (window.phpdesktop)
            me.nodeCommand = "cmd /C (echo Starting node... & taskkill /F /IM node.exe & set PORT="+me.nodePort+" & node "+me.root+"/"+package+") 2>&1";
        else
            me.nodeCommand = "echo Starting node... ; killall -9 node ; export PORT="+me.nodePort+" ; node "+me.root+"/"+package+" 2>&1";

        me.nodeUrl = "http://"+teacss.path.absolute(FileApi.ajax_url).split("/")[2].split(":")[0]+":"+me.nodePort;

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
                        if (data.result.indexOf("Starting")==0) return;
                        me.frame[0].src = me.frame[0].src;
                        me.needFrameReload = false;
                    }
                }
            },
            onclose: function () {
                if (me.loaded) {
                    alert('Console socket was killed. Refresh IDE.');
                }
            }
        });
        
        var needRun = false;
        dayside.editor.bind("editorOptions",function(b,ev){
            ev.options.onKeyEvent = function (editor,e) {
                // ctrl+r in editor
                if (e.which==82 && e.ctrlKey) {
                    e.originalEvent.preventDefault();
                    needRun = true;
                    return true;
                }
                if (e.type=="keyup" && needRun) { me.run(); needRun = false; }
            }
        });
        $(document).bind("keydown","ctrl+r",function(e){
            e.preventDefault();
            e.stopPropagation();
            needRun = true;
            return false;
        });
        $(document).bind("keyup",function(e){
            if (needRun) { me.run(); needRun = false; }
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