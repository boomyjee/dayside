var FileApi = window.FileApi = window.FileApi || function () {
    var FileApi = {};
    
    FileApi.ajax_url = '/api';
    FileApi.base_url = "/";
    FileApi.root = "/";
    FileApi.user_cookie = (window.uxcandy) ? window.uxcandy.user_cookie : false;
    FileApi.auth_error = function () {
        alert('Authorization failed');
        throw 'Authorization failed';
        return {};
    }

    FileApi.request = function (type,data,json) {
        var $ = window.jQuery || teacss.jQuery;
        var res = false;
        
        if (data.path) {
            if (data.path.substring(0,4)!="http") {
                var href = location.protocol + "//" +location.host;
                data.path = href + data.path;
            }
        }
        
        $.ajax({
            url: FileApi.ajax_url,
            data: $.extend(data,{user_cookie:FileApi.user_cookie,type:type}),
            async: false,
            type: "POST",
            success: function (answer) {
                res = answer;
                if (res=="auth_error") {
                    return res = FileApi.auth_error(type,data,json);
                }
                try {
                    if (json) {
                        var hash = eval('('+res+')');
                        res = hash;
                    }
                } catch (e) {
                    alert(answer);
                }
            },
            error: function (xhr,data,text) {
                alert(text);
            }
        });
        return res;
    }
        
    FileApi.dir = function (path) {
        return FileApi.request('dir',{path:path},true);
    }
        
    FileApi.file = function (path) {
        return FileApi.request('file',{path:path},false);
    }
        
    FileApi.save = function (path,text) {
        return FileApi.request('save',{path:path,text:text},false);
    }
        
    FileApi.createFile = function (path,file) {
        return FileApi.request('createFile',{path:path,newFile:file},false);
    }

    FileApi.createFolder = function (path,folder) {
        return FileApi.request('createFolder',{path:path,newFolder:folder},false);
    }
        
    FileApi.rename = function (path,name) {
        return FileApi.request('rename',{path:path,name:name},false);
    }
        
    FileApi.remove = function (pathes) {
        return FileApi.request('remove',{pathes:pathes},false);
    }
        
    FileApi.move = function (pathes,dest) {
        return FileApi.request('move',{pathes:pathes,dest:dest},false);
    }
        
    return FileApi;
}();