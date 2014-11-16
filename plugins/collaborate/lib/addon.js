(function($,ui){
    
dayside.plugins.collaborate = teacss.ui.Control.extend({
    init: function (o) {
        var me = this;
        this._super(o);
        
        me.openFiles = [];
        
        dayside.core.bind("configDefaults",function(b,e){
            e.value.collaboration_autostart = false;
        });

        dayside.core.bind("configUpdate",function(b,e){
            me.autostart = e.value.collaboration_autostart;
        });

        dayside.core.bind("configTabsCreated",function(b,e){
            var configTab = teacss.ui.panel({
                label: "Collaboration", padding: "1em"
            }).push(
                ui.label({ value: "Collaboration options:", margin: "5px 0" }),
                ui.check({ label: "Autostart enabled", name: "collaboration_autostart", width: "100%", margin: "5px 0" })
            );
            e.tabs.addTab(configTab);
        });        
        
        dayside.ready(function(){
            dayside.editor.bind("editorCreated",function(b,e){
                if (me.connected) me.wrap(e.tab);
            });
            me.button = new teacss.ui.button({
                label:"Collaborate",
                icons:{primary:'ui-icon-refresh'}, margin: 0,
                click: function () {
                    if (!me.connected) {
                        me.connect();
                    } else {
                        me.disconnect();
                    }
                }
            });
            me.button.element.appendTo(dayside.editor.toolbar.element);
            
            me.tab = new teacss.ui.panel({label:"Collaborate"});
            me.joinVideoChatButton = teacss.ui.button({
                label:"Join Video Chat",width:"80%",margin:"10px auto",
                click:function(){ me.joinChat() },
                icons: { primary: "ui-icon-video" }
            }),
            me.leaveVideoChatButton = teacss.ui.button({
                label:"Leave Video Chat",width:"80%",margin:"10px auto",
                click:function(){ me.leaveChat() },
                icons: { primary: "ui-icon-close" }
            });
            me.tab.push(me.joinVideoChatButton,me.leaveVideoChatButton);
            me.videoDiv = $("<div>").appendTo(me.tab.element);
            me.userList = $("<ul>").addClass("collaborate-user-list").appendTo(me.tab.element).css({padding:15})
            
            me.userList.on("click","a[data-file]",function(e){
                e.preventDefault();
                dayside.editor.selectFile($(this).attr("data-file"));
            });
            
            me.joinVideoChatButton.element.css("display","block").show();
            me.leaveVideoChatButton.element.css("display","block").hide();
            
            if (me.autostart) me.connect();
        });
    },
    
    joinChat: function () {
        var me = this;
        if (me.meeting) me.leaveChat();
        
        var ref = me.rootRef.child('meetings');
        
        me.meeting = new Meeting({ firebase:ref });
        me.meeting.bind("addStream",function(b,e){
            me.videoDiv[0].appendChild(e.video);
            $(e.video).css({
                width: "100%",
                boxSizing: "border-box",
                border: e.type=='local' ? "2px solid yellow" : "2px solid #ccc"
            })
        });
        me.meeting.bind("userLeft",function(b,id){
            var video = document.getElementById(id);
            if (video) video.parentNode.removeChild(video);
        });
        me.meeting.connect();
        
        me.joinVideoChatButton.element.hide();
        me.leaveVideoChatButton.element.show();
    },
    
    leaveChat: function () {
        var me = this;
        
        if (me.meeting) {
            me.meeting.disconnect();
            me.meeting = false;
        }
        
        me.videoDiv.empty();
        me.joinVideoChatButton.element.show();
        me.leaveVideoChatButton.element.hide();
    },
    
    connect: function () {
        var me = this;
        me.button.element.css({background:"#f90"});
        if (!me.rootRef) {
            FileApi.request('firepad_init',{},true,function(ret){
                if (ret.data.error) {
                    alert(ret.data.error);
                    return;
                }
                var uid = 'dayside/'+FileApi.root.replace(/[^A-Za-z0-9_-]/g,'-');
                me.rootRef = new Firebase(ret.data.url).child(uid);
                me.rootRef.authWithCustomToken(ret.data.token, function(error, authData){
                    if (error) {
                        alert(error);
                    } else {
                        me.connect();
                    }
                });
            });
            return;
        }
        me.connected = true;
        console.debug('firepad connected');
        
        me.ref_users = me.rootRef.child('users');
        me.ref_user = me.ref_users.push({
            name:'Guest'+Math.floor(Math.random()*1000)
        });
        me.ref_user.onDisconnect().remove();
        me.ref_users.on("value",function(snapshot){
            var users = snapshot.val();
            me.userList.empty();
            if (users) $.each(users,function(id,data){
                if (id==me.ref_user.key()) return;
                
                var ul = false;
                if (data.files) $.each(data.files,function(f,file){
                    ul = ul || $("<ul>").css({paddingLeft:15,paddingBottom:15});
                    ul.append(
                        $("<li>").append(
                            $("<a href='#'>")
                                .attr("data-file",file)
                                .text(file.substring(FileApi.root.length))
                        )
                    );
                });
                var li = $("<li>").text(data.name).append(ul);
                me.userList.append(li);
            });
        });
        
        $.each(teacss.ui.codeTab.tabs,function(t,tab){
            me.wrap(tab);
        });
        dayside.editor.mainPanel.addTab(me.tab,"collaborate","right");
    },
    
    disconnect: function () {
        var me = this;
        me.button.element.css({background:""});
        me.connected = false;
        me.tab.element.detach();
        me.tab.tabPanel.closeTab(me.tab);
        
        if (me.ref_user) me.ref_user.remove();
        if (me.ref_users) me.ref_users.off();
        
        $.each(teacss.ui.codeTab.tabs,function(t,tab){
            me.unwrap(tab);
        });
        me.leaveChat();
    },
    
    unwrap: function (tab) {
        var me = this;
        if (tab.editor && tab.editor.firepad) {
            tab.editor.firepad.dispose();
            tab.editor.firepad = false;            
        }
        if (me.ref_user && tab.options.file) {
            var idx = me.openFiles.indexOf(tab.options.file);
            if (idx!=-1) {
                me.openFiles.splice(idx, 1);
                me.ref_user.child("files").set(me.openFiles);
            }
        }
    },
    
    wrap: function (tab) {
        var me = this;
        var cm = tab.editor;
        var file = tab.options.file;
        
        if (!tab.closeWrapped) {
            tab.closeWrapped = true;
            tab.bind("close",function(){
                me.unwrap(tab);
            });
        }
        
        if (me.ref_user && tab.options.file) {
            if (me.openFiles.indexOf(tab.options.file)==-1) {
                me.openFiles.push(tab.options.file);
                me.ref_user.child("files").set(me.openFiles);
            }
        }
        
        if (!cm || !file || cm.firepad) return;
        
        var id = file.replace(/[^A-Za-z_-]/g,'--');
        var ref = me.rootRef.child('firepad').child(id);

        ref.child("users").on("value",function(snapshot){
            if (cm.firepadInitialized) return;
            cm.firepadInitialized = true;
            var users = snapshot.val();
            
            if (!users) {
                ref.child('history').remove();
            }
            cm.firepad = Firepad.fromCodeMirror(ref,cm);
            cm.firepad.on('ready',function(){
                if (!users) {
                    cm.firepad.client_.undoManager.undoStack = [];
                    console.debug('text from file');
                } else {
                    console.debug('text from firepad');
                }
                $(".powered-by-firepad").hide();
            });
        });
    }
});

})(teacss.jQuery,teacss.ui);  