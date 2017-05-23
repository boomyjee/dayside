(function ($,ui) {


dayside.plugins.branch_remover = $.Class.extend({
    init: function (options) {
        this.options = $.extend({},options);
        
        var me = this;
        dayside.ready(function(){
            dayside.editor.filePanel.bind("contextMenu",function(b,e){
                if (e.node.data("folder") && e.node.find(">ul>li[rel$='/.git']").length) {
                    var menuItem = {
                        label: 'Clear git branches',
                        action: function () {
                            me.showDialog(e.path);
                        }
                    }
                    e.menu = e.inject(e.menu,'clearGitBranches',menuItem,function (pk,pv,nk,nv) { return pk=="link"; });
                }
            });
        });
    },
                      
    showDialog: function (path) {
        FileApi.request('git_get_branches',{path:path},true,function(answer) {
            var branches = answer.data;

            Trello.authorize({
                type: "popup",
                name: "Trello dashboard",
                scope: {
                    read: true,
                    write: false
                },
                expiration: "never",
                success: getTrelloInfo,
                error: function () {
                    alert("Can't do trello auth");
                }
            });

            var list_name_cache = {}
            function getListName(list_id,cb) {
                if (list_id in list_name_cache) {
                    cb(list_name_cache[list_id]);
                } else {
                    Trello.get(
                        '/lists/' + list_id,
                        function (list){
                            list_name_cache[list_id] = list.name
                            cb(list_name_cache[list_id]);
                        },
                        function () {
                            list_name_cache[list_id] = "error";
                            cb(list_name_cache[list_id]);
                        }
                    );
                }
            }

            var branchesToDelete = [];

            function getTrelloInfo() {
                if (branches.length) {
                    var branch = branches[0];
                    Trello.get(
                        '/cards/' + branch,
                        function (task) {
                            getListName(task.idList,function(listName){
                                console.log(branches.length,branch,listName,task);
                                if (listName.indexOf("Done")!=-1) {
                                    branchesToDelete.push(branch);
                                }
                                cardReady();
                            });
                        },
                        function (e) {
                            console.log(branches.length,branch,'card error',e.responseText);
                            if (e.responseText=='invalid id') {
                                branchesToDelete.push(branch);
                            }
                            cardReady();
                        }
                    );


                } else {
                    showConfirm();
                }

                function cardReady() {
                    branches.shift();
                    getTrelloInfo();
                }
            }

            function showConfirm() {
                if (branchesToDelete.length==0) alert("Веток для удаления не выявлено");
                else if (confirm("Действительно желаете удалить следущие ветки\n" + branchesToDelete.join("\n"))) {
                    FileApi.request('git_delete_branches',{path: path, branches: branchesToDelete},true,function(answer) {
                        alert("Ветки успешно удалены!")
                    })
                }
            }
        }
    )}   
    
});
    
    
})(teacss.jQuery,teacss.ui);
