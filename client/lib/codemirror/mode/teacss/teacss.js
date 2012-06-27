CodeMirror.defineMode("teacss", function(config, parserConfig) {

    var jsMode = CodeMirror.getMode(config, "javascript");
    CodeMirror.StringStream.prototype.skipToMultiple = function(list) {
        var found = -1;
        for (var i=0;i<list.length;i++) {
            var res = this.string.indexOf(list[i], this.pos);
            if (res > -1 && (res < found || found==-1)) found = res;
        }
        if (found > -1) {this.pos = found; return true;}
    }
        
    function test_teacss() {
        if (!teacss.LexerStack) throw "You should include teacss (teacss CM mode)";
    }
    
    return {
        startState: function() {
            test_teacss();
            var state = new teacss.LexerStack();
            state.push("scope",{scope:"css"});
            return state;
        },
        
        copyState: function(from) {
            test_teacss();
            var copy = new teacss.LexerStack();
            for (var i=0;i<from.states.length;i++) {
                var state_from = from.states[i];
                var state_copy = {};
                state_copy.state = state_from.state;
                state_copy.data = {};
                
                for (var key in state_from.data) {
                    if (key=="jsState")
                        state_copy.data[key] = CodeMirror.copyState({},state_from.data[key]);
                    else
                        state_copy.data[key] = state_from.data[key];
                }
                
                copy.states.push(state_copy);
            }
            copy.state = copy.states[copy.states.length-1].state;
            copy.data = copy.states[copy.states.length-1].data;
            return copy;
        },
        
        token: function(stream, stack) {
            test_teacss();
            switch (stack.state) {
                case "scope":
                    if (stream.match("}")) { 
                        if (!stack.pop()) return "pop_error"; 
                        return 'scope_end'; 
                    }
                    if (stream.match(/^[ \t\n\r]+/)) return "blank";
                    if (stream.match(";")) return "nop";
                    if (stream.match("@ ")) { stack.push("js_line",{jsState:jsMode.startState()}); return 'js_line_start'; }
                    if (stream.match("@{")) { stack.push("js_block",{jsState:jsMode.startState()}); return 'js_block_start'; }
                    if (stream.match("@import")) { stack.push("import"); return 'import_start'; }
                    if (stream.match("@append")) { stack.push("append"); return 'append_start'; }
                    if (stream.match("/*",false)) { stack.push('comment'); return 'comment'; }
                    if (stream.match("//",false)) { stack.push('comment_line'); return 'comment_line'; }
                    if (stream.match("@")) return "rule";
                    stack.push('rule',{scope:stack.data.scope});
                    return null;
        
                case "js_line":
                    if (stream.sol()) { stack.pop(); return null; }
                    return jsMode.token(stream, stack.data.jsState);
                case "js_block":
                    if (stack.data.braces===undefined) stack.data.braces = 1;
                    
                    if (stream.match(/^(\s)*?\{/,false)) { stream.eatSpace(); stack.data.braces++; }
                    if (stream.match(/^(\s)*?\}/,false)) { stream.eatSpace(); stack.data.braces--; }
            
                    if (stack.data.braces==0) {
                        if (!stack.pop()) return "pop_error"; 
                        return "js_block_end"; 
                    }
                    return jsMode.token(stream, stack.data.jsState);
    
                case "import":
                case "append":
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
                    var token = stack.data.token || "comment";
                    if (stream.skipTo("\n")) stream.next(); else stream.skipToEnd();
                    stack.pop();
                    return token;
                    
                case "rule":
                    if (stack.data.is_block===undefined) {
                        stack.data.is_block = true;
                        var delim = stream.match(/[;|{|}]/,false);
                        if (delim) {
                            if (delim!="{") stack.data.is_block = false;
                        } else {
                            if (stream.match(":",false)) stack.data.is_block = false;
                        }
                    }
                    
                    if (stream.match("@{")) { stack.push("js_inline_block"); return "js_inline_block"; }
                    if (stream.match("@")) { stack.push("js_inline"); return "js_inline"; }
                    
                    if (stack.data.string_single) {
                        if (stream.peek()=="'" && stream.string[stream.pos-1]!='\\') stack.data.string_single = false;
                         stream.next(); return "string";
                    }
                    else if (stack.data.string_double) {
                        if (stream.peek()=='"' && stream.string[stream.pos-1]!='\\') stack.data.string_double = false;
                         stream.next(); return "string";
                    }
                    else if (stack.data.inside_url) {
                        if (stream.peek()==")") stack.data.inside_url = false;
                    }
                    else {
                        if (stream.peek()=="'") { stack.data.string_single = true; stream.next(); return "string"; }
                        else if (stream.peek()=='"') { stack.data.string_double = true;  stream.next(); return "string"; }
                        else if (stream.match("url(",false)) { stack.data.inside_url = true; }
                        else if (stream.peek()==';' || stream.peek()=='}') { stack.pop(); return null; }
                        else if (stream.peek()=='{') {
                            var scope = stack.data.scope;
                            stream.next(); stack.pop();
                            stack.push('scope',{scope:scope}); return "scope_start"; 
                        }
                        else if (stream.peek()==":" && !stack.data.value_part) { stack.data.value_part = true; }
                        else {
                            var scope = stream.match(/^\w+/,false);
                            if (scope) scope = scope[0];
                            if (teacss.tea[scope]) {
                                stream.match(/^\w+/);
                                stack.data.scope = scope;
                                return "scope";
                            }
                            
                            var tags_re = /^(html|head|body|title|div|ul|li|b|strong|i|font|a|h1|h2|h3|h4|h5|h6|script|style|form|input|button|label)[\[\s{;}\.#]/;
                            
                            if (stack.data.scope=="css") {
                                if (stack.data.is_block) {
                                    if (stream.match(/^#[A-Za-z_\-0-9]+/)) return "atom";
                                    if (stream.match(/^\.[A-Za-z_\-0-9]+/)) return "def";
                                    if (stream.match(tags_re)) { stream.backUp(1); return "keyword";}
                                } else {
                                    if (stack.data.value_part) {
                                        if (stream.match(/^#\w+/)) return "number";
                                    }
                                }
                                
                            } else if (stack.data.scope=="Template") {
                                if (stream.match(/^#[A-Za-z_\-0-9]+/)) return "atom";
                                if (stream.match(/^\.[A-Za-z_\-0-9]+/)) return "def";
                                if (stream.match(tags_re)) { stream.backUp(1); return "keyword";}
                                if (stream.match(/^%\[(.*?)\]/)) { return "variable-2"; }
                            } else {
                                if (!stack.data.is_block && stack.data.value_part) {
                                    if (!stack.data.jsState) stack.data.jsState = jsMode.startState();
                                    return jsMode.token(stream, stack.data.jsState);
                                }
                            }
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
        },
        electricChars: "}"
    }    
});


CodeMirror.defineMIME("text/tea", "teacss");