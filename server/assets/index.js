teacss.jQuery(function ($){
    
    var root = ("http://"+location.host+location.pathname).replace("index.htm","").replace(/\/$/,'');
    FileApi.root = root.substring(0,root.lastIndexOf('/'));
    FileApi.ajax_url = root + "/server/demo.php";
    FileApi.auth_error = function (type,data,json) {
        var password = prompt('Enter password');
        return FileApi.request(type,$.extend(data||{},{password:password}),json);
    }

    var editor = new teacss.ui.editorPanel({
        jupload: root + "/server/assets/jupload/jupload.jar"
    });
    
    editor.filePanel.bind("contextMenu", function (own,data){
        if (data.node.data("folder"))
            data.menu = data.inject(
                data.menu,
                "console",
                {
                    label: 'Open console',
                    action: function () {
                        var tab = new ShellTab({path:data.path,closable:true});
                        editor.tabs2.addTab(tab);
                        editor.tabs2.selectTab(tab);
                    }
                },
                function(pk,pv,nk,nv) {
                    if (pk=='link') return true;
                }
            );
    });
});
