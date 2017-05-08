(function($,ui){
    
dayside.plugins.collaborate_light = teacss.ui.Control.extend({

    init: function (o) {
        var me = this;
        this._super($.extend({
            allowedEvents: ['open','close','save','change','scroll']
        },o));
        
        dayside.plugins.collaborate_light.instance = me;

        if (dayside.plugins.git_commit && me.eventAllowed('git_commit')) {
            dayside.plugins.git_commit.instance.bind("tabCreated",function(b,e){
                var tab = e.tab;
                if (me.processing && me.currentTrack.type=='git_commit') {
                    e.initialState = false;
                }
                setTimeout(function(){
                    tab.observer = new MutationObserver(function(mutations){
                        if (me.processing && me.currentTrack.type=='git_commit') return;
                        var sendEvent = false;
                        mutations.forEach(function(m){
                            if (m.type=='attributes' && m.attributeName=='id') return;
                            if ($(m.target).parents(".panel_buttons").length) return;
                            sendEvent = true;
                        });
                        if (!sendEvent) return;
                        me.remoteEvent(tab,false,{type:'git_commit',path:tab.options.path,html:tab.element.html()});
                    });
                    tab.observer.observe(tab.element.get(0),{ attributes: true, childList: true, characterData: true, subtree: true });
                },1);
                
            })
        }
        
        dayside.ready(function(){
            dayside.editor.bind("editorCreated",function(b,e){
                var editor = e.editor;
                var tab = e.tab;

                tab.bind("close",function(o,e){ 
                    if (!e.cancel) {
                        me.remoteEvent(tab,editor,{type:'close',file:tab.options.file});
                    }
                });
                tab.bind("saving",function(o,e){
                    if (me.readonly) e.cancel = true;
                });

                tab.editor.updateOptions({readOnly:me.readonly ? true:false});

                editor.getModel().onDidChangeContent(function(e){ 
                    var e_copy = $.extend(true,{type:'change',file:tab.options.file},e);
                    me.remoteEvent(tab,editor,e_copy);
                });      

                if (me.eventAllowed('scroll')) {
                    editor.onDidScrollChange(function(){
                        if (me.processing) return;
                        clearTimeout(editor.collaborateScrollTimeout);
                        editor.collaborateScrollTimeout = setTimeout(function(){
                            me.remoteEvent(tab,editor,{type:'scroll',file:tab.options.file,viewState:JSON.stringify(tab.editor.saveViewState())});
                        },100);
                    });
                }
                
                tab.bind("codeSaved",function(){
                    me.remoteEvent(tab,editor,{type:'save',file:tab.options.file});
                });

                if (me.processing && me.currentTrack.type=='open' && me.processing.file==tab.options.file) {
                } else {
                    me.remoteEvent(tab,editor,{type:'open',file:tab.options.file,viewState:JSON.stringify(tab.editor.saveViewState())});
                }
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

    eventAllowed(type) {
        return this.options.allowedEvents.indexOf(type)!=-1;
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

    openGitCommitTab: function(path,html,done_cb) {

        var me = this;
        console.debug('loading git_commit');
        
        var tab = dayside.plugins.git_commit.instance.openTab(path);
        tab.element.html(html);

        setTimeout(function(){
            console.debug('END loading git_commit');
            done_cb();
        },1);

        return tab;
    },

    remoteEvent: function (tab,editor,event) {
        var me = this;
        if (!this.connected) return;
        if (!me.eventAllowed(event.type)) return;

        if (me.current_leader && me.current_leader.locked) {
            if (me.current_leader.id != me.ref_user.key && !me.readonly && event.type=='changed') {
                me.disconnect();
                return;
            }
        } else {
            var ref_leader = me.ref_root.child("leader");
            ref_leader.set({id:me.ref_user.key,locked:true});
            ref_leader.onDisconnect().remove();
        }

        if (me.current_leader && me.current_leader.id==me.ref_user.key) {
            var ref_edit = me.ref_root.child("edits").push();
            ref_edit.set(event);
            ref_edit.onDisconnect().remove();
        }
    },

    leaderChanged: function (snapshot) {
        var me = this;
        me.processNextEvent(function(processed_cb){
            me.current_leader = snapshot.val();
            if (me.current_leader && me.current_leader.locked) {
                me.setReadonly(me.current_leader.id != me.ref_user.key);
            } else {
                me.setReadonly(false);
                if (me.isChanged()) me.disconnect();
            }
            processed_cb();
        });
    },

    editCreated: function (snapshot) {
        var me = this;
        var track = snapshot.val();
        me.processNextEvent(function(processed_cb){
            me.currentTrack = track;
            me.processTrack(track,function(){
                me.currentTrack = false;
                processed_cb();
            });
        });
    },

    process_queue: [],
    processNextEvent: function(ev) {
        var me = this;
        if (ev) me.process_queue.push(ev);
        if (!me.process_queue.length) return;
        if (me.processing) return;

        me.processing = me.process_queue.shift();
        me.processing(function(){
            me.processing = false;
            me.processNextEvent()
        });
    },

    edit_id: 123456,
    processTrack: function(track,done_cb) {
        var me = this;
        if (me.current_leader && me.current_leader.id==me.ref_user.key) {
            // timeout needed to catch all sequential monaco changed events before checking editor value
            clearTimeout(me.loseLeadTimeout);
            me.loseLeadTimeout = setTimeout(function(){
                if (!me.isChanged()) {
                    me.ref_root.child("edits").remove();
                    me.ref_root.child("leader").set({id:me.ref_user.key,locked:false});
                }
            },1);
            done_cb();
            return;
        }

        console.debug(track);

        function findTab(found_callback) {
            for (var i=0;i<ui.codeTab.tabs.length;i++) {
                if (ui.codeTab.tabs[i].options.file==track.file) {
                    var tab = ui.codeTab.tabs[i];
                    tab.editorReady(function(){
                        found_callback.call(this);
                        done_cb();
                    });
                    return;
                }
            }
            done_cb();
        }

        if (track.type=='git_commit') {
            me.openGitCommitTab(track.path,track.html,done_cb);
        }

        if (track.type=='open') {
            var tab = dayside.editor.selectFile(track.file);
            tab.editorReady(function(){
                tab.editor.restoreViewState(JSON.parse(track.viewState));
                done_cb();
            });
        }

        if (track.type=='scroll') {
            findTab(function(){
                var tab = this;
                tab.editor.restoreViewState(JSON.parse(track.viewState));
            });
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
                            done_cb();
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