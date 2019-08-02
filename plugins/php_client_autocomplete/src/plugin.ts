declare var dayside: any;
declare var teacss: any;
declare var monaco: any;
declare var monaco_require: any;
declare var FileApi: any;

(function($,ui){

    function monacoReady(cb) {
        if (window['monaco']) return cb();
        dayside.ready(function(){
            dayside.editor.bind("editorCreated",function(b,e){ if (cb) cb(); cb = false; });
        });
    }
    
    function convertRange(range) {
        return {
            startLineNumber: range.start.line + 1,
            startColumn: range.start.character + 1,
            endLineNumber: range.end.line + 1,
            endColumn: range.end.character + 1
        }
    }
    
    dayside.ready(function(){
        monaco_require(['vs/editor/standalone/browser/standaloneServices'],function(standaloneServices){
            dayside.editor.bind("editorOptions",function(b,e){
                e.options.overrideOptions = e.options.overrideOptions || {};
                e.options.overrideOptions.textModelResolverService = {
                    createModelReference: function(uri) {
                        return new Promise(function(complete){
                            monaco_require(['vs/base/common/lifecycle'],function(lc){
                                if (uri.scheme!="dayside") console.debug('Wrong uri 1',uri);
                                var file = uri.authority + uri.path;
        
                                FileApi.file(file,function (answer){
                                    var text = answer.error || answer.data;
                                    var model = monaco.editor.createModel(text,ui.codeTab.languageFromFilename(file));
                                    complete(new lc.ImmortalReference({
                                        textEditorModel: model
                                    }));                            
                                });
                            });
                        });
                    },
                    registerTextModelContentProvider: function (scheme, provider) {
                        return {
                            dispose: function () { }
                        };
                    }                    
                }
                standaloneServices.StaticServices.codeEditorService.get().openCodeEditor = function (e) {
                    return new Promise(function(complete,error){
                        var uri = e.resource;
                        if (uri.scheme!="dayside") console.debug('Wrong uri 2',uri);
                        var url = uri.authority + uri.path;
    
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
            });
        });
    });
    
    dayside.plugins.php_client_autocomplete = $.Class.extend({
        server: null,
        registerServer: function (server) {
            this.server = server;
        }
    },{
        init: function (o) {
            var me = this;
            this.options = $.extend({},o);
            this.Class.instance = this;

            dayside.core.bind("configDefaults",function(b,e){
                e.value.php_autocomplete_enable = false;
            });
    
            dayside.core.bind("configUpdate",function(b,e){
                me.connected = e.value.php_autocomplete_enable;
                if (me.connected) {
                    me.Class.server.connect();
                    me.registerOpenTabs();
                } else {
                    me.Class.server.disconnect();
                }
            });
    
            dayside.core.bind("configTabsCreated",function(b,e){
                var configTab = teacss.ui.panel({
                    label: "Autocomplete", padding: "1em"
                }).push(
                    ui.check({ label: "PHP enabled", name: "php_autocomplete_enable", width: "100%", margin: "5px 0" })
                );
                e.tabs.addTab(configTab);
            });    

            var serverCapabilities = {
                completionProvider: {
                    resolveProvider: true,
                    triggerCharacters: ['.', ':', '$', '>', "\\"]
                },
                documentSymbolProvider: true,
                definitionProvider: true
            }
            
            monacoReady(function(){
                if (serverCapabilities.completionProvider) {
                    monaco.languages.registerCompletionItemProvider('php', {
                        triggerCharacters: serverCapabilities.completionProvider.triggerCharacters,
                        provideCompletionItems: function(model, position) {
                            if (!me.connected) return [];
                            return new Promise(function(complete){
                                if (model.codeTab.changeCallback) model.codeTab.changeCallback();

                                me.Class.server.completion({
                                    position: {
                                        line: position.lineNumber - 1,
                                        character: position.column - 1
                                    },
                                    textDocument: {
                                        uri: model.codeTab.options.file,
                                        getText: function () {
                                            return model.codeTab.editor.getValue();
                                        }
                                    }
                                },function(msg){
                                    console.debug("completion",msg);
                                    msg.result.items.forEach(function(item){
                                        if (item.insertText==null) delete item['insertText'];
                                    });
                                    complete({
                                        suggestions: msg.result.items
                                    });
                                });                        
                            });
                        }
                    });
                }

                if (serverCapabilities.definitionProvider) {
                    monaco.languages.registerDefinitionProvider('php',{
                        provideDefinition: function(model,position) {
                            if (!me.connected) return [];
                            return new Promise(function(complete){
                                if (model.codeTab.changeCallback) model.codeTab.changeCallback();

                                me.Class.server.definition({
                                    position: {
                                        line: position.lineNumber - 1,
                                        character: position.column - 1
                                    },
                                    textDocument: {
                                        uri: model.codeTab.options.file
                                    }
                                },function(msg){
                                    console.debug("definition",msg);
                                    if (msg.result.range) {
                                        msg.result = [msg.result];
                                    }
                                    msg.result.forEach(function(one){
                                        one.range = convertRange(one.range);
                                        one.uri = me.getDaysideUri(one.uri);
                                    });
                                    complete(msg.result);
                                });                        
                            });
                        }
                    });
                }

                if (serverCapabilities.documentSymbolProvider) {
                    monaco.languages.registerDocumentSymbolProvider('php',{
                        provideDocumentSymbols: function(model) {
                            if (!me.connected) return [];
                            return new Promise(function(complete){
                                me.Class.server.documentSymbol({
                                    textDocument: {
                                        uri: model.codeTab.options.file
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

                me.registerOpenTabs();

                dayside.editor.bind("editorCreated",function(b,e){
                    if (!me.connected) return;
                    me.registerTab(e.tab);
                });
                dayside.editor.bind("codeChanged",function(b,tab){
                    if (!me.connected) return;
                    clearTimeout(tab.autocompleteDidChangeTimeout);
                    tab.changeCallback = function(){
                        tab.changeCallback = false;
                        clearTimeout(tab.autocompleteDidChangeTimeout);
                        me.Class.server.parseFile({
                            path: tab.options.file,
                            text: tab.editor.getValue()
                        });
                    }
                    tab.autocompleteDidChangeTimeout = setTimeout(tab.changeCallback,2000);
                });
            });
        },
        registerOpenTabs: function () {
            var me = this;
            if (!me.connected) return;
            ui.codeTab.tabs.forEach(function(tab){
                me.registerTab(tab);
            });
        },
        registerTab: function (tab) {
            var me = this;
            
            if (!tab.editor) return;
            if (!me.connected) return;
            
            tab.editor.getModel().codeTab = tab;
            me.Class.server.parseFile({
                path: tab.options.file,
                text: tab.editor.getValue()
            });

            if (!tab.php_autocomplete_closeBinded) {
                tab.bind("close",function(b,event_close){
                    if (!event_close.cancel) {
                        if (tab.changeCallback) tab.changeCallback();
                        if (me.connected) {
                            me.Class.server.closeFile(tab.options.file);
                        }
                    }
                });
                tab.php_autocomplete_closeBinded = true;
            }

        },
        getDaysideUri: function (uri) {
            return monaco.Uri.parse(uri.replace("file://","dayside://"));
        }
    });
        
})(teacss.jQuery,teacss.ui);