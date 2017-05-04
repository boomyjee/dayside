(function($,ui){
    
dayside.plugins.collaborate_light = teacss.ui.Control.extend({
    init: function (o) {
        var me = this;
        this._super(o);
        
        dayside.plugins.collaborate_light.instance = me;
        
        dayside.ready(function(){
            dayside.editor.bind("editorCreated",function(b,e){
                var editor = e.editor;
                var tab = e.tab;

                tab.bind("close",function(o,e){ 
                    if (!e.cancel) {
                        me.changed(tab,editor,{type:'close',file:tab.options.file});
                    }
                });
                tab.editor.updateOptions({readOnly:me.readonly ? true:false});

                editor.getModel().onDidChangeContent(function(e){ 
                    var e_copy = $.extend(true,{type:'change',selections:editor.getSelections(),file:tab.options.file},e);
                    me.changed(tab,editor,e_copy);
                });      
                
                tab.bind("codeSaved",function(){
                    me.changed(tab,editor,{type:'save',file:tab.options.file});
                });
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
            me.connect();
        });
    },

    isChanged: function () {
        var changed = false;
        ui.codeTab.tabs.forEach(function(tab){
            if (tab.changed) changed = true;
        });
        return changed;
    },

    tryLoseLead: function () {
        var me = this;
        if (!me.connected) return;
        if (me.current_leader!=me.ref_user.key) return;

        if (!me.isChanged()) {
            me.ref_root.child("edits").remove();
        }
    },

    setReadonly: function (flag) {
        var me = this;
        me.readonly = flag;
        ui.codeTab.tabs.forEach(function(tab){
            if (tab.editor) tab.editor.updateOptions({readOnly:flag});
        });
    },

    changed: function (tab,editor,event) {
        var me = this;
        if (!this.connected) return;

        if (event.type=='change') {
            if (me.current_leader && me.current_leader != me.ref_user.key && !me.readonly) {
                me.disconnect();
                return;
            }
            if (!me.current_leader) {
                var ref_edit = me.ref_root.child("edits").push();
                ref_edit.set({type:"leader",id:me.ref_user.key});
                ref_edit.onDisconnect().remove();
            }
        }

        if (me.current_leader==me.ref_user.key) {
            var ref_edit = me.ref_root.child("edits").push();
            ref_edit.set(event);
            ref_edit.onDisconnect().remove();
        }
    },

    edit_id: 123456,
    editCreated: function (snapshot) {
        var me = this;
        var track = snapshot.val();

        if (track.type=="leader") {
            function changeLeader(id) {
                me.current_leader = id;
                if (me.current_leader && me.current_leader != me.ref_user.key) {
                    me.setReadonly(true);
                } else {
                    me.setReadonly(false);
                    if (!me.current_leader && me.isChanged()) me.disconnect();
                }
            }

            changeLeader(track.id);
            snapshot.ref.on("value",function (leader_snapshot){
                if (leader_snapshot.val()==null) {
                    changeLeader(null);
                }
            });
            return;
        }

        if (me.current_leader==me.ref_user.key) {
            me.tryLoseLead();
            return;
        }

        function findTab(found_callback) {
            for (var i=0;i<ui.codeTab.tabs.length;i++) {
                if (ui.codeTab.tabs[i].options.file==track.file) {
                    var tab = ui.codeTab.tabs[i];
                    tab.editorReady(found_callback);
                    return;
                }
            }
        }

        if (track.type=='change') {
            var tab = dayside.editor.selectFile(track.file);
            tab.editorReady(function(){
                var edit = {
                    identifier: {major:me.edit_id++,minor:1},
                    range: track.range,
                    text: track.text
                };

                tab.editor.getModel().pushEditOperations(
                    tab.editor.getSelections(),
                    [edit],
                    function () {
                        setTimeout(function(){
                            tab.editor.revealRangeInCenterIfOutsideViewport(track.selections[0]);
                        },1);
                        return track.selections;
                    }
                );
            });
        }

        if (track.type=='close') {
            findTab(function(){
                this.tabPanel.closeTab(this,true);
            });
        }

        if (track.type=='save') {
            findTab(function(){
                FileApi.cache[this.options.file] = this.editor.getValue();
                this.editorChange();
            });
        }
    },

    connect: function () {

        var me = this;
        if (me.isChanged()) {
            alert('Save all files before collaborating');
            return;
        }

        if (!me.ref_root) {
            FileApi.request('firebase_init',{},true,function(ret){
                if (ret.data.error) {
                    alert(ret.data.error);
                    return;
                }
                $.ajax({
                    dataType: 'script',
                    cache: true,
                    url: 'https://www.gstatic.com/firebasejs/3.9.0/firebase.js',
                    success: function () {
                        var config = {
                            apiKey: ret.data.api_key,
                            databaseURL: ret.data.url
                        };
                        firebase.initializeApp(config);

                        firebase.auth().signInWithCustomToken(ret.data.token).catch(function(error) {
                            alert(error.message);
                        });

                        var uid = 'dayside/'+FileApi.root.replace(/[^A-Za-z0-9_-]/g,'-');
                        me.ref_root = firebase.database().ref(uid);

                        me.ref_user = me.ref_root.child("users").push({name:"unknown"});
                        me.ref_user.onDisconnect().remove();

                        me.connect();
                    }
                });
            });
            return;
        }

        me.ref_root.child("edits").on("child_added",$.proxy(me.editCreated,me));

        me.button.element.css({background:"#f90"});        
        me.connected = true;
        console.debug('firebase connected');
    },
    
    disconnect: function () {
        var me = this;
        me.button.element.css({background:""});
        me.connected = false;
        me.setReadonly(false);
        me.current_leader = false;

        if (me.ref_root) {
            me.ref_root.child("edits").off("child_added");
            if (me.current_leader==me.ref_user.key) {
                me.ref_root.child("edits").remove();
            }

            firebase.database().goOffline();
            me.ref_root = false;

            console.debug("firebase disconnected");
        }
        
    }
});

})(teacss.jQuery,teacss.ui);  