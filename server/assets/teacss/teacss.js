window.teacss = window.teacss || (function(){
    var teacss = {
        // runtime
        tea: false,
        // files cache (just text)
        files:{},
        // function to export before loading sheet (teacss.function.some_func can be refereced as some_func)
        functions:{},
        // parsed cache
        parsed:{},
        // sheets registered on start
        sheets:{},
        // events
        onError: false
    };

    // Path utils
    teacss.path = {
        isAbsoluteOrData : function(path) {
            return /^(.:\/|data:|http:\/\/|https:\/\/|\/)/.test(path)
        },
        absolute: function (src) {
            var a = document.createElement('a');
            a.href = src;
            return a.href;            
        },
        clean : function (part) {
            part = part.replace(/\\/g,"/");
            part = part.split("/");
            for (var p=0;p<part.length;p++) {
                if (part[p]=='..' && part[p-1]) {
                    part.splice(p-1,2);
                    p = p - 2;
                }
                if (part[p]==".") {
                    part.splice(p,1);
                    p = p - 1;
                }
            }
            return part = part.join("/");
        },
        dir : function (path) {
            var dir = path.replace(/\\/g,"/").split('/');dir.pop();dir = dir.join("/")+'/';
            return dir;
        },
        relative : function (path,from) {
            var pathParts = path.split("/");
            var fromParts = from.split("/");

            var once = false;
            while (pathParts.length && fromParts.length && pathParts[0]==fromParts[0]) {
                pathParts.splice(0,1);
                fromParts.splice(0,1);
                once = true;
            }
            if (!once || fromParts.length>2) return path;
            return new Array(fromParts.length).join("../") + pathParts.join("/");
        }
    }    
    
    // LazyLoad library
    LazyLoad_f=function(k){function p(b,a){var g=k.createElement(b),c;for(c in a)a.hasOwnProperty(c)&&g.setAttribute(c,a[c]);return g}function l(b){var a=m[b],c,f;if(a)c=a.callback,f=a.urls,f.shift(),h=0,f.length||(c&&c.call(a.context,a.obj),m[b]=null,n[b].length&&j(b))}function w(){var b=navigator.userAgent;c={async:k.createElement("script").async===!0};(c.webkit=/AppleWebKit\//.test(b))||(c.ie=/MSIE/.test(b))||(c.opera=/Opera/.test(b))||(c.gecko=/Gecko\//.test(b))||(c.unknown=!0)}function j(b,a,g,f,h){var j=
    function(){l(b)},o=b==="css",q=[],d,i,e,r;c||w();if(a)if(a=typeof a==="string"?[a]:a.concat(),o||c.async||c.gecko||c.opera)n[b].push({urls:a,callback:g,obj:f,context:h});else{d=0;for(i=a.length;d<i;++d)n[b].push({urls:[a[d]],callback:d===i-1?g:null,obj:f,context:h})}if(!m[b]&&(r=m[b]=n[b].shift())){s||(s=k.head||k.getElementsByTagName("head")[0]);a=r.urls;d=0;for(i=a.length;d<i;++d)g=a[d],o?e=c.gecko?p("style"):p("link",{href:g,rel:"stylesheet"}):(e=p("script",{src:g}),e.async=!1),e.className="lazyload",
    e.setAttribute("charset","utf-8"),c.ie&&!o?e.onreadystatechange=function(){if(/loaded|complete/.test(e.readyState))e.onreadystatechange=null,j()}:o&&(c.gecko||c.webkit)?c.webkit?(r.urls[d]=e.href,t()):(e.innerHTML='@import "'+g+'";',u(e)):e.onload=e.onerror=j,q.push(e);d=0;for(i=q.length;d<i;++d)s.appendChild(q[d])}}function u(b){var a;try{a=!!b.sheet.cssRules}catch(c){h+=1;h<200?setTimeout(function(){u(b)},50):a&&l("css");return}l("css")}function t(){var b=m.css,a;if(b){for(a=v.length;--a>=0;)if(v[a].href===
    b.urls[0]){l("css");break}h+=1;b&&(h<200?setTimeout(t,50):l("css"))}}var c,s,m={},h=0,n={css:[],js:[]},v=k.styleSheets;return{css:function(b,a,c,f){j("css",b,a,c,f)},js:function(b,a,c,f){j("js",b,a,c,f)}}};
    
    LazyLoad = LazyLoad_f(this.document);
    teacss.LazyLoad_f = LazyLoad_f;
    
    // github.com/mbostock/queue
    (function(){function a(a){function l(){if(g&&d<a){var b=g,c=b[0],f=Array.prototype.slice.call(b,1),m=b.index;g===h?g=h=null:g=g.next,++d,f.push(function(a,b){--d;if(i)return;a?e&&k(i=a,e=j=g=h=null):(j[m]=b,--e?l():k(null,j))}),c.apply(null,f)}}var c={},d=0,e=0,f=-1,g,h,i=null,j=[],k=b;return arguments.length<1&&(a=Infinity),c.defer=function(){if(!i){var a=arguments;a.index=++f,h?(h.next=a,h=h.next):g=h=a,++e,l()}return c},c.await=function(a){return k=a,e||k(i,j),c},c}function b(){}typeof module=="undefined"?self.queue=a:module.exports=a,a.version="0.0.2"})();    
    teacss.queue = queue;
    
    function trim(text) {
        var rtrim = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;
		return (text || "").replace( rtrim, "" );
	}
    
    teacss.trim = trim;
    
    teacss.functions.tea = teacss.tea = (function (){
        var tea = {
            path: false, 
            dir: false,
            appended: [],
            scope: false
        };
        tea.rule = function() {
            tea.scope.rule.apply(tea.scope,arguments);
        };
        tea.import = function (path) {
            function setPath(path) {
                if (path) {
                    var dir = path.replace(/\\/g,"/").split('/');dir.pop();dir = dir.join("/")+'/';
                    tea.dir = dir;
                    tea.path = path;
                } else {
                    tea.dir = false;
                    tea.path = false;
                }
            }
            var parsed = teacss.parsed[path];
            if (parsed) {
                var old_path = this.path;
                setPath(path);
                
                if (!parsed.func) {
                    // Generate pass - generate js code from syntax tree
                    if (!parsed.js) {
                        var output = "";
    
                        for (var i=0;i<parsed.ast.children.length;i++) 
                            output += parsed.ast.children[i].getJS(teacss.tea.Style);
                
                        output = "(function(){with (teacss.functions){\n" + output;
                        output += "\n}})"+"//# sourceURL="+path;
                        
                        parsed.js = output;
                    }
                    
                    // Compile pass, evaluate js to function
                    try {
                        if (teacss.onError) {
                            try { 
                                throw new Error("lineNumber"); 
                            } catch (e) { 
                                teacss.evalLine = (e.lineNumber || 0) + 6;
                            }
                        }
                        parsed.func = eval(parsed.js);
                    } catch (e) {
                        if (teacss.onError) {
                            teacss.onError({e:e,type:"parse",parsed:parsed,path:path,line:false});
                        } else {
                            console.debug(path);
                            console.debug(e);
                            console.debug(parsed.js);
                            throw e;
                        }
                    }
                }
                if (parsed.func) {
                    if (teacss.onError) {
                        try {
                            parsed.func.call(window);
                        } catch (e) {
                            var line = false;
                            var guess_path = path;
                            if (window.chrome) {
                                var stack = e.stack;
                                var matches = /\(([^:]*)\:([0-9]{1,100})\:[0-9]{1,100}/.exec(stack);
                                
                                guess_path = matches[1];
                                line = parseInt(matches[2]) - 2;
                            } else {
                                line = e.lineNumber - teacss.evalLine;
                            }
                            teacss.onError({e:e,type:"run",parsed:parsed,path:guess_path,line:line});
                        }
                    } else {
                        parsed.func.call(window);
                    }
                }
                setPath(old_path);
            }
        };        
        return tea;
    })();    
    
    teacss.Scope = {
        extend: function (extra) {
            var res = {};
            for (var key in this) res[key] = this[key];
            for (var key in extra) res[key] = extra[key];
            return res;
        },
        
        format: "string",
        
        init: function () {
            var old_scope = teacss.tea.scope;
            teacss.tea.scope = this;
            var res = this.run.apply(this,arguments);
            teacss.tea.scope = old_scope;
            return res;
        },
        run: function () {
            this.rule.apply(this,arguments);
        },
        getJS: function (ast) {
            var output = "";
            // test for mixin
            var match;
            if (match = /^\.([-0-9A-Za-z_\.]+)(<[-0-9A-Za-z_]+>)*(\([\s\S]*\))\s*$/m.exec(ast.selector)) {
                if (ast.is_block) {
                    output += match[1] + " = function "+match[3]+" {";
                    for (var i=0;i<ast.children.length;i++)
                        output += ast.children[i].getJS(this);
                    if (match[2]) {
                        if (!this.aliases) this.aliases = {};
                        this.aliases[match[2].substring(1,match[2].length-1)] = match[1];
                    }
                    output += "}";
                } else {
                    var args;
                    if (/^\(\s*\)$/.test(match[3])) 
                        args = "(this)";
                    else
                        args = "(this, "+ match[3].substring(1);
                    output += match[1] + ".call"+args+";";
                }
                return output;
            }
            
            if (/^@append\s/.test(ast.selector)) {
                output = "tea.scope.append("+ast.selector.replace(/^@append\s*/,'')+");";
                return output;
            }
            
            function string_format(s) { return '"'+s.replace(/(["\\])/g,'\\$1').replace(/\r?\n(\s*)/g,'\\n"+\n$1"')+'"'; }

            var selector_string = "";
            var modifiers = "";
            if (this.format=="string") {
                for (var t=0;t<ast.selector_tokens.length;t++) {
                    var token = ast.selector_tokens[t];
                    if (t!=0) selector_string += "+";
                    switch (token.name) {
                        case "js_inline": selector_string += '('+token.data.slice(1)+')'; break;
                        case "js_inline_block": selector_string += '('+token.data.slice(2,-1)+')'; break;
                        case "rule": 
                            var data = token.data;
                            if (t==0 && token.data[0]=="!") { data = token.data.substring(1); modifiers = "!"; }
                            if (t==ast.selector_tokens.length-1) data = data.replace(/\s+$/,'');
                            selector_string += string_format(data); 
                            break;
                    }
                }
            } else {
                if (!ast.is_block && ast.selector_key) {
                    selector_string = string_format(ast.selector_key)+","+ast.selector_value;
                } else {
                    selector_string = string_format(ast.selector.replace(/\s+$/,''));
                }
            }
            
            var keyword = (ast.scope && teacss.tea[ast.scope]) ? ast.scope + ".init" : "rule";
            if (ast.is_block) {
                output += "tea."+keyword+"(";
                
                if (ast.value_scope && teacss.tea[ast.value_scope]) {
                    var val = teacss.tea[ast.value_scope].getJS(ast.value_node);
                    if (val[val.length-1]==";") val = val.substring(0,val.length-1);
                    output += string_format(ast.selector_key)+","+val;
                    output += ");";
                } else {
                    output += selector_string+",function(){";
                    for (var i=0;i<ast.children.length;i++)
                        output += ast.children[i].getJS(this);
                    output += "});";    
                }
            } else {
                output += "tea."+keyword+"("+selector_string+",'"+modifiers+"');"
            }
            return output;
        }
    }
    
    teacss.tea.Script = teacss.Scope.extend({
        // parser
        getJS: function (ast) {
            function string_format(s) { return '"'+s.replace(/(["\\])/g,'\\$1').replace(/\r?\n(\s*)/g,'\\n"+\n"$1')+'"'; }
            function flatten(ast,list) {
                function push(what) {
                    if (
                        list.last_name!="js_inline" && list.last_name!="js_inline_block" && list.length
                        && what.name!="js_inline" && what.name!="js_inline_block"
                    ) {
                        list[list.length-1].data += what.data;
                    } else {
                        list.push(what);
                    }
                    list.last_name = what.name;
                }

                if (list.length!=0) {
                    if (ast.name=='rule') {
                        for (var t=0;t<ast.selector_tokens.length;t++)
                            push(ast.selector_tokens[t]);
                    } else {
                        push(ast);
                    }
                }
                if (ast.is_block) list.push({data:"{"});
                for (var i=0;i<ast.children.length;i++) {
                    flatten(ast.children[i],list);
                }
                if (ast.is_block) push({data:"}"});
            }
            
            var output = "";
            output += "tea.Script.init('"+trim(ast.selector.replace(/^Script\s*/,''))+"',function(){";
            for (var i=0;i<ast.children.length;i++) {
                var child = ast.children[i];
                if (child.name=="rule") {
                    if (child.is_block) {
                        var chunks = [];
                        flatten(child,chunks);
                        
                        var string_list = [];
                        for (var j=0;j<chunks.length;j++) {
                            var chunk = chunks[j];
                            switch (chunk.name) {
                                case "js_inline": string_list.push('('+chunk.data.slice(1)+')');break;
                                case "js_inline_block": string_list.push('('+chunk.data.slice(2,-1)+')');break;
                                default:
                                    string_list.push(string_format(chunk.data));
                                    break;
                            }
                        }
                        
                        var s = string_list.join('+');
                        output += "tea.Script.append("+s+",true);";
                    } else {
                        output += "tea.Script.append("+child.selector.replace(/^@append\s*/,'')+");";
                    }
                } else {
                    output += child.getJS();
                }
            }
            output += "});";
            return output;            
        },
        // events
        start: function () {
            this.files = {};
        },
        finish: function () {},
        // runtime
        init: function (name,f) {
            var old_list = this.list;
            if (!this.list || name!='') {
                name = (name=='') ? 'default':name;
                this.list = this.files[name] = this.files[name] || [];
            }
            f.call(this);
            this.list = old_list;
        },
        append: function (what,isCode) {
            if (!isCode) {
                what = teacss.getFullPath(what,teacss.tea.path);
            }
            this.list.push({what:what,isCode:isCode});
        },
        get: function (names,callback) {
            var q = new queue(10);
            if (!callback) {
                callback = names;
                names = false;
            }
            
            if (!names) {
                names = [];
                for (var key in this.files) names.push(key);
            }
            if (names.constructor!=Array) names = [names];
            
            var list = [];
            for (var n=0;n<names.length;n++) {
                var key = names[n];
                if (!this.files[key]) continue;
                for (var i=0;i<this.files[key].length;i++)
                    list.push( this.files[key][i] );
            }
            
            var set = {};
            var unique = [];
            for (var i=0;i<list.length;i++) {
                if (!list[i].isCode) {
                    var path = teacss.path.absolute(list[i].what);
                    if (set[path]) continue;
                    set[path] = true;
                }
                unique.push(list[i]);
            }
            list = unique;
            
            for (var i=0;i<list.length;i++) {
                var what = list[i].what;
                if (list[i].isCode) {
                    list[i] = what;
                } else {
                    var path = what;
                    q.defer(function(i,list,path,done){
                        teacss.getFile(path,function(data){
                            list[i] = data;
                            done();
                        });
                    },i,list,path);
                }
            }
            q.await(function(){
                callback(list.join(';\n'));
            });
        },
        insert: function (document,names,callback) {

            if (names && names.call && names.apply) {
                callback = names;
                names = undefined;
            }
            
            var id = "script_"+(teacss.tea.processed).replace(/[^A-Za-z0-9]/g,'_');
            var node = document.getElementById(id);
            if (node) return;
            
            var loader = LazyLoad_f(document);
            var q = new queue(1);
            
            var head;
            var doc = document;
            head || (head = doc.head || doc.getElementsByTagName('head')[0]);
            
            if (!names) {
                names = [];
                for (var key in this.files) names.push(key);
            }
            if (names.constructor!=Array) names = [names];
            var list = [];
            var set = {};
            for (var n=0;n<names.length;n++) {
                var key = names[n];
                if (!this.files[key]) continue;
                for (var i=0;i<this.files[key].length;i++) {
                    var what = this.files[key][i];
                    if (what.isCode) {
                        list.push(what);
                    } else {
                        var path = teacss.path.absolute(what.what);
                        if (!set[path]) {
                            set[path] = true;
                            if (list.length==0 || list[list.length-1].isCode) list.push([]);
                            list[list.length-1].push(what.what);
                        }
                    }
                }
            }
            
            node = document.createElement("script");
            node.id = id;
            head.appendChild(node);
            
            for (var i=0;i<list.length;i++) {
                var what = list[i];
                if (what.isCode) {
                    q.defer(function (what,done){
                        var code = what;
                        script = document.createElement("script");
                        script.innerHTML = code;
                        head.appendChild(script);
                        done();
                    },what.what);
                } else {
                    q.defer(function(what,done){
                        loader.js(what,done);
                    },what);
                }
            }
            
            if (callback) q.await(callback);
        }
    });
    
    teacss.tea.Style = teacss.Scope.extend({
        // events
        start: function () {
            this.rules = [];
            this.indent = "";
            this.appends = [];
        },
        finish: function () {},
        // runtime
        Rule : function(parent,selector) {
            this.code = [];
            this.parent = parent;
            this.selector = selector;
            this.indent = teacss.tea.Style.indent;
            this.print = function(s) { this.code.push(s); }
            this.getSelector = function() {
                this.fullSelector = this.selector;
                if (this.parent && this.parent.selector) {
                    var parent_full = this.parent.getSelector();
                    var parent_items = parent_full.split(",");
                    var parts = [];
                    for (var j=0;j<parent_items.length;j++) {
                        var parent_sel = trim(parent_items[j]);
                        var items = this.selector.split(",");
                        for (var i=0;i<items.length;i++) {
                            var sel = trim(items[i]);
                            if (sel.indexOf("&")!=-1)
                                sel = sel.replace(/&/g,parent_sel);
                            else
                                sel = parent_sel + " " + sel;
                            parts.push(sel);
                        }
                    }
                    this.fullSelector = parts.join(", ");
                }
                return this.fullSelector;
            }
            this.getOutput = function () {
                if (!this.code.length) return "";
                var output = "";
                var selector = this.getSelector();
                if (selector) output += this.indent+selector + " {\n";
                for (var i=0;i<this.code.length;i++)
                    output += this.indent+"    "+this.code[i]+";\n";
                if (selector) output += this.indent+"}\n";
                return output;
            }
            teacss.tea.Style.rules.push(this);
        },
        rule: function (key,val) {
            if (val && val.constructor && val.call && val.apply) {
                if (key && key[0]=='@') return this.namespace(key,val);
                this.current = new this.Rule(this.current,key);
                val.call(this.current);
                this.current = this.current.parent;            
            } else {
                var s = key;
                var modifiers = val;
                if (key.substring(0,7)=="@append") return this.append(s);
                
                var idx;
                if ((idx=s.indexOf(":"))!=-1) {
                    var subkey = trim(s.substring(0,idx));
                    if (this.aliases && idx && this.aliases[subkey] && modifiers!="!") {
                        window[this.aliases[subkey]](trim(s.substring(idx+1)));
                        return;
                    }
                }
                if (this.current)
                    this.current.print(s);
                else
                    this.rules.push({indent:this.indent,getOutput:function(){return this.indent+s+";\n";}});
            }
        },
        namespace: function (selector,func) {
            this.indent = "    ";
            var old_current = this.current;
            this.current = false;
            this.rules.push({getOutput:function(){return selector+' {\n'}});
            func.call(this.current);
            this.rules.push({getOutput:function(){return '}\n'}});
            this.indent = "";
            this.current = old_current;
        },
        append: function (path) {
            path = path.replace(/^@append\s*/,'');
            if (path[0]=='"' || path[0]=="'") path = path.substring(1,path.length-1);
            
            var ext = path.split(".").pop();
            if (ext=="js") {
                teacss.tea.Script.init('',function(){
                    teacss.tea.Script.append(path);
                });
            } else {
                this.appends.push(teacss.getFullPath(path,teacss.tea.path));
            }
        },
        get: function (callback,filter) {
            var output = "";
            for (var i=0;i<this.rules.length;i++) output += this.rules[i].getOutput();
            
            var appended = [];
            var q = queue(10);
            for (var i=0;i<this.appends.length;i++) {
                q.defer(function(i,path,done){
                    teacss.getFile(path,function(text){
                        if (filter) text = filter(text,path);
                        appended[i] = text;
                        done();
                    });
                },i,this.appends[i]);
            }
            q.await(function(){
                callback(appended.join("\n")+output);
            });
        },
        insert: function (document) {
            var css = "";
            for (var i=0;i<this.rules.length;i++) css += this.rules[i].getOutput();
            
            var id = "style_"+teacss.tea.processed.replace(/[^A-Za-z0-9]/g,'_');
            var node = document.getElementById(id);
            if (!node) {
                var head = document.getElementsByTagName("head")[0];
                for (var i=0;i<this.appends.length;i++) {
                    var append = document.createElement("link");
                    append.type = "text/css";
                    append.rel = "stylesheet";
                    append.href = this.appends[i];
                    head.appendChild(append);
                }
                
                node = document.createElement("style");
                node.type = "text/css";
                node.id = id;
                head.appendChild(node);
            }
            var rules = document.createTextNode(css);
            if (node.styleSheet) {
                node.styleSheet.cssText = rules.nodeValue;
            } else {
                node.innerHTML = "";
                node.appendChild(rules);
            }
        }
    })
        
    teacss.getFullPath = function(path,base) {
        base = (base===undefined) ? location.href:base;
        if (!(path[0]=='/' ||
            path.indexOf("http://")==0 ||
            path.indexOf("https://")==0))
        {
            var last = base.lastIndexOf("/");
            base = (last==-1) ? "" : base.substring(0,last)+"/";
            path = base+path;
        }
        if (path.indexOf(".js")==-1 && path.indexOf(".tea")==-1 && path.indexOf(".css")==-1) path += ".tea";
        return path;
    }    
        
    teacss.getFile = function(path,callback,remote) {
        if (teacss.files[path]) {
            callback(teacss.files[path]);
            return;
        }
        var xhr = (window.ActiveXObject) ? new ActiveXObject("Microsoft.XMLHTTP") : (XMLHttpRequest && new XMLHttpRequest()) || null;
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                var text = teacss.files[path] = xhr.status==200 ? xhr.responseText:false;
                try {
                    if (text!==false || remote) {
                        callback(text);
                    } else {
                        var _url = location.href;
                        _url += (_url.split('?')[1] ? '&':'?') + "remote="+encodeURIComponent(path)
                        teacss.getFile(_url,function(text){
                            callback(text);
                        },true);
                    }
                } catch (e) {
                    setTimeout(function(){ throw e; },1);
                }
            }
        }
        xhr.open('GET', path, true);
        xhr.send();
    }
    
    teacss.parseFile = function(path,callback) {
        if (teacss.parsed[path]) {
            if (callback) callback(teacss.parsed[path]);
            return;
        }
        teacss.getFile(path,function(text){
            if (text) {
                var parsed = teacss.parse(text,path);
                if (parsed.errors.length) {
                    console.debug(path);
                    console.debug(parsed.js);
                    throw parsed.errors[0].message;
                }
            } else {
                var parsed = false;
            }
            teacss.parsed[path] = parsed;
            if (callback) callback(parsed);
        });
    }
        
    teacss.process = function (path,callback,document) {
        if (path[0]=="/") path = location.protocol + "//" +location.host+path;
        
        function processParsed(parsed,callback) {
            if (!parsed) 
                callback();
            else {
                if (parsed.imports.length==0) callback();
                var loaded = 0;
                var loaded_cb = function () {
                    loaded++;
                    if (loaded==parsed.imports.length) callback();
                }
                for (var i=0;i<parsed.imports.length;i++) {
                    processFile(parsed.imports[i],loaded_cb);
                }     
            }
        }
        
        function processFile(path,callback) {
            teacss.parseFile(path,function(parsed){
                processParsed(parsed,callback);
            });
        }
        
        function wrap() {
            for (var key in teacss.tea) {
                if (teacss.tea[key] && teacss.tea[key].start) teacss.tea[key].start();
            }
            teacss.tea.processed = path;
            teacss.tea.scope = teacss.tea.Style;
            teacss.tea.document = document;
            teacss.tea.import(path);
            
            for (var key in teacss.tea) {
                if (teacss.tea[key] && teacss.tea[key].finish) teacss.tea[key].finish();
            }
            callback();
        }        
        
        processFile(path,wrap);
    }
        
    teacss.getSheets = function () {
        var sheets = [];
        if (typeof document=='undefined') return [];
        var links_css = document.getElementsByTagName('link');
        var links_js = document.getElementsByTagName('script');
        var links = [];
        for (var i = 0; i < links_css.length; i++) links.push(links_css[i]);
        for (var i = 0; i < links_js.length; i++)  links.push(links_js[i]);
        for (var i = 0; i < links.length; i++) {
            var tea = links[i].getAttribute('tea');
            if (tea) {
                sheets.push({src:teacss.path.absolute(tea)});
            }
        }
        return sheets;
    }
    
    teacss.update = function() {
        if (teacss.updating) {
            teacss.refresh = true;
            return;
        }
        
        teacss.updating = true;
        teacss.refresh = false;
        
        teacss.sheets = teacss.getSheets();
        
        var q = queue(1);
        for (var i=0;i<teacss.sheets.length;i++) {
            var sheet = teacss.sheets[i];
            q.defer(function(sheet,done){
                teacss.process(
                    sheet.src || location.href,
                    function(){
                        teacss.tea.Style.insert(document);
                        teacss.tea.Script.insert(document);
                        done(); 
                    },
                    document
                );
            },sheet);
        }
        q.await(function(){
            if (teacss.onUpdate) teacss.onUpdate();
            teacss.updating = false;
            if (teacss.refresh) teacss.update();
        });
    }
        
    teacss.StringStream = (function(){
        function StringStream(string, tabSize) {
            this.pos = this.start = 0;
            this.string = string;
        }
        StringStream.prototype = {
            eol: function() {return this.pos >= this.string.length;},
            peek: function() {return this.string.charAt(this.pos);},
            next: function() {
                if (this.pos < this.string.length)
                return this.string.charAt(this.pos++);
            },
            eat: function(match) {
                var ch = this.string.charAt(this.pos);
                if (typeof match == "string") var ok = ch == match;
                else var ok = ch && (match.test ? match.test(ch) : match(ch));
                if (ok) {++this.pos; return ch;}
            },
            skipToEnd: function() {this.pos = this.string.length;},
            skipTo: function(ch) {
                var found = this.string.indexOf(ch, this.pos);
                if (found > -1) {this.pos = found; return true;}
            },
            skipToMultiple: function(list) {
                var found = -1;
                for (var i=0;i<list.length;i++) {
                    var res = this.string.indexOf(list[i], this.pos);
                    if (res > -1 && (res < found || found==-1)) found = res;
                }
                if (found > -1) {this.pos = found; return true;}
            },
            backUp: function(n) {this.pos -= n;},
            match: function(pattern, consume, caseInsensitive) {
                if (typeof pattern == "string") {
                    function cased(str) {return caseInsensitive ? str.toLowerCase() : str;}
                    if (cased(this.string).indexOf(cased(pattern), this.pos) == this.pos) {
                        if (consume !== false) this.pos += pattern.length;
                        return true;
                    }
                }
                else {
                    var match = this.string.slice(this.pos).match(pattern);
                    if (match && consume !== false) this.pos += match[0].length;
                    return match;
                }
            },
            current: function(){return this.string.slice(this.start, this.pos);}
        };
        return StringStream;
    })();
    
    teacss.LexerStack = (function(){
        function LexerStack() {
            this.states = [];
            this.data = this.state = false;
        }
        LexerStack.prototype = {
            push: function (state,data) {
                data = data || {};
                this.states.push({state:this.state=state,data:this.data=data});
            },
            pop: function () {
                if (this.states.length<=1) return false;
                this.states.pop();
                this.data  = this.states[this.states.length-1].data; 
                this.state = this.states[this.states.length-1].state;
                return true;
            }
        }
        return LexerStack;
    })();
    
    teacss.token = function (stream,stack) {
        switch (stack.state) {
            case "scope":
                if (stream.match("}")) { 
                    if (!stack.pop()) return "pop_error"; 
                    return 'scope_end'; 
                }
                if (stream.match(/^[ \t\n\r]+/)) return "blank";
                if (stream.match(";")) return "nop";
                if (stream.match("@ ")) { stack.push("js_line"); return 'js_line'; }
                if (stream.match("@{")) { stack.push("js_block"); return 'js_block_start'; }
                if (stream.match("@import")) { stack.push("import"); return 'import_start'; }
                if (stream.match("/*",false)) { stack.push('comment'); return 'comment'; }
                if (stream.match("//",false)) { stack.push('comment_line'); return 'comment_line'; }
                if (stream.match("@")) return "rule";
                stack.push('rule');
                return null;
    
            case "js_line":
                if (stream.peek()=="\n") { stream.next(); stack.pop(); return "blank"; }
                if (!stream.skipTo("\n")) stream.skipToEnd();
                return "js_line";
            case "js_block":
                if (stream.match("'")) { stack.push('string_single',{token:"js_code"}); return "js_code"; }
                if (stream.match('"')) { stack.push('string_double',{token:"js_code"}); return "js_code"; }
                if (stream.match("//")) { stack.push("comment_line",{token:"js_code"}); return "js_code"; }
                if (stream.match("/*")) { stack.push("comment",{token:"js_code"}); return "js_code"; }
                if (stream.match("@{")) { stack.push("scope"); return "scope_start_js"; }
    
                if (stack.data.braces===undefined) stack.data.braces = 1;
                if (stream.peek()=="{") stack.data.braces++;
                if (stream.peek()=="}") stack.data.braces--;
                stream.next();
                
                if (stack.data.braces==0) { 
                    if (!stack.pop()) return "pop_error"; 
                    return "js_block_end"; 
                }
                return "js_code";

            case "import":
                var state = stack.state;
                if (!stream.skipToMultiple([';','{','}','\n'])) stream.skipToEnd();
                stack.pop();
                return state;
    
            case "comment":
                var token = stack.data.token || "comment";
                if (stream.skipTo("*/")) {
                    stream.pos += 2; stack.pop();
                } else
                    stream.skipToEnd();
                return token;
            case "comment_line":
                var token = stack.data.token || "comment_line";
                if (stream.skipTo("\n")) stream.next(); else stream.skipToEnd();
                stack.pop();
                return token;
                
            case "rule":
                if (stream.match("@{")) { stack.push("js_inline_block"); return "js_inline_block"; }
                if (stream.match("@")) { stack.push("js_inline"); return "js_inline"; }
                
                if (stack.data.string_single) {
                    if (stream.peek()=="'" && stream.string[stream.pos-1]!='\\') stack.data.string_single = false;
                }
                else if (stack.data.string_double) {
                    if (stream.peek()=='"' && stream.string[stream.pos-1]!='\\') stack.data.string_double = false;
                }
                else {
                    if (stack.data.braces===undefined) stack.data.braces = 0;
                    
                    if (stream.peek()=="(") { stack.data.braces++; }
                    else if (stream.peek()==")") { stack.data.braces--; }
                    else if (stream.peek()=="'") { stack.data.string_single = true; }
                    else if (stream.peek()=='"') { stack.data.string_double = true; }
                    if (stack.data.braces==0) 
                    {
                        if (stream.peek()==';' || stream.peek()=='}') { stack.pop(); return null; }
                        else if (stream.peek()=='{') { stream.next(); stack.pop(); stack.push('scope'); return "scope_start"; }
                    }
                }
                stream.next();
                return "rule";
                
            case "js_inline":
                if (stack.data.braces===undefined) stack.data.braces = 0;
                if (stream.peek()=="(") stack.data.braces++;
                if (stream.peek()==")") {
                    stack.data.braces--;
                    if (stack.data.braces<0) { stack.pop(); return null; }
                }
                
                if (!stack.data.braces && !/[0-9a-zA-Z_$\.\[\]\(\)]/.test(stream.peek())) 
                    stack.pop();
                else
                    stream.next();
                return "js_inline";
                
            case "js_inline_block":
                if (stream.match("'")) { stack.push('string_single',{token:"js_inline_block"}); return "js_inline_block"; }
                if (stream.match('"')) { stack.push('string_double',{token:"js_inline_block"}); return "js_inline_block"; }
    
                if (stack.data.braces===undefined) stack.data.braces = 1;
                if (stream.peek()=="{") stack.data.braces++;
                if (stream.peek()=="}") stack.data.braces--;
                stream.next();
                
                if (stack.data.braces==0) stack.pop(); 
                return "js_inline_block";
        
            case "string_single":
                var token = stack.data.token || "string_double";
                if (stream.peek()=="'" && stream.string[stream.pos-1]!="\\") stack.pop();
                stream.next();
                return token;
            
            case "string_double":
                var token = stack.data.token || "string_double";
                if (stream.peek()=='"' && stream.string[stream.pos-1]!="\\") stack.pop();
                stream.next();
                return token;
        }
    }
        
    teacss.Metadata = (function(){
        function Metadata(name,parent,selector,start,end) {
            this.selector = selector;
            this.start = start;
            this.end = end;
            this.parent = parent;
            this.children = [];
            if (parent) parent.children.push(this);
        }
        return Metadata;
    })();
    
    teacss.SyntaxNode = (function(){
        function SyntaxNode(name,data) {
            this.children = [];
            this.name = name;
            this.data = data;
        }
        SyntaxNode.prototype = {
            push: function (name,data,start) {
                var ast = new SyntaxNode(name,data);
                this.children.push(ast);
                ast.parent = this;
                ast.start = start;
                ast.end = start + (data ? data.length : 0);
                return ast;
            },
            flatten: function () {
                var output = this.data;
                if (this.is_block) output += "{";
                for (var i=0;i<this.children.length;i++) {
                    output += this.children[i].flatten();
                }
                if (this.is_block) output += "}";
                return output;
            },
            getJS: function (scope) {
                var ast = this;
                var output = "";
                switch (ast.name) {
                    case "js_line":
                        output += ast.data.substring(2);
                        break;
                        
                    case "blank":
                    case "comment":
                    case "comment_line": 
                    case "js_code":
                        output += ast.data; 
                        break;
                        
                    case "import":
                        output += "/* " + ast.data + " */";
                        output += ' tea.import("'+ast.fullPath+'");';
                        break;
                        
                    case "js_block":
                    case "rule_js":
                        output += "{";
                        for (var i=0;i<ast.children.length;i++) output += ast.children[i].getJS(scope);
                        output += "}";
                        break;
                        
                    case "rule":
                        if (ast.scope && teacss.tea[ast.scope]) scope = teacss.tea[ast.scope];
                        output += scope.getJS(ast);
                        break;
                }
                return output;
            }
        }
        return SyntaxNode;
    })();
        
    teacss.parse = function (code,path) {
        var stream = new teacss.StringStream(code);
        var stack = new teacss.LexerStack();
        
        var ext = path.split(".").pop();
        
        if (ext=="js") {
            var output = "";
            output = "(function(){with (teacss.functions){\n" + code;
            output += "\n}})"+"//# sourceURL="+path;
            
            return {
                js: output,
                errors: [],
                imports: [],
                ast: false
            }            
        }        
        
        // Lexer pass, we just convert code to plain token array
        // token - string with type, e.g. {type:"rule",data:"foo"}
        var tokens = [];
        stack.push("scope");
        
        while (!stream.eol()) {
            var name = teacss.token(stream,stack);
            var current = stream.current();
            if (current) {
                if (tokens.length && name==tokens[tokens.length-1].name) {
                    tokens[tokens.length-1].data += current;
                } else {
                    tokens.push({name:name,data:current});
                }
                stream.start = stream.pos;
            }
        }
        
        // Syntax pass, convert token array to AST (Abstract Syntax Tree)
        var root_ast = new teacss.SyntaxNode("rule");
        var ast = root_ast;
        var pos = 0;

        for (var t=0;t<tokens.length;t++) {
            var token = tokens[t];
            switch (token.name) {
                // AS IS tokens, one token - one ast node with the same name
                case "nop":
                case "js_line":
                case "blank":
                case "comment":
                case "comment_line": ast.push(token.name,token.data,pos); break;

                // import tokens, calculate full path for later inclusion
                case "import":
                    var s = trim(token.data), sub;
                    if (s[0]=='"' && s.indexOf('"',1)!=-1)
                        sub = s.slice(1,s.indexOf('"')-1);
                    else if (s[0]=="'" && s.indexOf("'",1)!=-1)
                        sub = s.slice(1,s.indexOf("'")-1);
                    else
                        sub = s.split(" ")[0];
                    sub = teacss.getFullPath(sub,path);
                    ast.push(token.name,"@import"+token.data).fullPath = sub;
                    break;         
                    
                // new rule node with empty selector
                case "scope_start":
                    ast = ast.push("rule");
                    ast.selector = "";
                    ast.selector_tokens = [];
                    ast.start = pos;
                    ast.is_block = true;
                    ast.scope = "";
                    break;
                    
                // we start a new rule node, probably with children if it's a block rule
                case "rule":
                case "js_inline":
                case "js_inline_block":
                    ast = ast.push("rule");
                    // gather all the tokens that define rule selector
                    ast.selector = token.data;
                    ast.selector_tokens = [token];
                    ast.start = pos;
                    while (tokens[t+1] &&
                       (tokens[t+1].name=="rule" || 
                        tokens[t+1].name=="js_inline" || 
                        tokens[t+1].name=="js_inline_block")) 
                    { 
                        t++;
                        ast.selector_tokens.push(tokens[t]);
                        ast.selector += tokens[t].data;
                        pos += tokens[t].data.length;
                    }
                    ast.data = ast.selector;
                    var is_block = ast.is_block = (tokens[t+1] && tokens[t+1].name=="scope_start");
                    if (ast.is_block) { t++; pos += tokens[t].data.length; }
                    
                    // selector switches to a new scope
                    var scope = ast.selector.split(" ",1)[0];
                    ast.scope = scope;
                    
                    // it's a key-value selector
                    if (token.name=="rule" && token.data.indexOf(":")!=-1) {
                        ast.selector_key = token.data.split(":",1)[0];
                        ast.selector_value = ast.selector.substring(ast.selector_key.length+1);
                        
                        // check if value part switches to a new scope
                        var scope = ast.selector_value.replace(/^\s*/,"").split(" ",1)[0];
                        if (is_block) {
                            ast.value_scope = scope;
                            var value_tokens = [{name:"rule",data:token.data.substring(ast.selector_key.length+1)}];
                            for (var i=1;i<ast.selector_tokens.length;i++) value_tokens.push(ast.selector_tokens[i]);
                            ast.value_node = {
                                name:"rule",
                                scope:ast.value_scope,
                                selector: ast.selector_value.replace(/^\s+/,''),
                                selector_tokens: value_tokens,
                                children:ast.children,
                                is_block: true,
                                start: ast.start + ast.selector_value.length + 1
                            };
                        }
                    }
                    
                    if (!is_block) { ast.end = ast.start+ast.selector.length; ast = ast.parent; }
                    break;
                
                // we treat in js scopes as special type of rule
                case "scope_start_js": ast = ast.push("rule_js"); break;
                    
                // scope_end closes rule nodes and rule_js nodes
                case "scope_end": 
                    ast.end = pos + token.data.length;
                    if (ast.value_node) ast.value_node.end = ast.end;
                    ast = ast.parent; break;
                
                // js block syntax
                case "js_block_start": 
                    ast = ast.push("js_block"); 
                    ast.is_block = true;
                    ast.data = "@";
                    break;
                case "js_code": ast.push(token.name,token.data); break;
                case "js_block_end": ast = ast.parent; break;                    
            }
            pos += token.data.length;
        }


        // Extract @import tags
        var imports = [];
        function get_imports(ast) {
            if (ast.name=="import") imports.push(ast.fullPath);
            for (var i=0;i<ast.children.length;i++) get_imports(ast.children[i]);
        }
        get_imports(root_ast);
        
        return {
            js: false,
            errors: [],
            imports: imports,
            ast: root_ast
        }
    }
    return teacss;
})();;
teacss.Color = teacss.Color || function() {
    var Color = function(r,g,b,a) {
        this.rgb = [r || 0,g || 0,b || 0];
        this.alpha = a != null ? a : 1;
    };

    function clamp(val,min,max) {
        min = min==undefined ? 0 : min;
        max = max==undefined ? 1 : max;
        return Math.min(max, Math.max(min, val));
    }
    var lookupColors = {
        aqua:[0,255,255],
        azure:[240,255,255],
        beige:[245,245,220],
        black:[0,0,0],
        blue:[0,0,255],
        brown:[165,42,42],
        cyan:[0,255,255],
        darkblue:[0,0,139],
        darkcyan:[0,139,139],
        darkgrey:[169,169,169],
        darkgreen:[0,100,0],
        darkkhaki:[189,183,107],
        darkmagenta:[139,0,139],
        darkolivegreen:[85,107,47],
        darkorange:[255,140,0],
        darkorchid:[153,50,204],
        darkred:[139,0,0],
        darksalmon:[233,150,122],
        darkviolet:[148,0,211],
        fuchsia:[255,0,255],
        gold:[255,215,0],
        green:[0,128,0],
        grey:[128,128,128],
        indigo:[75,0,130],
        khaki:[240,230,140],
        lightblue:[173,216,230],
        lightcyan:[224,255,255],
        lightgreen:[144,238,144],
        lightgrey:[211,211,211],
        lightpink:[255,182,193],
        lightyellow:[255,255,224],
        lime:[0,255,0],
        magenta:[255,0,255],
        maroon:[128,0,0],
        navy:[0,0,128],
        olive:[128,128,0],
        orange:[255,165,0],
        pink:[255,192,203],
        purple:[128,0,128],
        violet:[128,0,128],
        red:[255,0,0],
        silver:[192,192,192],
        white:[255,255,255],
        yellow:[255,255,0]
    };
    Color.parse = function (str) {
        var res, m = function(r,g,b,a){ return new Color(r,g,b,a); }

        // Look for rgb(num,num,num)
        if (res = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(str))
            return m(parseInt(res[1], 10), parseInt(res[2], 10), parseInt(res[3], 10));

        // Look for rgba(num,num,num,num)
        if (res = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(str))
            return m(parseInt(res[1], 10), parseInt(res[2], 10), parseInt(res[3], 10), parseFloat(res[4]));

        // Look for rgb(num%,num%,num%)
        if (res = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(str))
            return m(parseFloat(res[1])*2.55, parseFloat(res[2])*2.55, parseFloat(res[3])*2.55);

        // Look for rgba(num%,num%,num%,num)
        if (res = /rgba\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(str))
            return m(parseFloat(res[1])*2.55, parseFloat(res[2])*2.55, parseFloat(res[3])*2.55, parseFloat(res[4]));

        // Look for #a0b1c2
        if (res = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(str))
            return m(parseInt(res[1], 16), parseInt(res[2], 16), parseInt(res[3], 16));

        // Look for #fff
        if (res = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(str))
            return m(parseInt(res[1]+res[1], 16), parseInt(res[2]+res[2], 16), parseInt(res[3]+res[3], 16));

        // Otherwise, we're most likely dealing with a named color
        var name = str ? teacss.trim(str.toString()).toLowerCase() : false;
        if (name == "transparent")
            return m(255, 255, 255, 0);
        else {
            // default to black
            res = lookupColors[name] || [0, 0, 0];
            return m(res[0], res[1], res[2]);
        }
    },

    Color.prototype = {
        toString: function () {
            if (this.alpha < 1.0) {
                return "rgba(" + this.rgb.map(function (c) {
                    return Math.round(c);
                }).concat(this.alpha).join(', ') + ")";
            } else {
                return '#' + this.rgb.map(function (i) {
                    i = Math.round(i);
                    i = (i > 255 ? 255 : (i < 0 ? 0 : i)).toString(16);
                    return i.length === 1 ? '0' + i : i;
                }).join('');
            }
        },

        toHSL: function () {
            var r = this.rgb[0] / 255,
                g = this.rgb[1] / 255,
                b = this.rgb[2] / 255,
                a = this.alpha;

            var max = Math.max(r, g, b), min = Math.min(r, g, b);
            var h, s, l = (max + min) / 2, d = max - min;

            if (max === min) {
                h = s = 0;
            } else {
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2;               break;
                    case b: h = (r - g) / d + 4;               break;
                }
                h /= 6;
            }
            return { h: h * 360, s: s*100, l: l*100, a: a };
        },

        toHSV: function () {
            var red = this.rgb[0];
            var grn = this.rgb[1];
            var blu = this.rgb[2];
            var x, val, f, i, hue, sat, val;
            red/=255;
            grn/=255;
            blu/=255;
            x = Math.min(Math.min(red, grn), blu);
            val = Math.max(Math.max(red, grn), blu);
            if (x==val){
                return({h:0, s:0, v:val*100});
            }
            f = (red == x) ? grn-blu : ((grn == x) ? blu-red : red-grn);
            i = (red == x) ? 3 : ((grn == x) ? 5 : 1);
            hue = Math.floor((i-f/(val-x))*60)%360;
            sat = Math.floor(((val-x)/val)*100);
            val = Math.floor(val*100);
            return({h:hue, s:sat, v:val});
        },
        toARGB: function () {
            var argb = [Math.round(this.alpha * 255)].concat(this.rgb);
            return '#' + argb.map(function (i) {
                i = Math.round(i);
                i = (i > 255 ? 255 : (i < 0 ? 0 : i)).toString(16);
                return i.length === 1 ? '0' + i : i;
            }).join('');
        },
        add : function (c2) {
            var c1 = this;
            return new teacss.Color(
                clamp(c1.rgb[0]+c2.rgb[0],0,255),
                clamp(c1.rgb[1]+c2.rgb[1],0,255),
                clamp(c1.rgb[2]+c2.rgb[2],0,255),
                c1.alpha
            );
        },
        sub : function (c2) {
            var c1 = this;
            return new teacss.Color(
                clamp(c1.rgb[0]-c2.rgb[0],0,255),
                clamp(c1.rgb[1]-c2.rgb[1],0,255),
                clamp(c1.rgb[2]-c2.rgb[2],0,255),
                c1.alpha
            );
        },
        mul : function (k) {
            var c1 = this;
            return new teacss.Color(
                clamp(c1.rgb[0]*k,0,255),
                clamp(c1.rgb[1]*k,0,255),
                clamp(c1.rgb[2]*k,0,255),
                clamp(c1.alpha)
            );
        }
    }

    Color.functions = {
        add_colors: function (c1) {
            if (!(c1 instanceof teacss.Color)) c1 = teacss.Color.parse(c1);
            var colors = [];
            for (var i=1;i<arguments.length;i++) {
                var c = arguments[i];
                if (!(c instanceof teacss.Color)) c = teacss.Color.parse(c);
                c1 = c1.add(c);
            }
            return c1;
        },
        sub_colors : function (c1,c2) {
            if (!(c1 instanceof teacss.Color)) c1 = teacss.Color.parse(c1);
            var colors = [];
            for (var i=1;i<arguments.length;i++) {
                var c = arguments[i];
                if (!(c instanceof teacss.Color)) c = teacss.Color.parse(c);
                c1 = c1.sub(c);
            }
            return c1;
        },
        mul_colors : function (c1,k) {
            if (!(c1 instanceof teacss.Color)) c1 = teacss.Color.parse(c1);
            return c1.mul(k);
        },
        color: function(color) {
            if (color instanceof teacss.Color) return color;
            return teacss.Color.parse(color);
        },
        rgb: function (r, g, b) {
            return this.rgba(r, g, b, 1.0);
        },
        rgba: function (r, g, b, a) {
            return new teacss.Color(r,g,b,a);
        },
        argb: function (color) {
            if (!(color instanceof teacss.Color)) color = teacss.Color.parse(color);
            return color.toARGB();
        },
        hsl: function (h, s, l) {
            return this.hsla(h,s,l,1);
        },
        hsla: function (h,s,l,a) {
            h = (h % 360) / 360;
            s = s / 100;
            l = l / 100;

            var m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
            var m1 = l * 2 - m2;

            return this.rgba(hue(h + 1/3) * 255,
                             hue(h)       * 255,
                             hue(h - 1/3) * 255,
                             a);

            function hue(h) {
                h = h < 0 ? h + 1 : (h > 1 ? h - 1 : h);
                if      (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
                else if (h * 2 < 1) return m2;
                else if (h * 3 < 2) return m1 + (m2 - m1) * (2/3 - h) * 6;
                else                return m1;
            }
        },
        hue: function (color) {
            return Math.round(color.toHSL().h);
        },
        saturation: function (color) {
            return Math.round(color.toHSL().s);
        },
        lightness: function (color) {
            return Math.round(color.toHSL().l);
        },
        alpha: function (color) {
            return color.toHSL().a;
        },
        saturate: function (color, amount) {
            var hsl = color.toHSL();
            hsl.s = clamp(hsl.s+amount,0,100);
            return this.hsla(hsl.h,hsl.s,hsl.l,hsl.a);
        },
        desaturate: function (color, amount) {
            var hsl = color.toHSL();
            hsl.s = clamp(hsl.s-amount,0,100);
            return this.hsla(hsl.h,hsl.s,hsl.l,hsl.a);
        },
        lighten: function (color, amount) {
            var hsl = color.toHSL();
            hsl.l = clamp(hsl.l+amount,0,100);
            return this.hsla(hsl.h,hsl.s,hsl.l,hsl.a);
        },
        darken: function (color, amount) {
            var hsl = color.toHSL();
            hsl.l = clamp(hsl.l-amount,0,100);
            return this.hsla(hsl.h,hsl.s,hsl.l,hsl.a);
        },
        fadein: function (color, amount) {
            var hsl = color.toHSL();
            hsl.a = clamp(hsl.a+amount/100);
            return this.hsla(hsl.h,hsl.s,hsl.l,hsl.a);
        },
        fadeout: function (color, amount) {
            var hsl = color.toHSL();
            hsl.a = clamp(hsl.a-amount/100);
            return this.hsla(hsl.h,hsl.s,hsl.l,hsl.a);
        },
        spin: function (color, amount) {
            var hsl = color.toHSL();
            var hue = (hsl.h + amount) % 360;
            hsl.h = hue < 0 ? 360 + hue : hue;
            return this.hsla(hsl.h,hsl.s,hsl.l,hsl.a);
        },
        mix: function (color1, color2, weight) {
            if (!(color1 instanceof teacss.Color)) color1 = teacss.Color.parse(color1);
            if (!(color2 instanceof teacss.Color)) color2 = teacss.Color.parse(color2);

            var p = weight / 100.0;
            var w = p * 2 - 1;
            var a = color1.toHSL().a - color2.toHSL().a;

            var w1 = (((w * a == -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
            var w2 = 1 - w1;

            var rgb = [color1.rgb[0] * w1 + color2.rgb[0] * w2,
                       color1.rgb[1] * w1 + color2.rgb[1] * w2,
                       color1.rgb[2] * w1 + color2.rgb[2] * w2];

            var alpha = color1.alpha * p + color2.alpha * (1 - p);
            return new teacss.Color(rgb[0],rgb[1],rgb[2], alpha);
        },
        greyscale: function (color) {
            return this.desaturate(color, 100);
        }
    }
    String.prototype.toHSL = function () { return Color.parse(this).toHSL(); }

    for (var name in Color.functions) {
        teacss.functions[name] = function(func){
            return function () {
                return func.apply(teacss.Color.functions,arguments);
            }
        }(Color.functions[name]);
    }

    return Color;
}();

;
teacss.functions.image_url = function (sub) {
    return "url("+teacss.functions.image.base+sub+")";
}

teacss.image = teacss.functions.image = teacss.image || (function(){
    var cache = {images:{}};
    var deferred = 0;
    var startDeferred = function() {  deferred++; }
    var endDeferred = function (callback) {
        deferred--;
        if (deferred==0) {
            teacss.image.deferredUpdate = true;
            if (callback) callback.apply(); else teacss.image.update();
            teacss.image.deferredUpdate = false;
        }
    }

    var load = function (list,callback) {
        var list = (list && list.constructor==Array) ? list : [list];
        var left = list.length;
        var local_callback = function (url) {
            left--;
            if (left==0) callback(list);
        }
        var ret = [];
        for (var i=0;i<list.length;i++) {
            var url = list[i];

            if (!url) {
                local_callback(url);
                ret.push(false);
                continue;
            }

            var cached = cache.images[url];
            if (cached) {
                if (cached.callbacks) {
                    cached.callbacks.push(local_callback);
                } else {
                    local_callback(url);
                }
            } else {
                var image = new Image();
                var after = function (url,error) {
                    return function () {
                        var callbacks = cache.images[url].callbacks;
                        cache.images[url] = error ? {width:0,height:0} : cache.images[url].image;
                        for (var c=0;c<callbacks.length;c++) callbacks[c](url);
                    }
                };
                image.onload = after(url,false);
                image.onerror = after(url,true);

                cache.images[url] = {image:image,callbacks:[local_callback]};
                image.src = list[i];
            }
            ret.push(cache.images[url]);
        }
        return ret;
    }
        
    var noimage = document.createElement("canvas");
    noimage.width = 1;
    noimage.height = 1;
    noimage.getContext('2d');
        
    var constructor = function (sub) {
        var url = sub;
        var end_deferred = false;
        
        var image = load(url,function(){
            if (end_deferred) endDeferred();
        })[0];
        if (image.callbacks) {
            end_deferred = true;
            startDeferred();
            return noimage;
        } else {
            return image;
        }
    }
    constructor.base = "/";
    constructor.getDeferred = function () { return deferred; };
    constructor.startDeferred = startDeferred;
    constructor.endDeferred = endDeferred;
    constructor.load = load;
    constructor.update = function () { teacss.update(); }

    return constructor;
})();;
teacss.build = (function () {
    var path = teacss.path;
        
    /**
     * Builds tea file into js|css|images object
     */
    var build = function(makefile, options) {
        
        var defaults = {
            scriptPath: "",

            stylePath: "",
            styleName: "default.css",
            
            imagesPath: "",
                    
            templatePath: "",
            templateScriptPath: "",
            templateStylePath: "",
            
            callback: false
        }
            
        for (var key in defaults) if (options[key]==undefined) options[key] = defaults[key];
        
        var files = {};        
        

        var old_canvasBackground = teacss.Canvas.effects.background;
        teacss.Canvas.effects.background = function (part) {
            if (part) {
                if (path.isAbsoluteOrData(part)) {
                    part = path.relative(path.clean(part),outDir);
                }
                files[options.imagesPath+"/"+part] = this.toDataURL();
            } else {
                part = this.toDataURL();
            }
            teacss.tea.Style.rule("background-image:url("+part+");");
        }
        
        teacss.building = true;
        teacss.process(makefile,function(){        
            
            teacss.building = false;
            
            teacss.Canvas.effects.background = old_canvasBackground;
            var q = teacss.queue(10);
            
            // Style
            q.defer(function(done){
                teacss.tea.Style.get(
                    function(css){
                        files[options.stylePath+"/"+options.styleName] = css;
                        done();
                    },
                    function(css,href) {
                        return css.replace(/url\(['"]?([^'"\)]*)['"]?\)/g, function( whole, part ) {
                            var rep = (!path.isAbsoluteOrData(part)) ? path.dir(path.clean(href)) + part : part;
                            return 'url('+rep+')';
                        });
                    }
                );        
            });
            
            // Script
            for (var file in teacss.tea.Script.files) {
                q.defer(function(file,done){
                    teacss.tea.Script.get([file],function(js){
                        files[options.scriptPath+"/"+file+".js"] = js;
                        done();
                    });
                },file);
            }
            
            // Template
            var list = teacss.tea.Template ? teacss.tea.Template.templates : [];
            for (var key in list) {
                var file = options.templatePath+"/"+key+".liquid";
                var text = list[key].text;
                
                text = text.replace(
                    teacss.tea.Template.styleMark,
                    "<link type='text/css' rel='stylesheet' href='{{ '"+options.templateStylePath+"/default.css' | url }}'>"
                );
                text = text.replace(
                    new RegExp(teacss.tea.Template.scriptMark.replace("name","(.*?)"),"g"),
                    "<script src='{{ '"+options.templateScriptPath+"/$1.js' | url }}'></script>"
                );
                files[file] = text;
            }        
            
            if (options.callback) q.await(function(){
                options.callback(files);
            });
        });
        return;
    }
        
    build.run = function (s) {
        var url = teacss.sheets[s].src;
        teacss.build(url,{callback:teacss.buildCallback});
    }
        
    var bodyLoaded = function () {
        var body = document.getElementsByTagName('body')[0];
        if (!body) return setTimeout(bodyLoaded,100);
        if (!teacss.buildCallback) return;
        
        var div = document.createElement('div');
        div.id = "teacss-build-panel";
        div.style.position = 'fixed';
        div.style.right = '3px';
        div.style.top = '3px';
        div.style.zIndex = 100000;
        
        body.appendChild(div);
        
        var html = "";
        html += '<div style="border:1px solid #555;padding:5px;margin:0;background:#333;color:#fff;">';
        for (var s=0;s<teacss.sheets.length;s++) {
            html += 'Build <a style="cursor:pointer;color:#ffa;padding:0;margin:0;background:transparent;border:none;" onclick="teacss.build.run('+s+')"><pre style="display:inline;padding:0;margin:0;background:transparent;border:none;">' 
                + teacss.sheets[s].src + '</pre></a><br>'
        }
        html += '</div>';
        
        div.innerHTML = html;        
    }
    bodyLoaded();        
        
        
    return build;
})();;
// TODO: review canVG for future use
teacss.Canvas = teacss.functions.Canvas = teacss.Canvas || function() {
    function wrap(name,func) {
        return function() {
            if (this.run || !Canvas.wrap) {
                func.apply(this,arguments);
            } else {
                this.queque.push({
                    name: name,
                    args: arguments,
                    done : false,
                    func : func
                })
            }
            return this;
        }
    }
    var counter = 0;

    var Canvas = function () {
        this.init.apply(this,arguments);
    }

    Canvas.prototype.init = function (w,h,context) {
        this.state = {canvas:false,texture:false,image:false}
        this.counter = counter;
        this.run = false;
        this.queque = [];

        var me = this;
        for (var e in Canvas.effects)
            this[e] = wrap(name,Canvas.effects[e])


        if (typeof(w)=='string') element = h;
        if (!context) {
            if (!Canvas.defaultContext) {
                Canvas.defaultElement = document.createElement('canvas');
                Canvas.defaultContext = Canvas.defaultElement.getContext('experimental-webgl');
            }
            context = Canvas.defaultContext;
        }
        this.gl = context;

        if (typeof(w)=='string') {
            this.fromImage(w)
        } else
            this.fromDimensions(w,h)
    }

    Canvas.prototype.toJSON = function() {
        var data = [];
        for (var i=0;i<this.queque.length;i++) {
            var item = this.queque[i];
            var args = [];
            for (var a=0;a<item.args.length;a++) {
                var arg = item.args[a];
                args.push((arg && arg.toJSON) ? arg.toJSON() : arg);
            }
            data.push({name:item.name,args:args});
        }
        return $.toJSON(data);
    }

    Canvas.wrap = false;
    Canvas.cache = {};
    Canvas.prototype.realize = function() {
        if (this.run || !Canvas.wrap) return;

        var json = this.toJSON();
        var cached = Canvas.cache[json];

        if (cached) {
            for (var i=0;i<this.queque.length;i++) this.queque[i].done = true;
            this.texture = cached.texture;
            this.spareTexture = cached.spareTexture;
            this.canvas2d = cached.canvas2d;
            this.context = cached.context;
            this.width = cached.width;
            this.height = cached.height;
            this.image = cached.image;
            this.state = cached.state;
            this.dataURL = cached.dataURL;
        } else {
            this.run = true;
            for (var i=0;i<this.queque.length;i++) {
                var item = this.queque[i];
                if (!item.done) {
                    for (var a=0;a<item.args.length;a++) {
                        var arg = item.args[a];
                        if (arg instanceof Canvas) arg.realize();
                    }
                    item.func.apply(this,item.args);
                    item.done = true;
                }
            }
            this.run = false;
            if (!teacss.functions.image.getDeferred())
                Canvas.cache[json] = this;
        }
    }

    Canvas.prototype.setState = function(state) {
        for (var i in this.state) this.state[i]=false;
        this.state[state] = true;
    }
    Canvas.prototype.getCanvas2d_wrap = wrap('getCanvas2d',function(){
        if (this.state.canvas) return;
        if (!this.canvas2d) {
            this.canvas2d = document.createElement('canvas');
            this.canvas2d.width = this.width;
            this.canvas2d.height = this.height;
        }
        this.context = this.canvas2d.getContext('2d');
        if (this.state.image) {
            this.context.drawImage(this.image,0,0);
        } else if (this.state.texture) {
            var w = this.width;
            var h = this.height;
            var array = new Uint8Array(w * h * 4);
            var gl = this.gl;
            this.texture.drawTo(function() {
                gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, array);
            });
            var data = this.context.createImageData(w,h);
            for (var i = 0; i < array.length; i++) { data.data[i] = array[i]; }
            this.context.putImageData(data, 0, 0);
        }
        this.state.canvas = true;
    })
    Canvas.prototype.getCanvas2d = function() {
        this.getCanvas2d_wrap();
        this.realize();
        return this.canvas2d;
    }
    Canvas.prototype.getTexture_wrap = wrap('getTexture',function(){
        if (this.state.texture) return;
        if (this.state.image) {
            this.texture = Texture.fromImage(this.gl,this.image);
        } else
            this.texture = Texture.fromImage(this.gl,this.getCanvas2d());
        this.state.texture = true;
    })
    Canvas.prototype.getTexture = function () {
        this.getTexture_wrap();
        this.realize();
        return this.texture;
    }
    Canvas.prototype.toDataURL_wrap = wrap('toDataURL',function(){
        this.dataURL = this.getCanvas2d().toDataURL();
    })
    Canvas.prototype.toDataURL = function() {
        this.toDataURL_wrap();
        this.realize();
        return this.dataURL;
    }
    Canvas.prototype.destroy = function () {
        this.dataURL = null;
        if (this.texture) {
            this.texture.destroy();
            this.texture = null;
        }
        if (this.spareTexture) {
            this.spareTexture.destroy();
            this.spareTexture = null;
        }
        if (this.image) {
            this.image = null;
        }
        if (this.canvas2d) {
            this.canvas2d.width = 0;
            this.canvas2d.height = 0;
            this.canvas2d = null;
        }
    }
    return Canvas;
}();;
teacss.Canvas.effects = teacss.Canvas.effects || function() {
    var Canvas = teacss.Canvas;
    
    effects = {};
    // returns a random number between 0 and 1
    var randomShaderFunc = Canvas.randomShaderFunc = '\
        float random(vec3 scale, float seed) {\
            /* use the fragment position for a different seed per-pixel */\
            return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\
        }\
    ';

    function parseColor(color) {
        color = teacss.jQuery.color.parse(color);
        return [color.r/255,color.g/255,color.b/255,color.a];
    }

    effects.fromDimensions = function(w,h) {
        if (w<1) w = 1;
        if (h<1) h = 1;
        this.width = w;
        this.height = h;
    }
    effects.fromImage = function(url) {
        var me = this;
        this.image = teacss.functions.image(url);
        if (!this.image.width) {
            this.image = document.createElement('canvas');
            this.image.width = 1;
            this.image.height = 1;
        }
        this.width = this.image.width;
        this.height = this.image.height;
        this.setState('image');
    }

    effects.draw2D = function(callback) {
        this.getCanvas2d();
        callback(this.context);
        this.setState('canvas');
    }
    effects.draw3D = function (shader,textures,uniforms) {
        var gl = this.gl;
        this.spareTexture = this.spareTexture || new Texture(this.gl,this.width, this.height, gl.RGBA, gl.UNSIGNED_BYTE)
        var texdata = {},t=0;
        for (var key in textures) {
            texdata[key] = t;
            textures[key].use(t);
            t+=1;
        }
        this.spareTexture.drawTo(function(){
            shader.textures(texdata).uniforms(uniforms).drawRect();
        })
        this.spareTexture.swapWith(this.getTexture());
    }

    effects.multiply = function(other) {
        var gl = this.gl;
        gl.multiplyShader = gl.multiplyShader || new Shader(gl,null, '\
            uniform sampler2D tex0;\
            uniform sampler2D tex1;\
            varying vec2 texCoord;\
            void main() {\
                vec4 c0 = texture2D(tex0, texCoord);\
                vec4 c1 = texture2D(tex1, texCoord);\
                vec4 color;\
                color.r = c0.r * c1.r;\
                color.g = c0.g * c1.g;\
                color.b = c0.b * c1.b;\
                color.a = c0.a;\
                gl_FragColor = color;\
            }\
        ');
        this.draw3D(gl.multiplyShader,{tex0:this.getTexture(),tex1:other.getTexture()},{});
        this.setState('texture');
        return this;
    }

    effects.multiplyColor = function(color) {
        color = teacss.Color.parse(color);
        color = [color.rgb[0]/255,color.rgb[1]/255,color.rgb[2]/255,color.alpha];

        var gl = this.gl;
        gl.multiplyColorShader = gl.multiplyColorShader || new Shader(gl,null,'\
            uniform sampler2D tex0;\
            uniform vec4 c1;\
            varying vec2 texCoord;\
            void main() {\
                vec4 c0 = texture2D(tex0, texCoord);\
                gl_FragColor = c0*c1;\
            }\
        ')
        this.draw3D(gl.multiplyColorShader,{tex0:this.getTexture()},{c1:color});
        this.setState('texture');
        return this;
    }

    effects.copyFill = function (other,offsetX,offsetY) {
        var otherScale = [this.width/other.width,this.height/other.height];
        offsetX = offsetX || 0;
        offsetY = offsetY || 0;

        var thisTexture = this.getTexture();
        var otherTexture = other.getTexture();

        var gl = this.gl;
        gl.copyFillShader = gl.copyFillShader || new Shader(gl,null, '\
            uniform sampler2D texture,other;\
            uniform vec2 otherScale;\
            uniform vec2 otherOffset;\
            varying vec2 texCoord;\
            void main() {\
                vec4 otherColor = texture2D(other, fract(texCoord * otherScale + otherOffset));\
                gl_FragColor = otherColor;\
            }\
        ');
        this.draw3D(gl.copyFillShader,
            {texture:thisTexture,other:otherTexture},
            {otherScale:otherScale,otherOffset:[-offsetX/other.width,-offsetY/other.height]}
        );
    }

    effects.fill = function (other,mask,offsetX,offsetY) {
        var otherScale = [this.width/other.width,this.height/other.height];
        offsetX = offsetX || 0;
        offsetY = offsetY || 0;

        var thisTexture = this.getTexture();
        var otherTexture = other.getTexture();

        var gl = this.gl;
        if (!mask) {
            gl.fillShader = gl.fillShader || new Shader(gl,null, [
                "uniform sampler2D texture,other;",
                "uniform vec2 otherScale;",
                "uniform vec2 otherOffset;",
                "varying vec2 texCoord;",
                "void main() {",
                "    vec4 otherColor = texture2D(other, fract(texCoord * otherScale + otherOffset));",
                "    vec4 thisColor = texture2D(texture, texCoord);",
                "    gl_FragColor = thisColor * (1.0-otherColor.a) + otherColor * otherColor.a;",
                "    gl_FragColor.a = 1.0;",
                "}"
            ].join("\n"));
            this.draw3D(gl.fillShader,
                    {texture:thisTexture,other:otherTexture},
                    {otherScale:otherScale,otherOffset:[-offsetX/other.width,-offsetY/other.height]}
            );
        } else {
            var maskScale = [this.width/mask.width, this.height/mask.height];
            var maskTexture = mask.getTexture();

            gl.fillMaskShader = gl.fillMaskShader || new Shader(gl,null, '\
                uniform sampler2D texture,other,mask;\
                uniform vec2 otherScale,maskScale;\
                varying vec2 texCoord;\
                void main() {\
                    vec4 maskColor = texture2D(mask, fract(texCoord * maskScale));\
                    vec4 otherColor = texture2D(other, fract(texCoord * otherScale));\
                    vec4 thisColor = texture2D(texture, texCoord);\
                    gl_FragColor = thisColor * (1.0-maskColor.a * otherColor.a) + otherColor * maskColor.a * otherColor.a;\
                }\
            ');

            this.draw3D(gl.fillMaskShader,
                    {texture:thisTexture,other:otherTexture,mask:maskTexture},
                    {otherScale:otherScale,maskScale:maskScale}
            );
        }
        this.setState('texture');
        return this;
    }

    effects.fillColor = function (color) {
        color = teacss.Color.parse(color);
        color = [color.rgb[0]/255,color.rgb[1]/255,color.rgb[2]/255,color.alpha];
        
        var gl = this.gl;
        gl.fillColorShader = gl.fillColorShader || new Shader(gl,null,[
            "uniform vec4 c1;",
            "void main() {",
            "    gl_FragColor = c1;",
            "}"
        ].join("\n"))
        this.draw3D(gl.fillColorShader,{tex0:this.getTexture()},{c1:color});
        this.setState('texture');
        return this;
    }

    effects.gradient = function (stops) {
        var gl = this.gl;
        gl.gradientShader = gl.gradientShader || new Shader(gl,null, '\
            uniform vec4 color1,color2;\
            varying vec2 texCoord;\
            void main() {\
                gl_FragColor = color1 * (1.0-texCoord.x) + color2 * texCoord.x;\
            }\
        ');

        var stop_list = [];
        for (var i=0;i<stops.length;i++) {
            var stop = stops[i];
            var x = stop[0];
            var color = stop[1];
            stop_list.push({x:x,color:parseColor(color)});
        }

        if (stops.length==0) return;

        stop_list.splice(0,0,{x:0,color:stop_list[0].color});
        stop_list.push({x:1,color:stop_list[stop_list.length-1].color});

        for (var i=0;i<stop_list.length-1;i++) {
            var stop1 = stop_list[i];
            var stop2 = stop_list[i+1];

            var texture = this.getTexture();
            var left  = stop1.x * this.width;
            var right = stop2.x * this.width;

            if (left!=right)
                texture.drawTo(function(){
                    gl.gradientShader
                            .uniforms({color1:stop1.color,color2:stop2.color})
                            .drawRect(left,undefined,right,undefined);
                })
        }
        this.setState('texture');
        return this;
    }

    effects.triangleBlur = function (radius) {
        var gl = this.gl;
        gl.triangleBlurShader = gl.triangleBlurShader || new Shader(gl,null, '\
            uniform sampler2D texture;\
            uniform vec2 delta;\
            varying vec2 texCoord;\
            ' + randomShaderFunc + '\
            void main() {\
                vec4 color = vec4(0.0);\
                float total = 0.0;\
                \
                /* randomize the lookup values to hide the fixed number of samples */\
                float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\
                \
                for (float t = -30.0; t <= 30.0; t++) {\
                    float percent = (t + offset - 0.5) / 30.0;\
                    float weight = 1.0 - abs(percent);\
                    color += texture2D(texture, texCoord + delta * percent) * weight;\
                    total += weight;\
                }\
                gl_FragColor = color / total;\
            }\
        ');

        this.draw3D(gl.triangleBlurShader,{texture:this.getTexture()},{delta: [radius / this.width,  0]});
        this.draw3D(gl.triangleBlurShader,{texture:this.getTexture()},{delta: [0, radius / this.height]});
        this.setState('texture');
        return this;
    }

    effects.flip = function(flipX,flipY) {
        var gl = this.gl;
        gl.flipShader =  gl.flipShader || new Shader(gl,'\
            attribute vec2 vertex;\
            attribute vec2 _texCoord;\
            varying vec2 texCoord;\
            uniform float flipX;\
            uniform float flipY;\
            void main() {\
                texCoord = _texCoord;\
                gl_Position = vec4((vertex.x * 2.0 - 1.0)*flipX, (vertex.y * 2.0 - 1.0)*flipY, 0.0, 1.0);\
            }'
        ,null);
        this.draw3D(gl.flipShader,{texture:this.getTexture()},{flipX:flipX ?-1:1,flipY:flipY ?-1:1});
        this.setState("texture");
        return this;
    }

    effects.hueSaturation = function(hue, saturation) {
        var gl = this.gl;
        gl.hueSaturationShader = gl.hueSaturationShader || new Shader(gl,null, '\
            uniform sampler2D texture;\
            uniform float hue;\
            uniform float saturation;\
            varying vec2 texCoord;\
            void main() {\
                vec4 color = texture2D(texture, texCoord);\
                \
                /* hue adjustment, wolfram alpha: RotationTransform[angle, {1, 1, 1}][{x, y, z}] */\
                float angle = hue * 3.14159265;\
                float s = sin(angle), c = cos(angle);\
                vec3 weights = (vec3(2.0 * c, -sqrt(3.0) * s - c, sqrt(3.0) * s - c) + 1.0) / 3.0;\
                float len = length(color.rgb);\
                color.rgb = vec3(\
                    dot(color.rgb, weights.xyz),\
                    dot(color.rgb, weights.zxy),\
                    dot(color.rgb, weights.yzx)\
                );\
                \
                /* saturation adjustment */\
                float average = (color.r + color.g + color.b) / 3.0;\
                if (saturation > 0.0) {\
                    color.rgb += (average - color.rgb) * (1.0 - 1.0 / (1.001 - saturation));\
                } else {\
                    color.rgb += (average - color.rgb) * (-saturation);\
                }\
                \
                gl_FragColor = color;\
            }\
        ');

        function clamp(lo, value, hi) {
            return Math.max(lo, Math.min(value, hi));
        }
        this.draw3D(gl.hueSaturationShader,{texture:this.getTexture()},{
            hue: clamp(-1, hue, 1),
            saturation: clamp(-1, saturation, 1)
        });
        this.setState('texture');
        return this;
    }

    effects.brightnessContrast = function(brightness, contrast, invert) {
        var gl = this.gl;
        gl.brightnessContrastShader = gl.brightnessContrastShader || new Shader(gl,null, '\
            uniform sampler2D texture;\
            uniform float brightness;\
            uniform float contrast;\
            uniform vec2 invert;\
            varying vec2 texCoord;\
            void main() {\
                vec4 color = texture2D(texture, texCoord);\
                color.rgb = color.rgb * invert.x + vec3(invert.y);\
                color.rgb += brightness;\
                if (contrast > 0.0) {\
                    color.rgb = (color.rgb - 0.5) / (1.0 - contrast) + 0.5;\
                } else {\
                    color.rgb = (color.rgb - 0.5) * (1.0 + contrast) + 0.5;\
                }\
                gl_FragColor = color;\
            }\
        ');

        function clamp(lo, value, hi) {
            return Math.max(lo, Math.min(value, hi));
        }
        this.draw3D(gl.brightnessContrastShader,{texture:this.getTexture()},{
            brightness: clamp(-1, brightness, 1),
            contrast: clamp(-1, contrast, 1),
            invert: invert ? [-1,1] : [1,0]
        });
        this.setState('texture');
        return this;
    }

    /**
     * Replace up to 5 color in the texture
     * @param colors hash array in form { color1 : replacement1 , color2 : replacement2 } and so on
     */
    effects.replaceColors = function (colors) {
        var gl = this.gl;
        gl.replaceColorsShader = gl.replaceColorsShader || new Shader(gl,null, '\
            uniform sampler2D texture;\
            uniform vec3 color1;\
            uniform vec3 color2;\
            uniform vec3 color3;\
            uniform vec3 color4;\
            uniform vec3 color5;\
            uniform vec3 replace1;\
            uniform vec3 replace2;\
            uniform vec3 replace3;\
            uniform vec3 replace4;\
            uniform vec3 replace5;\
            varying vec2 texCoord;\
            void main() {\
                vec4 color = texture2D(texture, texCoord);\
                if (color1==color.rgb) color.rgb = replace1;\
                if (color2==color.rgb) color.rgb = replace2;\
                if (color3==color.rgb) color.rgb = replace3;\
                if (color4==color.rgb) color.rgb = replace4;\
                if (color5==color.rgb) color.rgb = replace5;\
                gl_FragColor = color;\
            }\
        ');

        var color;
        var params = {};
        for (var i=1;i<=5;i++) {
            params['color'+i] = [1,1,1];
            params['replace'+i] = [1,1,1];
        }
        i = 1;
        for (var key in colors) {
            color = teacss.Color.parse(key);
            params['color'+i] = [color.rgb[0]/255,color.rgb[1]/255,color.rgb[2]/255];
            color = teacss.Color.parse(colors[key]);
            params['replace'+i] = [color.rgb[0]/255,color.rgb[1]/255,color.rgb[2]/255];
            if (++i>5) break;
        }
        this.draw3D(gl.replaceColorsShader,{tex0:this.getTexture()},params);
        this.setState('texture');
        return this;
    }

    effects.preview = function () {
        var gl = this.gl;
        this.getTexture().use(0);
        
        gl.viewport(0, 0, this.width, this.height);
        gl.previewShader = gl.previewShader || new Shader(gl,[
            "attribute vec2 vertex;",
            "attribute vec2 _texCoord;",
            "varying vec2 texCoord;",
            "uniform vec2 scale;",
            "void main() {",
            "    texCoord = _texCoord*scale;",
            "    gl_Position = vec4(vertex.x * 2.0 - 1.0, 1.0 - vertex.y * 2.0, 0.0, 1.0);",
            "}"
        ].join("\n"),[
            "uniform sampler2D texture;",
            "varying vec2 texCoord;",
            "void main() {",
            "    vec2 tex = mod(texCoord,1.0);",
            "    vec4 res = texture2D(texture, texCoord);",
            "    gl_FragColor = vec4(res.rgb*res.a,res.a);",
            "}"
        ].join("\n"));
        
        gl.previewShader
            .textures({texture:0})
            .uniforms({scale:[1,1]})
            .drawRect();
    }

    var previewCanvasCache = {};
    effects.background = function () {
        var canvas = this;
        var tea = teacss.tea;
        var selector = tea.Style.current.getSelector();
        var id = selector.replace(/[^A-Za-z_0-9-]/g,"_")+"_canvas";
        var doc = teacss.tea.document ? teacss.tea.document : document;
        
        Canvas.defaultElement.width = canvas.width;
        Canvas.defaultElement.height = canvas.height;
        canvas.preview();
        
        var element, context;
        var cached = previewCanvasCache[id];
        if (cached) {
            element = cached.element;
            context = cached.context;
        } 
        else {
            element = doc.createElement("canvas");
            context = element.getContext('2d');
            previewCanvasCache[id] = { element: element, context : context }
        }

        element.width = canvas.width;
        element.height = canvas.height;
        
        context.drawImage(Canvas.defaultElement,0,0);
        
        if (doc.mozSetImageElement) {
            tea.rule('background-image:-moz-element(#'+id+')');
            doc.mozSetImageElement(id,element);
        } else {
            tea.rule('background-image:-webkit-canvas('+id+')');
            context = doc.getCSSCanvasContext("2d",id,canvas.width,canvas.height);
            context.drawImage(element,0,0);
        }
        return canvas;
    }
    
    return effects;
}();
window.Shader = window.Shader || (function() {
    function isArray(obj) {
        return Object.prototype.toString.call(obj) == '[object Array]';
    }

    function isNumber(obj) {
        return Object.prototype.toString.call(obj) == '[object Number]';
    }

    function compileSource(gl,type, source) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw 'compile error: ' + gl.getShaderInfoLog(shader);
        }
        return shader;
    }

    var defaultVertexSource = [
        "attribute vec2 vertex;",
        "attribute vec2 _texCoord;",
        "varying vec2 texCoord;",
        "void main() {",
        "    texCoord = _texCoord;",
        "    gl_Position = vec4(vertex.x * 2.0 - 1.0, vertex.y * 2.0 - 1.0, 0.0, 1.0);",
        "}"
    ].join("\n");

    var defaultFragmentSource = [
        "uniform sampler2D texture;",
        "varying vec2 texCoord;",
        "void main() {",
        "    gl_FragColor = texture2D(texture, texCoord);",
        "}"
    ].join("\n");

    function Shader(gl,vertexSource, fragmentSource) {
        this.gl = gl;
        this.vertexAttribute = null;
        this.texCoordAttribute = null;
        this.program = gl.createProgram();
        vertexSource = vertexSource || defaultVertexSource;
        fragmentSource = fragmentSource || defaultFragmentSource;
        fragmentSource = 'precision highp float;\n' + fragmentSource; // annoying requirement is annoying
        gl.attachShader(this.program, compileSource(gl,gl.VERTEX_SHADER, vertexSource));
        gl.attachShader(this.program, compileSource(gl,gl.FRAGMENT_SHADER, fragmentSource));
        gl.linkProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            throw 'link error: ' + gl.getProgramInfoLog(this.program);
        }
    }

    Shader.prototype.destroy = function() {
        var gl = this.gl;
        gl.deleteProgram(this.program);
        this.program = null;
    };

    Shader.prototype.uniforms = function(uniforms) {
        var gl = this.gl;
        gl.useProgram(this.program);
        for (var name in uniforms) {
            if (!uniforms.hasOwnProperty(name)) continue;
            var location = gl.getUniformLocation(this.program, name);
            if (location === null) continue; // will be null if the uniform isn't used in the shader
            var value = uniforms[name];
            if (isArray(value)) {
                switch (value.length) {
                    case 1: gl.uniform1fv(location, new Float32Array(value)); break;
                    case 2: gl.uniform2fv(location, new Float32Array(value)); break;
                    case 3: gl.uniform3fv(location, new Float32Array(value)); break;
                    case 4: gl.uniform4fv(location, new Float32Array(value)); break;
                    case 9: gl.uniformMatrix3fv(location, false, new Float32Array(value)); break;
                    case 16: gl.uniformMatrix4fv(location, false, new Float32Array(value)); break;
                    default: throw 'dont\'t know how to load uniform "' + name + '" of length ' + value.length;
                }
            } else if (isNumber(value)) {
                gl.uniform1f(location, value);
            } else {
                throw 'attempted to set uniform "' + name + '" to invalid value ' + (value || 'undefined').toString();
            }
        }
        // allow chaining
        return this;
    };

    // textures are uniforms too but for some reason can't be specified by gl.uniform1f,
    // even though floating point numbers represent the integers 0 through 7 exactly
    Shader.prototype.textures = function(textures) {
        var gl = this.gl;
        gl.useProgram(this.program);
        for (var name in textures) {
            if (!textures.hasOwnProperty(name)) continue;
            gl.uniform1i(gl.getUniformLocation(this.program, name), textures[name]);
        }
        // allow chaining
        return this;
    };

    Shader.prototype.drawRect = function(left, top, right, bottom) {
        var gl = this.gl;
        var undefined;
        var viewport = gl.getParameter(gl.VIEWPORT);
        top = top !== undefined ? (top - viewport[1]) / viewport[3] : 0;
        left = left !== undefined ? (left - viewport[0]) / viewport[2] : 0;
        right = right !== undefined ? (right - viewport[0]) / viewport[2] : 1;
        bottom = bottom !== undefined ? (bottom - viewport[1]) / viewport[3] : 1;
        if (gl.vertexBuffer == null) {
            gl.vertexBuffer = gl.createBuffer();
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([ left, top, left, bottom, right, top, right, bottom ]), gl.STATIC_DRAW);
        if (gl.texCoordBuffer == null) {
            gl.texCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, gl.texCoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([ 0, 0, 0, 1, 1, 0, 1, 1 ]), gl.STATIC_DRAW);
        }
        if (this.vertexAttribute == null) {
            this.vertexAttribute = gl.getAttribLocation(this.program, 'vertex');
            gl.enableVertexAttribArray(this.vertexAttribute);
        }
        if (this.texCoordAttribute == null) {
            this.texCoordAttribute = gl.getAttribLocation(this.program, '_texCoord');
            gl.enableVertexAttribArray(this.texCoordAttribute);
        }
        gl.useProgram(this.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
        gl.vertexAttribPointer(this.vertexAttribute, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.texCoordBuffer);
        gl.vertexAttribPointer(this.texCoordAttribute, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    Shader.getDefaultShader = function() {
        var gl = this.gl;
        gl.defaultShader = gl.defaultShader || new Shader();
        return gl.defaultShader;
    };
    return Shader;
})();
;
window.Texture = window.Texture || (function() {
    Texture.fromImage = function(gl,image) {
        var texture = new Texture(gl,0, 0, gl.RGBA, gl.UNSIGNED_BYTE);
        texture.width = image.width;
        texture.height = image.height;
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        return texture;
    };

    function Texture(gl,width, height, format, type) {
        this.id = gl.createTexture();
        this.width = width;
        this.height = height;
        this.format = format;
        this.type = type;
        this.gl = gl;

        gl.bindTexture(gl.TEXTURE_2D, this.id);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        if (width && height) gl.texImage2D(gl.TEXTURE_2D, 0, this.format, width, height, 0, this.format, this.type, null);
    }

    Texture.prototype.initFromBytes = function(width, height, data) {
        this.width = width;
        this.height = height;
        this.format = gl.RGBA;
        this.type = gl.UNSIGNED_BYTE;
        var gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D, this.id);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, this.type, new Uint8Array(data));
    };

    Texture.prototype.destroy = function() {
        var gl = this.gl;
        if (this.framebuffer) gl.deleteFramebuffer(this.framebuffer);
        gl.deleteTexture(this.id);
        this.id = null;
    };

    Texture.prototype.use = function(unit) {
        var gl = this.gl;
        if (!unit) unit = 0;
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, this.id);
    };

    Texture.prototype.unuse = function(unit) {
        var gl = this.gl;
        gl.activeTexture(gl.TEXTURE0 + (unit || 0));
        gl.bindTexture(gl.TEXTURE_2D, null);
    };

    Texture.prototype.ensureFormat = function(width, height, format, type) {
        // allow passing an existing texture instead of individual arguments
        var gl = this.gl;
        if (arguments.length == 1) {
            var texture = arguments[0];
            width = texture.width;
            height = texture.height;
            format = texture.format;
            type = texture.type;
        }

        // change the format only if required
        if (width != this.width || height != this.height || format != this.format || type != this.type) {
            this.width = width;
            this.height = height;
            this.format = format;
            this.type = type;
            gl.bindTexture(gl.TEXTURE_2D, this.id);
            gl.texImage2D(gl.TEXTURE_2D, 0, this.format, width, height, 0, this.format, this.type, null);
        }
    };

    Texture.prototype.drawTo = function(callback) {
        // start rendering to this texture
        var gl = this.gl;
        this.framebuffer = this.framebuffer || gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.id, 0);
        gl.viewport(0, 0, this.width, this.height);

        // do the drawing
        callback();

        // stop rendering to this texture
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };

    var canvas = null;

    function getCanvas(texture) {
        if (canvas == null) canvas = document.createElement('canvas');
        canvas.width = texture.width;
        canvas.height = texture.height;
        var c = canvas.getContext('2d');
        c.clearRect(0, 0, canvas.width, canvas.height);
        return c;
    }

    Texture.prototype.fillUsingCanvas = function(callback) {
        var gl = this.gl;
        callback(getCanvas(this));
        this.format = gl.RGBA;
        this.type = gl.UNSIGNED_BYTE;
        gl.bindTexture(gl.TEXTURE_2D, this.id);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
        return this;
    };

    Texture.prototype.toImage = function(image) {
        var gl = this.gl;
        this.use();
        Shader.getDefaultShader().drawRect();
        var size = this.width * this.height * 4;
        var pixels = new Uint8Array(size);
        var c = getCanvas(this);
        var data = c.createImageData(this.width, this.height);
        gl.readPixels(0, 0, this.width, this.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        for (var i = 0; i < size; i++) {
            data.data[i] = pixels[i];
        }
        c.putImageData(data, 0, 0);
        image.src = canvas.toDataURL();
    };

    Texture.prototype.swapWith = function(other) {
        var temp;
        temp = other.id; other.id = this.id; this.id = temp;
        temp = other.width; other.width = this.width; this.width = temp;
        temp = other.height; other.height = this.height; this.height = temp;
        temp = other.format; other.format = this.format; this.format = temp;
    };

    return Texture;
})();;
{
        teacss.update();
    }