(function($,ui){
    
dayside.plugins.collaborate = teacss.ui.Control.extend({
    init: function (o) {
        var me = this;
        this._super(o);
        
        me.openFiles = [];
        
        dayside.core.bind("configDefaults",function(b,e){
            e.value.collaboration_autostart = false;
            e.value.collaboration_username = "";
        });

        dayside.core.bind("configUpdate",function(b,e){
            me.autostart = e.value.collaboration_autostart;
            me.config_username = e.value.collaboration_username || "Guest_"+(Math.floor(Math.random()*1000));
            if (me.meeting)
                me.meeting.setUserData({name:me.config_username});
        });

        dayside.core.bind("configTabsCreated",function(b,e){
            var configTab = teacss.ui.panel({
                label: "Collaboration", padding: "1em"
            }).push(
                ui.label({ value: "Collaboration options:", margin: "5px 0" }),
                ui.check({ label: "Autostart enabled", name: "collaboration_autostart", width: "100%", margin: "5px 0" }),
                ui.label({ value: "Username to display:", margin: "5px 0" }),
                ui.text({ name: "collaboration_username", margin:"0px 0", width: "100%" })
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
        this.meeting.joinChat();
        this.joinVideoChatButton.element.hide();
        this.leaveVideoChatButton.element.show();
    },
    
    leaveChat: function () {
        this.meeting.leaveChat();
        this.joinVideoChatButton.element.show();
        this.leaveVideoChatButton.element.hide();
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
        
        if (!me.meeting) {
            me.meeting = new Meeting({ firebase: me.rootRef.child('meetings') });
            me.meeting.setUserData({
                name: me.config_username
            });
            
            me.meeting.bind("usersChange",function(b,users){
                me.userList.empty();
                if (users) $.each(users,function(id,data){
                    var you = (id==me.meeting.user_id);
                    var ul = false;
                    if (data.files) $.each(data.files,function(f,file){
                        var file_short = file.substring(FileApi.root.length);
                        if (file_short[0]=='/') file_short = file_short.substring(1);
                        
                        ul = ul || $("<ul>").css({paddingLeft:15,paddingBottom:15});
                        ul.append(
                            $("<li>").append(
                                $("<a href='#'>")
                                    .attr("data-file",file)
                                    .text(file_short)
                            )
                        );
                    });
                    var li = $("<li>").text(data.name+(you ? " (it's you)":"")).append(ul);
                    if (you)
                        me.userList.prepend(li);
                    else
                        me.userList.append(li);
                });                
            });            
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
        }
        
        $.each(teacss.ui.codeTab.tabs,function(t,tab){
            me.wrap(tab);
        });
        
        me.connected = true;
        me.meeting.connect();
        console.debug('firebase connected');
        
        dayside.editor.mainPanel.addTab(me.tab,"collaborate","right");
    },
    
    disconnect: function () {
        var me = this;
        me.button.element.css({background:""});
        me.connected = false;
        me.tab.element.detach();
        me.tab.tabPanel.closeTab(me.tab);
        
        me.meeting.disconnect();
        
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
        if (me.meeting && tab.options.file) {
            var idx = me.openFiles.indexOf(tab.options.file);
            if (idx!=-1) {
                me.openFiles.splice(idx, 1);
                me.meeting.setUserData({files:me.openFiles});
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
        
        if (me.meeting && tab.options.file) {
            if (me.openFiles.indexOf(tab.options.file)==-1) {
                me.openFiles.push(tab.options.file);
                me.meeting.setUserData({files:me.openFiles});
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