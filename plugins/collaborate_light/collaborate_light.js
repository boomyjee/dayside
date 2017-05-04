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
                        me.changed(tab,editor,{type:'close'});
                    }
                });

                editor.getModel().onDidChangeContent(function(e){ 
                    var e_copy = $.extend(true,{type:'change'},e);
                    me.changed(tab,editor,e_copy);
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

    changed: function (tab,editor,event) {
    },

    leader_changed: function () {
    },

    edit_created: function () {
    },
    
    connect: function () {

        var allSaved = true;
        $.each(teacss.ui.codeTab.tabs,function(t,tab){
            if (tab.changed) allSaved = false;
        });
        if (!allSaved) {
            alert('Save all files before collaborating');
            return;
        }

        var me = this;
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

        me.ref_root.child("leader").on("value",me.leader_changed);
        me.ref_root.child("edits").on("child_added",me.edit_created);


        me.button.element.css({background:"#f90"});        
        me.connected = true;
        console.debug('firebase connected');
    },
    
    disconnect: function () {
        var me = this;
        me.button.element.css({background:""});
        me.connected = false;

        if (me.ref_root) {
            me.ref_root.child("leader").off("value",me.leader_changed);
            me.ref_root.child("edits").off("child_added",me.edit_created);
        }
        
    }
});

})(teacss.jQuery,teacss.ui);  