(function ($,ui) {


dayside.plugins.console = $.Class.extend({
    init: function (options) {
        this.options = $.extend({},options);
        
        var me = this;
        dayside.ready(function(){
            dayside.editor.filePanel.bind("contextMenu",function(b,e){
                var openEditor = {
                    label: 'Open console',
                    action: function () {
                        me.openConsole(e.path);
                    }
                }

                if (e.node.data("folder")) {
                    e.menu = e.inject(e.menu,'openConsole',openEditor,function (pk,pv,nk,nv) { return pk=="link"; });
                }
            });
        });
    },
                      
    openConsole: function (path) {
        var rel = path.substring(FileApi.root.length);
        if (rel[0]=='/') rel = rel.substring(1);
        var consoleTab = ui.panel({label:"Console: /" + rel,closable:true});
        consoleTab.frame = frame = $("<iframe>")
            .attr("src", FileApi.ajax_url + "?" + $.param({_type:"console",path:path}))
            .css({width: "100%", height: "100%"});
        consoleTab.push(consoleTab.frame);
        
        var id = 'console_'+path.replace(/[^0-9a-zA-Z]/g, "__");
        dayside.editor.mainPanel.addTab(consoleTab,id,"bottom");
        consoleTab.tabPanel.selectTab(consoleTab);
    }
});
    
    
})(teacss.jQuery,teacss.ui);