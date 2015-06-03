(function ($,ui) {

dayside.plugins.git_commit = $.Class.extend({
    init: function (options) {
        this.options = $.extend({},options);        
        var me = this;        
        dayside.ready(function(){
            dayside.editor.filePanel.bind("contextMenu",function(b,e){
                if (e.node.data("folder") && e.node.find(">ul>li[rel$='/.git']").length) {
                    var menuItem = {
                        label: 'Git commit',
                        action: function () {
                            me.openTab(e.path);
                        }
                    }
                    e.menu = e.inject(e.menu,'openGitCommit',menuItem,function (pk,pv,nk,nv) { return pk=="link"; });
                }
            });
        });
    },
    
    initTabHandlers: function (tab) { 
        function reloadTab(data,resType,cb) {
            
            if($.isPlainObject(data)){   
                $.extend(data,{status_hash:tab.element.find("#status_hash").val()});
            }
            if (resType!='json') tab.element.empty();
            
            $.ajax({
                url: tab.ajax_url,
                type: "POST",
                dataType: resType,                
                data: data,                                
                success: function (res) {
                    if (resType!='json') tab.element.html(res);
                    if (resType=='json' && res.status_hash) {
                        tab.element.find("[name=status_hash]").val(res.status_hash);
                    }
                    if (cb) cb(res);
                }
            });
        }
        
        function reloadCodeTab(one_tab) {
            FileApi.file(one_tab.options.file,function (answer){
                if (!one_tab.editor) return;
                if(one_tab.editor.getValue()==FileApi.cache[one_tab.options.file]) return;

                var stateData = dayside.storage.get("codeTabState") || {};
                var tab_state = stateData[one_tab.options.file];

                one_tab.editor.setValue(FileApi.cache[one_tab.options.file]); 

                stateData[one_tab.options.file] = tab_state;
                dayside.storage.set("codeTabState",stateData);

                one_tab.restoreState();
                one_tab.editorChange();
            });
        }        
        
        function reloadFileTab() {
            var tree = window.dayside.editor.filePanel.tree;
            var node = tree.find("li[rel]").each(function(){
                if ($(this).attr("rel")==tab.path) tree.jstree('refresh',$(this));
            });
        }
        
        function tpl(one_status) {
            return $("<tr class='file ui-widget-content ui-state-default'>").attr("data-file", one_status.file).attr("data-status", JSON.stringify(one_status)).append(
                $("<td class='checkbox'>").append(
                    $("<input class='checkbox' type='checkbox'>").attr("checked", one_status.staged ? true : false).addClass(one_status.partial ? 'partial' : '')
                ),
                $("<td class='state'>").text(one_status.state),
                $("<td class='filename'>").text(one_status.old_file ? one_status.old_file+" -> "+one_status.file : one_status.file),
                $("<td class='checkout'>").append(
                    $("<button class='checkout_file ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-dialog-titlebar-close'>").append(
                        $("<span class='ui-button-icon-primary ui-icon ui-icon-closethick'>")
                    )
                ),
                $("<td class='empty'>")
            ).add(
                $("<tr class='diff_html'>").html(one_status.diff)
            );
        }
        
        // клик по любой кнопке в шапке tab вызов для неё action и перерисовка всей формы
        $(tab.element).on("click",".buttons button",function(e){            
            e.preventDefault();
            reloadTab($(this).parents("form").serialize()+"&action="+$(this).val());
        });
        
        // только в working tree при клике на строку в diff-е переход и фокусировка на эту же строку в оригинальном файле 
        $(tab.element).on("click","tr.insert, tr.context",function(e){

            if($(tab.element).find(".view_type").data("value")!='working_tree' || $(this).hasClass("partial_staged")){
                return;
            }
            
            var line = $(this).find('.number_add').text();
            var filename = $(this).parents('table.delta').data('filename');

            var new_tab = dayside.editor.selectFile(tab.path+"/"+filename);

            function positionCursor() {
                new_tab.editor.focus();
                new_tab.editor.setCursor({line:line-1,ch:0},{scroll:true});
            }

            if (new_tab.editor) {
                positionCursor();
            } else {
                new_tab.bind("editorCreated",function(){
                    positionCursor();
                    new_tab.saveState();
                });
            } 

        });      
        
        // изменение состояния файла - staged/unstaged
        $(tab.element).on("click","input.checkbox",function(e){

            var chbox = this;
                      
            reloadTab(
                {
                    ajax_action: 'change_staged',
                    stage_file: chbox.checked ? 1 : 0,
                    file: $(this).parents("tr.file").data("file")
                },
                'json',
                function(data) {
                    if (data.error) {
                        tab.element.find(".ui-state-error").text(data.error);
                        chbox.checked = !chbox.checked; 
                        return;
                    }
                    $(chbox).removeClass("partial");
                    
                    if(data.extra_status && data.extra_status.length>1) {
                        var tr_file = $(chbox).parents("tr.file");                        
                        tr_file.next().after(tpl(data.extra_status[1]));
                        tr_file.next().andSelf().replaceWith(tpl(data.extra_status[0]));
                    } 
                    else if(data.extra_status && data.extra_status.length==1) {
                        $("tr.file").each(function(){
                            var filename = $(this).data("file");
                            if (filename==data.extra_status[0].file){
                                $(this).next().andSelf().remove();
                            }
                            if (filename==data.extra_status[0].old_file){
                                $(this).next().andSelf().replaceWith(tpl(data.extra_status[0]));
                            }
                        });
                    }
                    else {
                        $(chbox).parents("tr.file").find('td.state').text(data.state);
                    }
                }
            );
        });
        
        // откат изменений(checkout) файла
        $(tab.element).on("click",".checkout_file",function(e){
            var $tr = $(this).parents("tr.file");
            var file_status = $tr.data("status");
            e.preventDefault();
            reloadTab(
                {
                    ajax_action: 'checkout_file',
                    file: file_status.file
                },
                'json',
                function(data) { 
                    if(data.error){
                        tab.element.find(".ui-state-error").text(data.error);
                        return;
                    }            
                    $tr.next().andSelf().remove();
                    
                    reloadFileTab();
                    $(teacss.ui.codeTab.tabs).each( function(key, one_tab) {
                        if (one_tab.options.file==tab.path + '/' + file_status.file) {
                            if (file_status.old_file) {
                                one_tab.options.file = tab.path + '/' + file_status.old_file;
                                var caption = file_status.old_file.split("/").pop(); 
                                one_tab.navElement.find("a").text(caption);
                            }
                            reloadCodeTab(one_tab);
                        }
                    });
                }
            );
        }); 
        
        // переключение view_type
        $(tab.element).on("mousedown",".view_type",function(){
            reloadTab({
                action: $(".view_type").data("value")=="working_tree" ? 'history' : 'working_tree'
            });
        });         
        
        // переключение branch-а
        $(tab.element).on("mousedown",".branch",function(){
            
            var $this = $(this);
            var view_type = $(".view_type").data("value");
            
            if (view_type=="working_tree") {
                var changed = false;
                $(teacss.ui.codeTab.tabs).each(function(key, one_tab) { changed = changed || one_tab.changed; });
                if (changed) {
                    tab.element.find(".ui-state-error").text("Save changed files before switching branch");
                    tab.element.find(".button-select-panel").removeClass("show");
                    return;
                }
            }            

            reloadTab(
                {
                    action: view_type=='working_tree' ? 'switch_branch' : 'history',
                    selected_branch: $(this).data("value")
                },
                false,
                function (){
                    if (view_type!="working_tree") return;
                    
                    reloadFileTab();
                    $(teacss.ui.codeTab.tabs).each( function(key, one_tab) {
                        reloadCodeTab(one_tab);
                    });
                }
            );
            
           
        });  
        
        // переключение commit-а
        $(tab.element).on("mousedown",".commit",function(){
            if ($(this).is(".selected")) return;
            reloadTab({
                action: 'history',
                selected_branch: $(".branch.selected").data("value"),
                selected_commit: $(this).data("value")
            });
        }); 
        
        // выполнение amend
        $(tab.element).on("mousedown",".amend",function(){
            reloadTab({
                action: 'amend',
                message: $("input[name=commit_message]").val()
            });
        });
        
        // cкрытие выпадающего меню клику в другом месте
        $(document).mousedown(function(){
            tab.element.find(".button-select-panel.show").removeClass("show");
        });
        
        // показывать/скрывать выпадающее меню для branch-ей и commit-ов
        $(tab.element).on("mousedown",".branch_list, .commit_list, .commit_select_menu",function(e){
            var panel = $(this).next(".button-select-panel");
            var show = panel.hasClass("show");
            tab.element.find(".button-select-panel.show").removeClass("show");
            panel.toggleClass("show",!show);
            e.stopPropagation();
        });
        
        // hover на кнопке делает её более контрастной
        $(tab.element).on("hover",".ui-button:not(.active)",function(){            
            $(this).toggleClass("ui-state-hover");
        });
        
        // показывать/скрывать diff 
        $(tab.element).on("click","td.filename",function(){  
            
            var $tr = $(this).parent('tr.file')
            var $tr_diff_html = $tr.next("tr.diff_html");
            
            var commit_sha1 = '',commit_sha2 = '';
            
            if ($(".view_type").data("value")=='history') {
                commit_sha2 = $(".commit.selected").data("value");
                commit_sha1 = commit_sha2+"^";
            }
            
            if ($tr_diff_html.is(":empty")) {
                reloadTab(
                    {
                        ajax_action: 'diff',
                        one_status: $tr.attr("data-status"),
                        commit_sha1: commit_sha1,
                        commit_sha2: commit_sha2
                    },
                    'json',
                    function(data) { 
                        if(data.error){
                            tab.element.find(".ui-state-error").text(data.error);
                            return;
                        } else {
                            $tr_diff_html.html(data.diff_html);
                        }
                    }
                );            
                
            }
            
            $tr.toggleClass('active');
            $tr_diff_html.toggle();             
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