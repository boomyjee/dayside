var FileApi = window.FileApi = window.FileApi || function () {
    var FileApi = {};
    
    FileApi.ajax_url = '/api';
    FileApi.root = "/";
    FileApi.auth_error = function () {
        alert('Authorization failed');
        throw 'Authorization failed';
        return {};
    }

    if (teacss.ui.eventTarget)
        FileApi.events = new teacss.ui.eventTarget;

    FileApi._async = true;
    
    FileApi.requestCounter = 0;
    FileApi.request = function (type,data,json,callback) {
        var $ = window.jQuery || teacss.jQuery;
        var requestID = ++FileApi.requestCounter;
        
        if (data.path) {
            if (data.path.substring(0,4)!="http") {
                var href = location.protocol + "//" +location.host;
                data.path = href + data.path;
            }
        }
        
        $.ajax({
            url: FileApi.ajax_url,
            data: $.extend(data,{type:type,_type:type}),
            async: this._async,
            type: "POST",
            success: function (answer) {
                FileApi.requestID = requestID;
                res = {data:answer};
                if (answer=="auth_error" || answer=="auth_empty") {
                    return res = FileApi.auth_error(answer,type,data,json,callback);
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
    }
        
    FileApi.cache = {};
        
    FileApi.dir = function (path,callback) {
        FileApi.request('dir',{path:path},true,callback);
    }
        
    FileApi.file = function (path,callback) {
        FileApi.request('file',{path:path},false,function(answer){
            if (!answer.error) FileApi.cache[path] = answer.data;
            if (callback) callback(answer);
        });
    }
        
    FileApi.save = function (path,text,callback) {
        FileApi.request('save',{path:path,text:text},false,function(answer){
            if (!answer.error && answer.data=="ok") FileApi.cache[path] = text;
            if (callback) callback(answer);
        });
    }
        
    FileApi.createFile = function (path,file,callback) {
        FileApi.request('createFile',{path:path,newFile:file},false,function(answer){
            if (!answer.error && answer.data=="ok") FileApi.cache[path] = "";
            if (callback) callback(answer);
        });
    }

    FileApi.createFolder = function (path,folder,callback) {
        FileApi.request('createFolder',{path:path,newFolder:folder},false,callback);
    }
        
    FileApi.rename = function (path,name,callback) {
        FileApi.request('rename',{path:path,name:name},false,function(answer){
            if (!answer.error && answer.data=="ok") {
                var new_path = path.split("/"); 
                new_path.pop();
                new_path.push(name);
                new_path = new_path.join("/");
                if (new_path!=path) {
                    FileApi.cache[new_path] = FileApi.cache[path];
                    delete FileApi.cache[path];
                    
                    if (FileApi.events) 
                        FileApi.events.trigger("rename",{path:path,new_path:new_path});
                }
            }
            if (callback) callback(answer);
        });
    }
        
    FileApi.remove = function (pathes,callback) {
        FileApi.request('remove',{pathes:pathes},false,function(answer){
            if (!answer.error && answer.data=="ok") {
                for (var i=0;i<pathes.length;i++) {
                    delete FileApi.cache[pathes[i]];
                    if (FileApi.events) 
                        FileApi.events.trigger("remove",{path:pathes[i]});
                }
            }
            if (callback) callback(answer);
        });
    }
        
    FileApi.moveOrCopy = function (pathes,dest,is_copy,callback) {
        var type = is_copy ? "copy" : "move";
        FileApi.request(type,{pathes:pathes,dest:dest},false,function(answer){
            if (!answer.error && answer.data=="ok") {
                var moving = [];
                var moving_dest = [];
                for (var path in FileApi.cache) {
                    for (var i=0;i<pathes.length;i++) {
                        if (path.indexOf(pathes[i])===0) {
                            moving.push({path:path,base:pathes[i],dest_base:dest[i]});
                            break;
                        }
                    }
                }
                for (var i=0;i<moving.length;i++) {
                    var path = moving[i].path;
                    var base = moving[i].base;
                    var new_base = moving[i].dest_base;
                    var new_path = new_base + path.substring(base.length);
                    
                    if (new_path!=path) {
                        FileApi.cache[new_path] = FileApi.cache[path];
                        if (!is_copy) delete FileApi.cache[path];
                        if (FileApi.events) 
                            FileApi.events.trigger(type,{path:path,new_path:new_path});
                    }
                }
            }
            if (callback) callback(answer);
        });
    }
        
    FileApi.move = function (pathes,dest,callback) {
        FileApi.moveOrCopy(pathes,dest,false,callback);
    }
        
    FileApi.copy = function (pathes,dest,callback) {
        FileApi.moveOrCopy(pathes,dest,true,callback);
    }
        
    FileApi.batch = function (path,callback) {
        FileApi.request('batch',{path:path},true,function(answer){
            if (!answer.error) {
                for (var path in answer.data) {
                    var info = answer.data[path];
                    if (!info.directory)
                        FileApi.cache[path] = info.content;
                }
            }
            if (callback) callback(answer);
        });
    }
        
    FileApi.unpack = function (path,callback) {
        FileApi.request('unpack',{path:path},false,function(answer){
            if (callback) callback(answer);
        });        
    }
    
    FileApi.getCSRFToken = function() {
        return (document.cookie.match('(^|; )editor_csrf=([^;]*)') || [])[2] || '';
    }
        
    for (var key in FileApi) {
        var f = FileApi[key];
        if (f && f.call && f.apply) {
            FileApi[key+"Sync"] = (function(f){
                return function () {
                    FileApi._async = false;
                    f.apply(FileApi,arguments);
                    FileApi._async = true;
                };
            })(f);
        }
    }
    
    return FileApi;
}();