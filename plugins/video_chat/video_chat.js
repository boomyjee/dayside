(function($,ui){
    
dayside.plugins.video_chat = teacss.ui.Control.extend({
    init: function (o) {
        var me = this;
        this._super(o);
        
        me.Class.instance = me;
        dayside.ready(function(){
            me.button = new teacss.ui.button({
                label:"Video chat",
                icons:{primary:'ui-icon-video'}, margin: 0,
                click: function () {
                    if (!me.connected) {
                        me.connect();
                    } else {
                        me.disconnect();
                    }
                }
            });
            me.button.element.appendTo(dayside.editor.toolbar.element);

            me.tab = new teacss.ui.panel({label:"Video chat"});
            me.videoDiv = $("<div>").appendTo(me.tab.element);
        });
    },
    
    connect: function () {
        var me = this;
        me.button.element.css({background:"#f90"});

        if (!me.ref_root) {
            dayside.plugins.collaborate_light.instance.getFirebaseRoot(function(app,ref_root){
                me.firebase_app = app;
                me.ref_root = ref_root;
                me.connect();
            });
            return;
        }

        if (!me.meeting) {
            me.meeting = new Meeting({ firebase: me.ref_root.child('meetings') });
            me.meeting.setUserData({
                name: "unknown"
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
        
        dayside.editor.mainPanel.addTab(me.tab,"collaborate","right");

        me.connected = true;
        me.meeting.connect();
        me.meeting.joinChat();
        console.debug('video chat connected');
    },
    
    disconnect: function () {
        var me = this;
        me.button.element.css({background:""});

        me.meeting.leaveChat();
        me.meeting.disconnect();

        me.connected = false;
        me.tab.element.detach();
        me.tab.tabPanel.closeTab(me.tab);

        if (me.ref_root) {
            me.ref_root = false;
            me.meeting = false;
            me.firebase_app.database().goOffline();
        }
    },
});

})(teacss.jQuery,teacss.ui);  


// meeting.js
(function(){
    var $ = jQuery || teacss.jQuery;    
    var isFirefox = !!navigator.mozGetUserMedia;
    var isChrome = !!navigator.webkitGetUserMedia;
    
    navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
    var RTCPeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var RTCSessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
    var RTCIceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
    
    var iceServers = [];

    iceServers.push({
        url: 'stun:stun.l.google.com:19302'
    });

    iceServers.push({
        url: 'stun:stun.anyfirewall.com:3478'
    });

    iceServers.push({
        url: 'turn:turn.bistri.com:80',
        credential: 'homeo',
        username: 'homeo'
    });

    iceServers.push({
        url: 'turn:turn.anyfirewall.com:443?transport=tcp',
        credential: 'webrtc',
        username: 'webrtc'
    });

    var iceServersObject = {
        iceServers: iceServers
    };    

    window.Meeting = teacss.ui.Control.extend({
        init: function (o) {
            this._super(o);
            if (!this.options.firebase) console.debug('No firebase ref is set for Meeting');
            this.peers = {};
            this.user_data = {video:false,audio:false,name:false};
        },
        
        joinChat: function () {
            var me = this;
            this.addStream(function(){
                me.setUserData({video:true,audio:true});    
            });
        },
        
        leaveChat: function () {
            var me = this;
            this.setUserData({video:false,audio:false});
            if (me.stream) {
                me.stream.getTracks().forEach(function(track){
                    track.stop();
                });
                me.disconnectUser(me.user_id);
            }
        },
        
        setUserData: function (data) {
            this.user_data = $.extend(this.user_data,data||{});
            if (this.ref_user) this.ref_user.set(this.user_data);
        },
        
        connect: function () {
            var me = this;
            
            me.ref_users = me.options.firebase.child('users');
            me.ref_signals = me.options.firebase.child('signals');
            me.ref_user = me.ref_users.push(this.user_data);
            me.ref_user.onDisconnect().remove();
            me.user_id = me.ref_user.key;

            me.ref_users.on('value',function(snapshot){
                var users = snapshot.val();

                me.trigger("usersChange",users);

                var peerEnabled = {};
                $.each(me.peers,function(id,peer){
                    peerEnabled[id] = false;
                });

                if (users) $.each(users,function(id,user){
                    if (!me.user_data.video) return;
                    if (id!=me.user_id) {
                        if (me.user_data.video && user.video) {
                            // new user
                            if (id > me.user_id && !me.peers[id]) me.createPeerConnection(id);
                            peerEnabled[id] = true;
                        }
                    }
                });

                $.each(me.peers,function(id,peer){
                    if (!peerEnabled[id]) me.disconnectUser(id);
                });
            });

            me.ref_signals.on('child_added',function (snap) {
                var data = snap.val();
                if (data.user_id != me.user_id) {
                    me.recvMessage(data);
                    snap.ref.remove();
                }
            });
        },
                           
        disconnectUser: function (id) {
            var me = this;
            me.trigger("userLeft",id==me.user_id ? 'self' : id);
            var peer = me.peers[id];
            delete me.peers[id];
            if (peer) peer.close();
        },
        
        addStream: function (cb) {
            var me = this;
            
            navigator.getUserMedia(
                { audio: true, video: true }, 
                function (stream) {
                    me.stream = stream;

                    var video = document.createElement('video');
                    video.id = 'self';
                    video[isFirefox ? 'mozSrcObject' : 'src'] = isFirefox ? stream : window.webkitURL.createObjectURL(stream);
                    video.autoplay = true;
                    video.controls = false;
                    video.muted = true;
                    video.volume = 0;
                    video.play();
                    
                    me.trigger("addStream",{
                        video: video,
                        stream: stream,
                        user_id: 'self',
                        type: 'local'
                    });
                    
                    if (cb) cb();
                }, 
                function (e) {
                    console.error(e);
                }
            );            
        },
        
        sendMessage: function (data) {
            data = data || {};
            data.user_id = this.user_id;
            
            //console.debug('send',data);
            this.ref_signals.push(data);
        },
        
        recvMessage: function (data) {
            //console.debug('recv',data);
            
            var me = this;
            if (data.sdp && data.to == this.user_id) {
                var sdp = data.sdp;
                
                if (sdp.type == 'offer') {
                    me.createPeerConnection(data.user_id,sdp);
                }

                if (sdp.type == 'answer') {
                    me.peers[data.user_id].setRemoteDescription(new RTCSessionDescription(sdp),me.sdpSuccess,me.sdpError);
                }                
            }
            
            if (data.candidate && data.to == this.user_id) {
                me.candidates = me.candidates || [];
                me.candidates.push(data.candidate);
                
                var peer = me.peers[data.user_id];
                if (peer) {
                    $.each(me.candidates,function(c,candidate){
                        peer.addIceCandidate(new RTCIceCandidate({
                            sdpMLineIndex: candidate.sdpMLineIndex,
                            candidate: candidate.candidate
                        }));
                    });
                    me.candidates = [];
                }
            }
        },

        sdpError: function(e) {
            console.error('sdp error:', JSON.stringify(e, null, '\t'));
        },

        sdpSuccess: function() {
        },
        
        createPeerConnection: function (user_id,sdp_in) {
            function toJSON(obj) {
                var res = {};
                for (var key in obj) if (!$.isFunction(obj[key])) res[key] = obj[key];
                return res;
            }
            
            var offerAnswerConstraints = {
                optional: [],
                mandatory: {
                    OfferToReceiveAudio: true,
                    OfferToReceiveVideo: true
                }
            };
            var optionalArgument = {
                optional: [{
                    DtlsSrtpKeyAgreement: true
                }]
            };            
            
            var me = this;
            var peer = new RTCPeerConnection(iceServersObject, optionalArgument);

            if (me.stream) peer.addStream(me.stream);

            peer.onaddstream = function (event) {
                me.addRemoteStream(event.stream,user_id);
            };
            
            peer.onicecandidate = function (e) {
                if (!e.candidate) return;
                me.sendMessage({
                    to: user_id,
                    candidate: toJSON(e.candidate)
                });
            };

            if (sdp_in) peer.setRemoteDescription(new RTCSessionDescription(sdp_in),me.sdpSuccess,me.sdpError);
            peer[sdp_in ? 'createAnswer' : 'createOffer'](
                function(sdp) {
                    peer.setLocalDescription(sdp);
                    me.sendMessage({
                        to:user_id,
                        sdp: toJSON(sdp)
                    });
                },
                me.sdpError,
                offerAnswerConstraints
            );
            me.peers[user_id] = peer;
        },
        
        addRemoteStream: function(stream,user_id) {
            var me = this;
            console.debug('remote stream', stream);

            var video = document.createElement('video');
            video.id = user_id;
            video[isFirefox ? 'mozSrcObject' : 'src'] = isFirefox ? stream : window.webkitURL.createObjectURL(stream);
            video.autoplay = true;
            video.controls = true;
            video.play();

            function onRemoteStreamStartsFlowing() {
                // chrome for android may have some features missing
                if (navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i)) {
                    return afterRemoteStreamStartedFlowing();
                }

                if (!(video.readyState <= HTMLMediaElement.HAVE_CURRENT_DATA || video.paused || video.currentTime <= 0)) {
                    afterRemoteStreamStartedFlowing();
                } else
                    setTimeout(onRemoteStreamStartsFlowing, 300);
            }

            function afterRemoteStreamStartedFlowing() {
                me.trigger("addStream",{
                    video: video,
                    stream: stream,
                    user_id: user_id,
                    type: 'remote'
                });
            }
            onRemoteStreamStartsFlowing();            
        },
        
        disconnect: function () {
            var me = this;
            $.each(me.peers,function(id,peer){
                me.disconnectUser(id);
                delete me.peers[id];
            });
            if (me.ref_users) me.ref_users.off();
            if (me.ref_signals) me.ref_signals.off();
            if (me.stream) {
                me.stream.getTracks().forEach(function(track){ track.stop() });
            }
            if (me.ref_user) {
                me.ref_user.remove();
                me.ref_user = false;
            }
        }
    });
})();