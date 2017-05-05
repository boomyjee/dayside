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
                tab.bind("saving",function(o,e){
                    if (me.readonly) e.cancel = true;
                });

                tab.editor.updateOptions({readOnly:me.readonly ? true:false});

                editor.getModel().onDidChangeContent(function(e){ 
                    var e_copy = $.extend(true,{type:'change',file:tab.options.file},e);
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
        });
    },

    isChanged: function () {
        var changed = false;
        ui.codeTab.tabs.forEach(function(tab){
            if (tab.changed) changed = true;
        });
        return changed;
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
            if (me.current_leader && me.current_leader.locked) {
                if (me.current_leader.id != me.ref_user.key && !me.readonly) {
                    me.disconnect();
                    return;
                }
            } else {
                var ref_leader = me.ref_root.child("leader");
                ref_leader.set({id:me.ref_user.key,locked:true});
                ref_leader.onDisconnect().remove();
            }
        }

        if (me.current_leader && me.current_leader.id==me.ref_user.key) {
            var ref_edit = me.ref_root.child("edits").push();
            ref_edit.set(event);
            ref_edit.onDisconnect().remove();
        }
    },

    leaderChanged: function (snapshot) {
        var me = this;
        me.current_leader = snapshot.val();

        if (me.current_leader && me.current_leader.locked) {
            me.setReadonly(me.current_leader.id != me.ref_user.key);
        } else {
            me.setReadonly(false);
            if (me.isChanged()) me.disconnect();
        }
    },

    edit_id: 123456,
    editCreated: function (snapshot) {
        var me = this;
        var track = snapshot.val();

        if (me.current_leader && me.current_leader.id==me.ref_user.key) {
            // timeout needed to catch all sequential monaco changed events before checking editor value
            clearTimeout(me.loseLeadTimeout);
            me.loseLeadTimeout = setTimeout(function(){
                if (!me.isChanged()) {
                    me.ref_root.child("edits").remove();
                    me.ref_root.child("leader").set({id:me.ref_user.key,locked:false});
                }
            },1);
            return;
        }

        console.debug(track);

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
                            var position = {
                                column: track.range.startColumn,
                                lineNumber: track.range.startLineNumber
                            };
                            if (track.range.startLineNumber==track.range.endLineNumber) {
                                position.column += track.text.length;
                            }

                            tab.editor.revealPositionInCenterIfOutsideViewport(position);
                            tab.editor.setPosition(position);
                        },1);
                        return tab.editor.getSelections();
                    }
                );
            });
        }

        if (track.type=='close') {
            findTab(function(){
                this.tabPanel.closeTab(this,true);
                var index = this.Class.tabs.indexOf(this);
                if (index!=-1) this.Class.tabs.splice(index, 1);
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
        me.ref_root.child("leader").on("value",$.proxy(me.leaderChanged,me));

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

            if (me.current_leader && me.current_leader.id==me.ref_user.key) {
                me.ref_root.child("edits").remove();
                me.ref_root.child("leader").remove();
            }

            firebase.database().goOffline();
            me.ref_root = false;

            console.debug("firebase disconnected");
        }
        
    }
});

})(teacss.jQuery,teacss.ui);  