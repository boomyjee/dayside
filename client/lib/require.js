(function(){
    var cache = {
        files: {},
        modules: {}
    };
    
    var extensions = {
        js: {
            proxy: false,
            pre: function (path,callback,async) {
                if (cache.files[path]) return callback();
                if (extensions.js.proxy) {
                    getFile(extensions.js.proxy+"?url="+encodeURIComponent(path),function(text){
                        var ret = JSON.parse(text);
                        for (var key in ret) {
                            var text = ret[key];
                            if (text===false) throw "Proxy could not load module on path "+path;
                            cache.files[key] = text;
                        }
                        callback();
                    });
                } else {
                    getFile(path,function(text){
                        if (text===false) {
                            throw "Could not load module on path "+path;
                            callback(false);
                            return;
                        }
                        var m,r = /require\(\s*('|")(.*?)('|")\s*\)/g;
                        var deps = {}, count = 0;

                        while (m=r.exec(text)) {
                            deps[resolve(m[2],path)] = 1;
                            count++;
                        }

                        var loaded = 0;
                        for (var key in deps) {
                            extensions.js.pre(key,function(){
                                loaded++;
                                if (loaded==count) callback(text);
                            },async);
                        }
                        if (count==0) callback(text);
                    },async);
                }
            },
            get: function (path,callback) {
                var js = "";
                var path_s = "'"+path.replace(/\\?("|')/g,'\\$1')+"'";
                
                js += "(function(){";
                js += "var require = window.require.factory("+path_s+");";
                js += "var exports = {};\n";
                
                js += cache.files[path];
                
                js += "\n"+"return exports;";
                js += "})();";
                js += "//# sourceURL="+path;
                
                try {
                    var res = eval(js);
                } catch (e) {
                    console.debug(path);
                    throw(e);
                }
                callback(res);
            }
        },
        css: {
            get: function (path,callback) {
                var head = document.getElementsByTagName("head")[0];
                var append = document.createElement("link");
                append.type = "text/css";
                append.rel = "stylesheet";
                append.href = path;
                head.appendChild(append);
                callback(true);
            }
        },
        tea: {
            get: function (path,callback,async) {
                if (!async) throw "Can't load tea file synchronously";
                teacss.process(
                    path,
                    function(){
                        teacss.tea.Style.insert(document);
                        teacss.tea.Script.insert(document,callback);
                    },
                    document
                );
            }
        }
    }
    
    function resolve(what,base) {
        var root = require.root.replace(/\/$/,'');
        if (/^\.{1,2}\//.test(what)) {
            if (base===undefined) base = require.base;
            if (base===undefined) base = require.root;
            
            var path = base.split("/");
            path.pop(); 
            path.push(what);
            path = path.join("/");
        } 
        else if (what[0]=='/' || /^http/.test(what)) {
            path = what;
        }
        else {
            path = require.root + "/" + what;
        }
        
        var a = document.createElement('a');
        a.href = path;
        return a.href;
    }
        
    function getFile(path,callback,async) {
        if (cache.files[path]) {
            callback(cache.files[path]);
            return;
        }
        var xhr = (window.ActiveXObject) ? new ActiveXObject("Microsoft.XMLHTTP") : (XMLHttpRequest && new XMLHttpRequest()) || null;
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                var text = cache.files[path] = xhr.status==200 ? xhr.responseText:false;
                try {
                    callback(text);
                } catch (e) {
                    setTimeout(function(){ throw e; },1);
                }
            }
        }
        xhr.open('GET', path, async);
        xhr.send();
    }
        
    var factory = function (base) {
        var r = function () {
            var old = window.require.base;
            window.require.base = base;
            
            var args = Array.prototype.slice.call(arguments);
            var last = args[args.length-1];
            var async = (last && (last.call || last===true)) ? args.pop() : false;
            
            var pathes = [];
            var exts = [];
            var loaded = 0;
            var result = [];
            
            for (var i=0;i<args.length;i++) {
                var path,ext;
                if (args[i].ext!==undefined) {
                    path = resolve(args[i].path);
                    ext = args[i].ext;
                } else {
                    path = resolve(args[i]);
                    ext = (path.match(/[^\\\/]\.([^.\\\/]+)$/) || [null]).pop();
                    if (!ext) {
                        path = path + ".js";
                        ext = "js";
                    }
                }
                pathes.push(path);
                exts.push(ext);
            }
            for (var i=0;i<pathes.length;i++) {
                var path = pathes[i];
                var ext = exts[i];
                if (cache.modules[path]) { loaded_cb(); continue; }
                
                var pre = extensions[ext].pre;
                if (pre)
                    pre(path,loaded_cb,async);
                else
                    loaded_cb();
            }
            if (pathes.length==0) loaded_cb();
            
            function loaded_cb() {
                loaded++;
                if (loaded>=args.length) {
                    var got = 0;
                    function next() {
                        if (got<pathes.length) {
                            var path = pathes[got];
                            var ext = exts[got];
                            if (!cache.modules[path]) {
                                extensions[ext].get(path,function(res){
                                    cache.modules[path] = res;
                                    result.push(res);
                                    got++; next();
                                },async);
                            } else {
                                result.push(cache.modules[path]);
                                got++; next();
                            }
                        } else {
                            if (result.length==0) result = false;
                            else if (result.length==1) result = result[0];
                            if (async && async.call) async.call(this,result);
                            window.require.base = old;
                        }
                    }
                    next();
                }
            }
            return result;
        }
        r.path = base;
        r.dir = r.path ? r.path.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '') : r.path;
        return r;
    }
    
    if (!window.require) {
        window.require = factory();
        window.require.root = ".";
        window.require.extensions = extensions;
        window.require.factory = factory;
        window.require.cache = cache;
        window.require.getFile = getFile;
    }
})();