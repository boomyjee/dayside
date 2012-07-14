teacss.jQuery(function ($){
    var root = ("http://"+location.host+location.pathname).replace("index.php","").replace(/\/$/,'');
    FileApi.root = root.substring(0,root.lastIndexOf('/'));
    FileApi.ajax_url = root + "/server/demo.php";
    FileApi.auth_error = function (type,data,json) {
        var password = prompt('Enter password');
        return FileApi.request(type,$.extend(data||{},{password:password}),json);
    }

    var editor = new teacss.ui.editorPanel({
        jupload: root + "/server/assets/jupload/jupload.jar"
    });
});
