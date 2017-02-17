(function($,ui){

function monacoReady(cb) {
    if (window.monaco) return cb();
    dayside.editor.bind("editorCreated",function(b,e){ if (cb) cb(); cb = false; });
}

function convertRange(range) {
    return {
        startLineNumber: range.start.line + 1,
        startColumn: range.start.character + 1,
        endLineNumber: range.end.line + 1,
        endColumn: range.end.character + 1
    }
}

dayside.php_autocomplete = dayside.plugins.php_autocomplete = $.Class.extend({
    init: function (o) {
        var me = this;
        this.options = $.extend({},o);
        this.Class.instance = this;
        
        this.root = "/var/www/uxcandy_boomyjee/data/public_html";

        var socket = this.socket = new WebSocket("ws://" + window.location.hostname + ":8080");

        socket.onopen = function () { 
            console.log("Connection OK");
            me.connected() 
        };
        socket.onclose = function (event) {
            if (event.wasClean) {
                console.log('Closed clean');
            } else {
                console.log('Broken connection');
            }
            console.log('Code: ' + event.code + ' reason: ' + event.reason);
        };

        socket.onmessage = function (event) {
            var parts = event.data.split("\n");
            var data = JSON.parse(parts[parts.length-1]);
            me.receive(data);
        };

        socket.onerror = function (error) {
            console.log("Error " + error.message);
        };
    },

    connected: function () {
        var me = this;
        this.send("initialize",{
            rootPath: me.root + "/dayside_php_autocomplete/language_server",
            capabilities: {}                
        },function(msg){
            var serverCapabilities = msg.result.capabilities;
            monacoReady(function(){
                if (serverCapabilities.completionProvider) {
                    monaco.languages.registerCompletionItemProvider('php', {
                        triggerCharacters: serverCapabilities.completionProvider.triggerCharacters,
                        provideCompletionItems: function(model, position) {
                            return new monaco.Promise(function(complete){
                                if (model.codeTab.changeCallback) model.codeTab.changeCallback();
                                me.send('textDocument/completion',{
                                    position: {
                                        line: position.lineNumber - 1,
                                        character: position.column - 1
                                    },
                                    textDocument: {
                                        uri: me.getModelUri(model)
                                    }
                                },function(msg){
                                    msg.result.items.forEach(function(item){
                                        if (item.insertText==null) delete item['insertText'];
                                    });
                                    complete(msg.result);
                                });                        
                            });
                        }
                    });
                }

                if (serverCapabilities.hoverProvider) {
                    monaco.languages.registerHoverProvider('php', {
                        provideHover: function(model, position) {
                            return new monaco.Promise(function(complete){
                                if (model.codeTab.changeCallback) model.codeTab.changeCallback();
                                me.send('textDocument/hover',{
                                    position: {
                                        line: position.lineNumber - 1,
                                        character: position.column - 1
                                    },
                                    textDocument: {
                                        uri: me.getModelUri(model)
                                    }
                                },function(msg){
                                    complete(msg.result);
                                });                        
                            });
                        }
                    });
                }

                if (serverCapabilities.definitionProvider) {
                    monaco.languages.registerDefinitionProvider('php',{
                        provideDefinition: function(model,position) {
                            return new monaco.Promise(function(complete){
                                if (model.codeTab.changeCallback) model.codeTab.changeCallback();
                                me.send('textDocument/definition',{
                                    position: {
                                        line: position.lineNumber - 1,
                                        character: position.column - 1
                                    },
                                    textDocument: {
                                        uri: me.getModelUri(model)
                                    }
                                },function(msg){
                                    msg.result.range = convertRange(msg.result.range);
                                    complete(msg.result);
                                });                        
                            });
                        }
                    });
                }

                if (serverCapabilities.documentSymbolProvider) {
                    monaco.languages.registerDocumentSymbolProvider('php',{
                        provideDocumentSymbols: function(model) {
                            return new monaco.Promise(function(complete){
                                me.send('textDocument/documentSymbol',{
                                    textDocument: {
                                        uri: me.getModelUri(model)
                                    }                                
                                },function(msg){
                                    msg.result.forEach(function(symbol){
                                        symbol.location.range = convertRange(symbol.location.range);
                                    });
                                    complete(msg.result);
                                });
                            });
                        }
                    });
                }

                if (serverCapabilities.referencesProvider) {
                    monaco.languages.registerReferenceProvider('php',{
                        provideReferences: function(model,position,context) {
                            return new monaco.Promise(function(complete){
                                me.send('textDocument/references',{
                                    context: context,
                                    position: {
                                        line: position.lineNumber - 1,
                                        character: position.column - 1
                                    },                                    
                                    textDocument: {
                                        uri: me.getModelUri(model)
                                    }                                
                                },function(msg){
                                    msg.result.forEach(function(ref){
                                        ref.range = convertRange(ref.range);
                                    });                                    
                                    complete(msg.result);
                                });
                            });
                        }
                    });
                }                

            });
        });

        dayside.editor.bind("editorOptions",function(b,e){
            e.options.overrideOptions = e.options.overrideOptions || {};
            e.options.overrideOptions.editorService = {
                openEditor: function (e) {
                    return new monaco.Promise(function(complete,error){
                        var url = me.getUrl(e.resource);
                        var selection = e.options.selection;

                        var tab = dayside.editor.selectFile(url);

                        function positionCursor() {
                            var editor = tab.editor;
                            if (selection) {
                                if (typeof selection.endLineNumber === 'number' && typeof selection.endColumn === 'number') {
                                    editor.setSelection(selection);
                                    editor.revealRangeInCenter(selection);
                                } else {
                                    var pos = {
                                        lineNumber: selection.startLineNumber,
                                        column: selection.startColumn
                                    };
                                    editor.setPosition(pos);
                                    editor.revealPositionInCenter(pos);                            
                                }
                            }

                            if (!editor.getControl) {
                                editor.getControl = function () {
                                    return this;
                                }
                            }
                            tab.saveState();
                            complete(editor);
                        }
                        
                        if (tab.editor) {
                            positionCursor();
                        } else {
                            tab.bind("editorCreated",positionCursor);
                        }
                    });
                }
            }
        });

        dayside.editor.bind("editorCreated",function(b,e){
            e.editor.model.codeTab = e.tab;
            me.send("textDocument/didOpen",{
                textDocument: {
                    uri: me.getModelUri(e.tab.editor.getModel()),
                    languageId: 'php',
                    version: e.tab.editor.getModel().getVersionId(),
                    text: e.tab.editor.getValue()
                }
            });
            e.tab.bind("close",function(b,event_close){
                if (!event_close.cancel) {
                    if (e.tab.changeCallback) e.tab.changeCallback();
                    me.send("textDocument/didClose",{
                        textDocument: {
                            uri: me.getModelUri(e.tab.editor.getModel())
                        }   
                    });
                }
            });
        });
        dayside.editor.bind("codeChanged",function(b,tab){
            clearTimeout(tab.autocompleteDidChangeTimeout);
            tab.changeCallback = function(){
                tab.changeCallback = false;
                clearTimeout(tab.autocompleteDidChangeTimeout);
                me.send("textDocument/didChange",{
                    textDocument: {
                        uri: me.getModelUri(tab.editor.getModel()),
                        version: tab.editor.getModel().getVersionId()
                    },
                    contentChanges: [{
                        text: tab.editor.getValue()
                    }]
                });
            }
            tab.autocompleteDidChangeTimeout = setTimeout(tab.changeCallback,500);
        });
    },
    getModelUri: function (model) {
        return this.getUri(model.codeTab.options.file);
    },
    getUri: function (url) {
        return "file://"+url.replace(dayside.options.root,this.root);
    },
    getUrl: function (uri) {
        return uri.replace(/^file:\/\//,"").replace(this.root,dayside.options.root);
    },
    sendCallbacks: {},
    send: function (method,params,callback) {
        var me = this;  
        me.requestId = (me.requestId || 0) + 1;
        var msg = {
            id: me.requestId,
            method: method,
            params: params
        }
        console.log("SENT",msg);
        this.socket.send(JSON.stringify(msg));

        if (callback) me.sendCallbacks[me.requestId] = callback;
        return me.requestId;
    },

    receive: function (msg) {
        var me = this;
        console.log("RECV",msg);
        if (msg.id && me.sendCallbacks[msg.id]) {
            me.sendCallbacks[msg.id](msg);
            delete me.sendCallbacks[msg.id];
        }
    }
});
    
})(teacss.jQuery,teacss.ui);

