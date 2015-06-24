(function(){
    var cache = {
        files: {},
        modules: {},
        defined: {}
    };
    
    function path_string(path) {
        return "'"+path.replace(/\\?("|')/g,'\\$1')+"'";
    }
    
    var extensions = {
        js: {
            pre: function (path,callback,async) {
                if (cache.files[path]) return callback();
                getFile(path,function(text){
                    if (text===false) {
                        throw "Could not load module on path "+path;
                        callback(false);
                        return;
                    }
                    var m,r = /require\(\s*('|")(.*?)('|")\s*\)/g;
                    var deps = {}, count = 0;
                    
                    while (m=r.exec(text)) {
                        if (m[1]==m[3]) {
                            deps[resolve(m[2],path)] = 1;
                            count++;
                        }
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
            },
            wrap: function (path) {
                var js = "";
                js += "(function(path){";
                js += "var require = window.require.factory(path);";
                js += "var module = { exports: false };";
                js += "var exports = {};\n";
                
                js += cache.files[path];
                
                js += "\n"+"return module.exports || exports;";
                js += "})";
                return js;
            },
            get: function (path,callback) {
                var path_s = path_string(path);
                var js = this.wrap(path);
                js += "("+path_s+");//# sourceURL="+path;
                
                var res = eval(js);
                callback(res);
            },
            build: function (path,callback) {
                var path_s = path_string(path);
                var js = 'require.define('+path_s+','+this.wrap(path)+')\n';
                callback({js:js});
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
            },
            build: function (path,callback) {
                var path_s = path_string(path);
                var js = 'require.define('+path_s+',true)\n';
                
                getFile(path,function(text){
                    callback({js:js,css:text});
                },true);
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
    
    function build() {
        var args = Array.prototype.slice.call(arguments);
        var callback = args[args.length-1];
        
        if (callback!==true && (!callback || !callback.call)) {
            args.push(callback=false);
        };
        
        var pathes = [];
        var loaded = 0;
        var result = {
            css: "",
            js: "var require_min = function(f){\n"
        };
        
        args[args.length-1] = function(){
            for (var path in cache.modules) {
                var mod = cache.modules[path];
                var ext = mod.ext;
                if (extensions[ext] && extensions[ext].build) {
                    pathes.push({ext:extensions[ext],path:path});
                }
            }
            
            for (var i=0;i<pathes.length;i++) {
                var one = pathes[i];
                one.ext.build(one.path,function(res){
                    if (res.css) result.css += res.css;
                    if (res.js) result.js += res.js;
                    done_cb();
                });
            }
        };
        
        function done_cb() {
            loaded++;
            if (loaded>=pathes.length && callback) {
                var out_path = [];
                for (var i=0;i<args.length;i++) {
                    var arg = args[i];
                    if (arg!==true && !arg.call) out_path.push(path_string(arg));
                }
                out_path.push('f || function(){}');
                
                result.js += 'require('+out_path.join(", ")+')\n';
                result.js += "}\n";
                setTimeout(function(){ callback(result); },1);
                
            }
        }
        window.require.apply(window.required,args);
    }
    
    function define(path,f) {
        cache.files[path] = "defined";
        cache.defined[path] = f;
        return f;
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
                callback(text);
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
                if (cache.modules[path] || cache.defined[path]) { loaded_cb(); continue; }
                
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
                                
                                function get_cb(res) {
                                    cache.modules[path] = {result:res,ext:ext};
                                    result.push(res);
                                    got++; next();
                                }
                                
                                var defined = cache.defined[path];
                                if (defined) {
                                    get_cb(defined.call ? defined(path) : defined);
                                } else {
                                    extensions[ext].get(path,get_cb,async);
                                }
                            } else {
                                result.push(cache.modules[path].result);
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
        r.define = define;
        return r;
    }
    
    if (!window.require) {
        window.require = factory();
        window.require.root = ".";
        window.require.extensions = extensions;
        window.require.factory = factory;
        window.require.cache = cache;
        window.require.getFile = getFile;
        window.require.build = build;
    }
})();