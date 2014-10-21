(function($,ui){
teacss.ui.searchDialog = teacss.ui.dialog.extend({
    init: function (o) {
        var $ = teacss.jQuery;
        var me = this;
        this._super($.extend({
            autoOpen: false,
            resizable: false,
            width: 650, 
            height: 'auto',
            modal: true,
            title: "Search for files",
            buttons: {
                "Search": function () {
                    me.search();
                }
            }
        },o));
        
        this.push(
            teacss.ui.label({value:"Search mask:",width:"100%",margin:"10px 0 5px"}),
            me.maskInput = teacss.ui.text({width:"100%",margin:"0px 0"}),
            teacss.ui.label({value:"Contains text:",width:"100%",margin:"10px 0 5px"}),
            me.textInput = teacss.ui.text({width:"100%",margin:"0px 0"})
        );
        
        me.maskInput.setValue(dayside.storage.get("file-search-mask")||"*.php");
        me.textInput.setValue(dayside.storage.get("file-search-text")||"");
        
        me.currentSearch = 0;
    },

    open: function (path,tree,node) {
        this.path = path;
        this._super();
    },
    
    search: function () {
        var me = this;
        if (!me.searchTab) {
            me.searchTab = teacss.ui.panel({label:"Search",closable:true,padding:"5px 0"});
            me.searchTab.element.addClass("file-search-tab");
            me.searchTab.bind("close",function(){
                me.currentSearch++;
            });
            
            $(document).on("click",".file-search-tab a",function(e){
                e.preventDefault();
                var link = $(this).text();
                var tab = dayside.editor.selectFile(link);
                var text = me.currentParams.text;
                
                if (text) {
                    function editorCreated() {
                        var cm = tab.editor;
                        CodeMirror.commands.clearSearch(cm);
                        CodeMirror.commands.findNext(cm,false,text);
                    }

                    if (tab.editor) 
                        editorCreated();
                    else
                        tab.bind("editorCreated",editorCreated);
                }
            }); 
        }
        me.close();
        
        me.searchTab.element.empty();  
        dayside.editor.mainPanel.addTab(me.searchTab,"file_search","bottom");
        
        dayside.storage.set("file-search-text",me.textInput.getValue());
        dayside.storage.set("file-search-mask",me.maskInput.getValue());

        me.searchRequest(me.currentParams = {
            id: me.currentSearch,
            path: me.path,
            mask: me.maskInput.getValue(),
            text: me.textInput.getValue(),
            from: false
        });
    },
    
    searchRequest: function (params) {
        var me = this;
        FileApi.request('fileSearch',params,true,function(data){
            if (me.currentSearch!=params.id) return;
            
            var res = data.data;
            
            $.each(res.files,function(){
                me.searchTab.element.append($("<a href='#'>").text(this));
            });
            
            if (!res.finished) {
                me.searchRequest($.extend(params,{from:res.from}));
            }
        });

    }
})
})(teacss.jQuery,teacss.ui);