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

            var list_done_cache = {}
            function isListDone(list_id,cb) {
                if (list_id in list_done_cache) {
                    cb(list_done_cache[list_id]);
                } else {
                    Trello.get(
                        '/lists/' + list_id,
                        function (list){
                            list_done_cache[list_id] = list.name.indexOf("Done")!=-1;
                            cb(list_done_cache[list_id]);
                        },
                        function () {
                            list_done_cache[list_id] = false;
                            cb(list_done_cache[list_id]);
                        }
                    );
                }
            }

            var done = branches.length;
            var branchesToDelete = [];

            function getTrelloInfo() {
                branches.forEach(function(branch){
                    Trello.get(
                        '/cards/' + branch,
                        function (task) {
                            isListDone(task.idList,function(listDone){
                                if (listDone) {
                                    branchesToDelete.push(branch);
                                }
                                cardReady();
                            });
                        },
                        function () {
                            cardReady();
                        }
                    );
                });    

                function cardReady() {
                    done--;
                    if (done==0) showConfirm();
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
