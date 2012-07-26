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
        var callback = data.callback;
        data.callback = false;
        
        $.ajax({
            url: FileApi.ajax_url,
            data: $.extend(data,{user_cookie:FileApi.user_cookie,type:type}),
            async: callback ? true : false,
            type: "POST",
            success: function (answer) {
                res = {data:answer};
                if (answer=="auth_error") {
                    return res = FileApi.auth_error(type,data,json);
                }
                try {
                    if (json) {
                        var hash = eval('('+answer+')');
                        res = {data:hash};
                    }
                } catch (e) {
                    alert(answer);
                    res = {error:answer};
                }
                if (callback) callback(res);
            },
            error: function (xhr,answer,text) {
                alert(text);
                res = {error:text};
                if (callback) callback(res);
            }
        });
        return res;
    }
        
    FileApi.dir = function (path,callback) {
        return FileApi.request('dir',{path:path,callback:callback},true);
    }
        
    FileApi.file = function (path,callback) {
        return FileApi.request('file',{path:path,callback:callback},false);
    }
        
    FileApi.save = function (path,text,callback) {
        return FileApi.request('save',{path:path,text:text,callback:callback},false);
    }
        
    FileApi.createFile = function (path,file,callback) {
        return FileApi.request('createFile',{path:path,newFile:file,callback:callback},false);
    }

    FileApi.createFolder = function (path,folder,callback) {
        return FileApi.request('createFolder',{path:path,newFolder:folder,callback:callback},false);
    }
        
    FileApi.rename = function (path,name,callback) {
        return FileApi.request('rename',{path:path,name:name,callback:callback},false);
    }
        
    FileApi.remove = function (pathes,callback) {
        return FileApi.request('remove',{pathes:pathes,callback:callback},false);
    }
        
    FileApi.move = function (pathes,dest,callback) {
        return FileApi.request('move',{pathes:pathes,dest:dest,callback:callback},false);
    }
        
    return FileApi;
}();