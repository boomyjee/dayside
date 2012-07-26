window.dayside = window.dayside || (function(){
    
    var dir = "/dayside";
    var $ = teacss.jQuery;
    $("script").each(function(){
        var src = $(this).attr("src");
        if (!src) return;
        var res;
        if (res = src.match(/^(.*?)client\/src\/app\.js$/)) dir = res[1];
        if (res = src.match(/^(.*?)client\/dayside\.js$/)) dir = res[1];
    });
    
    if (typeof(tea)!="undefined") {
        if (tea.path) {
            if (res = tea.path.match(/^(.*?)client\/src\/app\.js$/)) dir = res[1];
            if (res = tea.path.match(/^(.*?)client\/dayside\.js$/)) dir = res[1];
        }
    }
    
    var link = document.createElement("a");
    link.href = dir; 
    dir = link.href.replace(/\/$/,'');
    
    var dayside = function (options) {
        if (dayside.editor) return;
        var defaults = {
            root: dir.substring(0,dir.lastIndexOf('/')),
            ajax_url: dir + "/server/demo.php",
            jupload_url: dir + "/server/assets/jupload/jupload.jar",
            auth_error: function (type,data,json,callback) {
                var password = prompt('Enter password');
                return FileApi.request(type,$.extend(data||{},{password:password}),json,callback);
            },
            preview: true
        }
        dayside.options = options = $.extend(defaults,options);
        
        teacss.jQuery(function ($){
            FileApi.root = options.root;
            FileApi.ajax_url = options.ajax_url;
            FileApi.auth_error = options.auth_error;
            
            var editor = window.dayside.editor = new teacss.ui.editorPanel({
                jupload: options.jupload_url
            });
            
            for (var i=0;i<dayside.plugins.length;i++)
                dayside.plugins[i].call(dayside);
        });        
    }
    dayside.plugins = [];
    dayside.url = dir;
    return dayside;
})();