window.dayside = window.dayside || (function(){
    var dir = "/dayside";
    var res;

    var $ = teacss.jQuery;
    $("script").each(function(){
        var src = $(this).attr("src");
        if (!src) return;
        if (res = src.match(/^(.*?)client\/src\/app\.js$/)) dir = res[1];
        if (res = src.match(/^(.*?)client\/dayside\.js$/)) dir = res[1];
    });
    
    if (typeof(tea)!="undefined") {
        if (tea.path) {
            if (res = tea.path.match(/^(.*?)client\/src\/app\.js$/)) dir = res[1];
            if (res = tea.path.match(/^(.*?)client\/dayside\.js$/)) dir = res[1];
        }
    }
    
    var link = document.createElement("a");
    link.href = dir=="" ? "." : dir; 
    dir = link.href.replace(/\/$/,'');
    
    var dayside = function (options) {
        if (dayside.editor) return;

        var authWait = false;
        var defaults = {
            root: dir.substring(0,dir.lastIndexOf('/')),
            ajax_url: dir + "/server/demo.php",
            jupload_url: dir + "/server/assets/jupload/jupload.jar",
            auth_error: function (auth_type,type,data,json,callback) {
                if (authWait && !data.password) {
                    authWait.push({type:type,data:data,json:json,callback:callback});
                } else {
                    if (!data.password) authWait = [];
                    var password = prompt(auth_type=='auth_error' ? 'Enter password':'No password is set. Enter one');
                    return FileApi.request(type,$.extend(data||{},{password:password}),json,function(answer){
                        for (var i=0;i<authWait.length;i++) {
                            var it = authWait[i];
                            FileApi.request(it.type,it.data,it.json,it.callback);
                        }
                        authWait = false;
                        if (callback) callback(answer);
                    });
                }
            },
            preview: true
        }
        dayside.options = options = $.extend(defaults,options);
        
        $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
            if (options.type.toLowerCase() === "post") {
                if (options.data instanceof FormData) {
                    options.data.append('_csrf', FileApi.getCSRFToken());
                } else {
                    options.data = options.data || "";
                    options.data += options.data ? "&" : "";
                    options.data += '_csrf' + "=" + FileApi.getCSRFToken();
                }
            }
        });
        
        teacss.jQuery(function ($){
            FileApi.root = options.root;
            FileApi.ajax_url = options.ajax_url;
            FileApi.auth_error = options.auth_error;
            
            dayside.loaded = false;
            var editor = new teacss.ui.editorPanel({
                jupload: options.jupload_url
            });
            dayside.loaded = true;
            onLoaded();
        });        
    }
    
    // for early events
    dayside.core = teacss.ui.Control();
    
    dayside.storage = {
        key: function (key) {
            return "dayside_"+location.href;
        },
        get: function (key,def) {
            if (typeof(localStorage)!='undefined') {
                var gkey = this.key();
                var item = localStorage.getItem(gkey);
                if (item) {
                    try {
                        item = eval('('+item+')');
                    } catch (e) {
                        return def;
                    }
                    return item[key];
                }
            }
            return def;
        },
        set: function (key,value) {
            if (typeof(localStorage)!='undefined') {
                var gkey = this.key();
                var item = localStorage.getItem(gkey);
                if (item) {
                    try {
                        item = eval('('+item+')'); 
                    } catch (e) {
                        item = {};
                    }
                } else {
                    item = {};
                }
                item[key] = value;
                localStorage.setItem(gkey,JSON.stringify(item));
            }
        }
    }    
        
    var load_list = [];
    function onLoaded() {
        for (var i=0;i<load_list.length;i++) load_list[i]();
        load_list = [];
    }
    dayside.ready = function (f) {
        if (dayside.loaded) f(); else load_list.push(f);
    }
    dayside.url = dir;
    dayside.plugins = {};
    return dayside;
})();