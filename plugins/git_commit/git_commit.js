(function ($,ui) {

dayside.plugins.git_commit = $.Class.extend({
    init: function (options) {
        this.options = $.extend({},options);
        
        var me = this;
        dayside.ready(function(){
            dayside.editor.filePanel.bind("contextMenu",function(b,e){
                var menuItem = {
                    label: 'Git commit',
                    action: function () {
                        me.openTab(e.path);
                    }
                }

                if (e.node.data("folder")) {
                    e.menu = e.inject(e.menu,'openGitCommit',menuItem,function (pk,pv,nk,nv) { return pk=="link"; });
                }
            });
        });
    },
    
    initTabHandlers: function (tab) {
        $(tab.element).on("click","td.filename",function(e){  
            $(this).parent('tr.file').toggleClass('active');
            $(this).parent('tr.file').next("tr.diff_html").toggle();
        });

        $(tab.element).on("click","input.checkbox",function(e){
            var chbox = this;
            $.ajax({
                type: "POST",
                url: tab.ajax_url,
                dataType: "json",
                data: {
                    'ajax_action': 'change_staged',
                    'stage': chbox.checked ? 1:0,
                    'file': $(this).val(),
                    'status_hash': tab.element.find("[name=status_hash]").val()
                },
                success: function(data) {                 
                    if (!data.error) {
                        tab.element.find("[name=status_hash]").val(data.status_hash);
                        $(chbox).parents("tr").find('td.state').text(data.state);                    
                    } else {
                        tab.element.find("div.error").text(data.error);
                        chbox.checked = !chbox.checked;    
                    }
                }
            });
        });
        
        $(tab.element).on("click","tr.insert",function(e){
            var line = $(this).find('.number_add').text();
            var filename = $(this).closest('table.delta').data('filename');
            console.log(tab);
            var tab = dayside.editor.selectFile(tab.path+"/"+filename);

            function positionCursor() {
                tab.editor.focus();
                tab.editor.setCursor({line:line-1,ch:0},{scroll:true});
            }

            if (tab.editor) {
                positionCursor();
            } else {
                tab.bind("editorCreated",function(){
                    positionCursor();
                    tab.saveState();
                });
            }            
        });
        
        $(tab.element).on("click",".buttons button",function(e){
            e.preventDefault();
            $.ajax({
                type: "POST",
                data: $(this).parents("form").serialize()+"&action="+$(this).val(),
                url: tab.ajax_url,
                success: function (html) {
                    tab.element.html(html);
                }
            });
        });
    },
                      
    openTab: function (path) {
        var rel = path.substring(FileApi.root.length);
        if (rel[0]=='/') rel = rel.substring(1);
        
        var ajax_url = FileApi.ajax_url + "?" + $.param({_type:"git_commit",path:path});
        var tab = ui.panel({label:"Commit: /" + rel,closable:true});
        
        tab.element.addClass('git-commit-tab');
        tab.ajax_url = ajax_url;
        tab.path = path;

        this.initTabHandlers(tab);
        
        $.ajax({
            url: ajax_url,
            type: "POST",
            success: function(html) {
                tab.element.html(html);
            }
        });
        
        var id = 'git_commit_'+path.replace(/[^0-9a-zA-Z]/g, "__");
        dayside.editor.mainPanel.addTab(tab,id,"center");
        tab.tabPanel.selectTab(tab);
    }
});
    
    
})(teacss.jQuery,teacss.ui);