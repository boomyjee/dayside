teacss.ui.filePanel = (function($){
    return teacss.ui.Panel.extend({},{
        init: function (options) {
            var me = this;
            this._super(options);
            
            var add_sheet = function (opts) {
                if (opts.url) return;
                return orig.call(this,opts);
            }
            if ($.vakata.css.add_sheet!=add_sheet) {
                var orig = $.vakata.css.add_sheet;
                $.vakata.css.add_sheet = add_sheet;
            }
            
            this.tree = $("<div>").css({position:'absolute',left:0,right:0,top:0,bottom:0,overflow:'auto'}).appendTo(this.element);
            this.tree
                .bind("open_node.jstree create_node.jstree clean_node.jstree refresh.jstree",function (e,data) {
                    var obj = data.rslt.obj;
                    var inst = data.inst;
                    obj = !obj || obj == -1 ? inst.get_container().find("> ul > li") : inst._get_node(obj);
                    if(obj === false) { return; }
                    obj.each(function(n,node){
                        if (node.ondragover) return;
                        if (!$(node).data("folder")) return;
                        
                        node.ondragover = function() { return false; };
                        node.ondragleave = function() { return false; };
                        node.ondrop = function(event) {
                            if (me.droppingFile) return;
                            me.droppingFile = true;
                            setTimeout(function(){
                                me.droppingFile = false;
                            });
                            
                            var path = $(node).attr("rel");
                            if (!me.uploadDialog) {
                                me.uploadDialog = teacss.ui.uploadDialog({
                                    jupload: me.options.jupload,
                                    jupload_data: me.options.jupload_data
                                });
                            }
                            
                            if (event && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length) {
                                var files = [];
                                for (var i = 0; i < event.dataTransfer.files.length; i++) {
                                    files.push(event.dataTransfer.files.item(i));
                                }
                                me.uploadDialog.open(path,me.tree,$(node),files);
                            }
                            return false;
                        };            
                    });
                    
                })
                .bind("dblclick.jstree", function (e, data) {
                    var link = $(e.target).closest("a");
                    if (link.length) {
                        var li = link.parent();
                        if (li.data("folder")) {
                            me.tree.jstree("toggle_node",li);
                        } else {
                            if (me.options.onSelect)
                                me.options.onSelect(li.attr("rel"));
                        }
                    }
                })
                .bind("rename.jstree", function(e, data){
                    var path = data.rslt.obj.attr("rel");
                    if (data.rslt.new_name==data.rslt.old_name) return;
                    FileApi.rename(path,data.rslt.new_name,function(answer){
                        var res = answer.error || answer.data;
                        if (res!="ok") {
                            $.jstree.rollback(data.rlbk);
                            alert(res);
                        } else {
                            var rel = path.split("/"); 
                            rel.pop(); rel.push(data.rslt.new_name); 
                            rel = rel.join("/");
                            
                            var obj = data.rslt.obj;
                            obj.attr("rel",rel).attr("id",rel.replace(/[^A-Za-z0-9_-]/g,'_'));
                            
                            $(obj).find("li").each(function(){
                                var sub = $(this).attr("rel");
                                if (sub.substring(0,path.length)==path)
                                    sub = rel + sub.substring(path.length);
                                $(this).attr("rel",sub).attr("id",sub.replace(/[^A-Za-z0-9_-]/g,'_'));
                            });
                        }
                    });
                })
                .bind("delete_node.jstree", function (e,data){
                    var pathes = [];
                    data.rslt.obj.each(function(){
                        pathes.push($(this).attr("rel"));
                    });                        
                    FileApi.remove(pathes,function(answer){
                        var res = answer.error || answer.data;
                        if (res!="ok") {
                            $.jstree.rollback(data.rlbk);
                            alert(res);
                        }
                    });
                })
                .bind("move_node.jstree", function (e,data){
                    var pathes = [];
                    var dest = data.rslt.np.attr("rel");
                    var dest_pathes = [];
                    
                    data.rslt.o.each(function(){
                        var path = $(this).attr("rel");
                        pathes.push(path);
                        var name = path.split("/").pop();
                        dest_pathes.push(dest + "/" + name);
                    });
                    
                    var is_copy = data.args[3];
                    var dest_nodes = is_copy ? data.rslt.oc : data.rslt.o;
                    var func_name = is_copy ? "copy" : "move";
                    
                    if (!is_copy && pathes.length && pathes[0]==dest_pathes[0]) return;
                    var answer = FileApi[func_name](pathes,dest_pathes,function(answer){
                        var res = answer.error || answer.data;
                        if (res!="ok") {
                            $.jstree.rollback(data.rlbk);
                            alert(res);
                        } else {
                            dest_nodes.each(function(){
                                var path = $(this).attr("rel");
                                // save initial name, without "copyN" addon
                                var blank_name;
                                var name = blank_name = path.split("/").pop();
                                var rel = dest + "/" + name;
                                
                                // split to extension and basename because copyN is added in between
                                var parts = name.split(".");
                                var ext = "";
                                if (parts.length>1) ext = "."+parts.pop();
                                var base = parts.join(".");
                                
                                var all_lis = me.tree.find("li");
                                var N = 1;
                                // while name is busy goto next one
                                while (all_lis.filter(function(){return $(this).attr("rel")==rel;}).length>0) {
                                    name = base + "-copy" + (N>1?N:"") + ext;
                                    rel = dest + "/" + name;
                                    N++;
                                }
                                $(this).attr("rel",rel).attr("id",rel.replace(/[^A-Za-z0-9_-]/g,'_'));
                                
                                // if name was busy at least once, correct the copied noed state
                                if (name!=blank_name) {
                                    // rename it
                                    me.tree.jstree('set_text', this, name);
                                    // an resort parent
                                    me.tree.jstree('sort',$(this).parent());
                                }
                                
                                // rename all node children
                                $(this).find("li").each(function(){
                                    var sub = $(this).attr("rel");
                                    if (sub.substring(0,path.length)==path)
                                        sub = rel + sub.substring(path.length);
                                    $(this).attr("rel",sub).attr("id",sub.replace(/[^A-Za-z0-9_-]/g,'_'));
                                });
                            });
                        }
                    });
                })
                .jstree({
                    core: {
                        animation: 100
                    },
                    json_data: {
                        data: function (node,after) {
                            var rel = node==-1 ? FileApi.root.replace(/\/$/,'') : node.attr("rel");
                            FileApi.dir(rel,function(answer){
                                var list, children, data;
                                if (!answer.error) {
                                    data = answer.data;
                                    if (node==-1) {
                                        list = [{
                                            data: {title:"/",icon:'project'},
                                            attr: { rel: rel },
                                            state: "open",
                                            metadata: {folder:true},
                                            children: []
                                        }];
                                        children = list[0].children;
                                    } else {
                                        children = list = [];
                                    }
                                    for (var i=0;i<data.length;i++) {
                                        var item = {data:{}};
                                        item.data.title = data[i].name;
                                        item.attr = { rel: data[i].path };
                                        if (data[i].folder) {
                                            item.data.icon = 'folder';
                                            item.state = "closed";
                                        } else {
                                            var ext = data[i].path.split(".").pop();
                                            if (ext.indexOf('/')!=-1) ext = "";
                                            item.data.icon = 'file '+ext;
                                        }
                                        if (data[i].cls)
                                            item.attr['class'] = data[i].cls;
                                        
                                        item.metadata = data[i];
                                        item.attr.id = data[i].path.replace(/[^A-Za-z0-9_-]/g,'_');
                                        children.push(item);
                                    }
                                    
                                    var e = {data:list,node:node};
                                    me.trigger("json_data",e);
                                    list = e.data;
                                    
                                    after(list);
                                }
                            });
                        }
                    },
                    contextmenu: {
                        select_node: true,
                        items : function (node) {
                            var path = node.attr("rel");
                            var file;
                            var res = {};
                            res["link"] = {label:"Open web location",action:function(){
                                window.open(path);
                            }}

                            res["download"] = { label: 'Download', action: function(e){
                                var array_path = [];
                                var obj = this.data.ui.selected;
                                for (i = 0; i < obj.length; i++) { 
                                    array_path[i] = this.data.ui.selected[i].getAttribute("rel");
                                }
                                window.open(window.FileApi.ajax_url + '?' + $.param({path : array_path, _type: 'download'}));
                            }}                                
                            
                            if (node.data("folder")) {
                                res = $.extend(res,{
                                    "refresh": {label:"Refresh",separator_before:true,action:function(){
                                         me.tree.jstree('refresh',node);
                                    }},
                                    "search": {
                                        label:'Search files',
                                        separator_before: false,
                                        action: function () {
                                            if (!me.searchDialog) {
                                                me.searchDialog = teacss.ui.searchDialog();
                                            }
                                            me.searchDialog.open(path,me.tree,node);                                            
                                        }
                                    },

                                    "upload": {label:"Upload",separator_before:true,action:function(){
                                        if (!me.uploadDialog) {
                                            me.uploadDialog = teacss.ui.uploadDialog({
                                                jupload: me.options.jupload,
                                                jupload_data: me.options.jupload_data
                                            });
                                        }
                                        me.uploadDialog.open(path,me.tree,node);

                                    }},
                                    "create": {
                                        label: 'Create',
                                        separator_before: true,
                                        submenu: {
                                            "createFile": {label:"Create file",action:function(){
                                                if (file = prompt('Enter filename')) {
                                                    FileApi.createFile(path,file,function(answer){
                                                        // refresh
                                                        me.tree.jstree('refresh',node);
                                                    });
                                                }
                                            }},
                                            "createFolder": {label:"Create folder",action:function(){
                                                if (file = prompt('Enter folder name')) {
                                                    FileApi.createFolder(path,file,function(answer){
                                                        // refresh
                                                        me.tree.jstree('refresh',node);
                                                    })
                                                }
                                            }}
                                        }
                                    }
                                });
                            }
                            
                            if (path!=FileApi.root) {
                                if (path.split(".").pop()=='zip') res['unzip'] = {label:"Unpack",action:function(){
                                    if (confirm('Unpack to current folder?')) {
                                        FileApi.unpack(path,function(answer){
                                            me.tree.jstree("refresh",node.parent().parent());
                                        });
                                    }
                                }}
                                
                                res["rename"] = {label: "Rename",separator_before:true, action:function(){
                                    me.tree.jstree("rename");
                                }}
                                res["delete"] = {label: "Delete",action:function(){
                                    if (confirm('Sure to delete files?'))
                                        me.tree.jstree("remove");
                                }}
                            }
                                
                            var data = {
                                menu: res,
                                path: path,
                                node: node,
                                inject: function(object, newKey, newVal, fn, bind){
                                    var prevKey=null, prevVal=null, inserted=false, newobject={};
                                    for(var currKey in object){
                                        if (object.hasOwnProperty(currKey)){
                                            var currVal = object[currKey];
                                            if( !inserted && fn.call(bind, prevKey, prevVal, currKey, currVal) ){
                                                newobject[newKey] = newVal;
                                                inserted=true;
                                            }
                                            newobject[currKey] = currVal;
                                            prevKey = currKey;
                                            prevVal = currVal;
                                        } 
                                    }
                                    if(!inserted) newobject[newKey] = newVal;
                                    return newobject;
                                }
                            };
                            me.trigger("contextMenu",data);
                            return data.menu;
                        }
                    },
                    themes: {
                        url: FileApi.base_url+"dev/editor/lib/jstree/themes/default/style.css"
                    },
                    hotkeys: {
                        "return": function () {
                            var o = this.data.ui.hovered || this.data.ui.last_selected;
                            if(o && o.length) {
                                var li = $(o[0]);
                                if (li.data("folder")) {
                                    me.tree.jstree("toggle_node",li);
                                } else {
                                    if (me.options.onSelect)
                                        me.options.onSelect(li.attr("rel"));
                                }
                            }
                            return false;                            
                        },
                        "del": function () {
                            if (confirm('Sure to delete files?')) {
                                me.tree.jstree("remove");
                            }
                        }
                    },
                    crrm: {
                        move: {
                            check_move: function (m) {
                                var valid = true;
                                var parent = false;
                                m.o.each(function(){
                                    var rel = $(this).attr("rel").split("/");
                                    rel.pop();rel=rel.join("/");
                                    if (rel=="") rel = "/";
                                    if (!parent) 
                                        parent = rel;
                                    else
                                        if (parent!=rel) valid = false;
                                });
                                var dest = m.np.attr("rel");
                                if (!valid) return false;
                                if (dest==undefined) return false;
                                return true;
                            }
                        }
                    },
                    sort: function (a,b) {
                        var fa = $(a).data("folder")
                        var fb = $(b).data("folder");
                        if (fa==fb) {
                            return this.get_text(a) > this.get_text(b) ? 1 : -1;
                        } else {
                            return fb ? 1 : -1;
                        }
                    },
                    plugins : ["themes","json_data","ui","contextmenu","storage","hotkeys","dnd","crrm","sort"]
                })
        }
    });
})(teacss.jQuery);