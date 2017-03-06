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
        
        me.maskInput = teacss.ui.text({width:"100%",margin:"0px 0"});
        me.textInput = teacss.ui.text({width:"100%",margin:"0px 0"});
        
        this.element.append(
            me.form = $("<form>").append(
                teacss.ui.label({value:"Search mask:",width:"100%",margin:"10px 0 5px"}).element,
                me.maskInput.element,
                teacss.ui.label({value:"Contains text:",width:"100%",margin:"10px 0 5px"}).element,
                me.textInput.element,
                $("<input type='submit'>").css({display:"none"})
            )
            .submit(function(e){
                e.preventDefault();
                me.search();
                return false;
            })
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
                var link = $(this).attr("data-url");
                if (!link) return;
                
                var tab = dayside.editor.selectFile(link);
                var text = me.currentParams.text;
                
                if (text) {
                    function editorCreated() {
                        monaco_require(['vs/editor/contrib/find/common/findController'],function(fc){
                            var efc = fc.CommonFindController.get(tab.editor);
                            efc.setSearchString(text);
                            if (!efc.getState().matchCase) efc.toggleCaseSensitive();
                            efc.start({});
                            efc.moveToNextMatch();
                        })
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
        me.searchTab.element.append($("<a>").text("-- Searching --"));
        
        var rel = this.path.substring(FileApi.root.length);
        if (rel[0]=='/') rel = rel.substring(1);
        me.searchTab.options.label = "Search: /" + rel;
        
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
            
            me.searchTab.element.empty();
            $.each(res.files,function(){
                var rel = this.substring(me.path.length);
                if (rel[0]=='/') rel = rel.substring(1);
                me.searchTab.element.append($("<a href='#'>").attr("data-url",this).text(rel));
            });
            
            if (!res.finished) {
                me.searchRequest($.extend(params,{from:res.from}));
            } else {
                if (me.searchTab.element.children().length==0) {
                    me.searchTab.element.append($("<a>").text("-- Nothing found --"));
                }
            }
        });

    }
})
})(teacss.jQuery,teacss.ui);