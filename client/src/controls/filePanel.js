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
                    var res = FileApi.rename(path,data.rslt.new_name);
                    if (res!="ok") {
                        $.jstree.rollback(data.rlbk);
                        alert(res);
                    } else {
                        var rel = path.split("/"); 
                        rel.pop(); rel.push(data.rslt.new_name); 
                        rel = rel.join("/");
                        data.rslt.obj.attr("rel",rel).attr("id",rel.replace(/[^A-Za-z0-9_-]/g,'_'));
                    }
                })
                .bind("remove.jstree", function (e,data){
                    if (confirm('Sure to delete files?')) {
                        var pathes = [];
                        data.rslt.obj.each(function(){
                            pathes.push($(this).attr("rel"));
                        });                        
                        var res = FileApi.remove(pathes);
                        if (res=="ok") {
                            me.tree.jstree("refresh",'#'+data.rslt.parent.attr("id"));
                            return;
                        }
                    }
                    $.jstree.rollback(data.rlbk);
                    
                })
                .bind("move_node.jstree", function (e,data){
                    var pathes = [];
                    data.rslt.o.each(function(){
                        pathes.push($(this).attr("rel"));
                    });
                    var dest = data.rslt.np.attr("rel");
                    var res = FileApi.move(pathes,dest);
                    if (res!="ok") {
                        alert(res);
                    }
                    me.tree.jstree("refresh",-1);
                })
                .jstree({
                    core: {
                        animation: 100
                    },
                    json_data: {
                        data: function (node,after) {
                            var list, children,data;
                            if (node==-1) {
                                data = FileApi.dir(FileApi.root);
                                list = [{
                                    data: {title:"/",icon:'project'},
                                    attr: { rel: FileApi.root },
                                    state: "open",
                                    metadata: {folder:true},
                                    children: []
                                }];
                                children = list[0].children;
                            } else {
                                data = FileApi.dir(node.attr("rel"));
                                children = list = [];
                            }
                            for (var i=0;i<data.length;i++) {
                                var node;
                                node = {data:{}};
                                node.data.title = data[i].name;
                                node.attr = { rel: data[i].path };
                                if (data[i].folder) {
                                    node.data.icon = 'folder';
                                    node.state = "closed";
                                } else {
                                    var ext = data[i].path.split(".").pop();
                                    if (ext.indexOf('/')!=-1) ext = "";
                                    node.data.icon = 'file '+ext;
                                }
                                node.metadata = data[i];
                                node.attr.id = data[i].path.replace(/[^A-Za-z0-9_-]/g,'_');
                                children.push(node);
                            }
                            after(list);
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
                                
                            if (node.data("folder")) {
                                res = $.extend(res,{
                                    "refresh": {label:"Refresh",separator_before:true,action:function(){
                                         me.tree.jstree('refresh',node);
                                    }},
                                    "upload": {label:"Upload",separator_before:true,action:function(){
                                        if (!me.uploadPanel) {
                                            if (me.options.jupload) {
                                                
                                                var formdata = me.options.jupload_data || {};
                                                formdata = $.extend(formdata,{path:FileApi.root,type:"upload"});
                                                var inputs = "";
                                                for (var key in formdata)
                                                    inputs += '<input type="hidden" name="'+key+'" value="'+formdata[key]+'">';
                                                me.uploadPanel = $([
                                                    '<div>',
                                                        '<form id="uploadForm">',
                                                            inputs,
                                                        '</form>',
                                                        '<APPLET',
                                                        '        CODE="wjhk.jupload2.JUploadApplet"',
                                                        '        NAME="JUpload"',
                                                        '        ARCHIVE="'+me.options.jupload+'"',
                                                        '        WIDTH="640"',
                                                        '        HEIGHT="300"',
                                                        '        MAYSCRIPT="true"',
                                                        '        ALT="The java pugin must be installed.">',
                                                        '    <param name="postURL" value="'+FileApi.ajax_url+'" />',
                                                        '    <param name="lookAndFeel" value="system" />',
                                                        '    <param name="formdata" value="uploadForm" />',
                                                        '    <param name="afterUploadURL" value="javascript:window.afterJUpload()" />',
                                                        '    <param name="showLogWindow" value="false" />',
                                                        '    <param name="debugLevel" value="100" />',
                                                        '    Java 1.5 or higher plugin required.',
                                                        '</APPLET>',
                                                    '</div>'
                                                ].join("\n"));
                                            } else {
                                                me.uploadPanel = $("<div>Set jupload param in options</div>");
                                            }
                                            me.uploadPanel.dialog({
                                                autoOpen: false,
                                                resizable: false,
                                                width: 668, height: 350,
                                                title: "Upload files",
                                                create: function(event, ui){
                                                    $(this).parent().appendTo(teacss.ui.layer);
                                                }
                                            });
                                        }
                                        me.uploadPanel.find("input[name=path]").val(path);
                                        me.uploadPanel.dialog("open");
                                        window.afterJUpload = function () {
                                            me.tree.jstree('refresh',node);
                                        }
                                    }},
                                    "create": {
                                        label: 'Create',
                                        separator_before: true,
                                        submenu: {
                                            "createFile": {label:"Create file",action:function(){
                                                if (file = prompt('Enter filename')) {
                                                    FileApi.createFile(path,file)
                                                    // refresh
                                                    me.tree.jstree('refresh',node);
                                                }
                                            }},
                                            "createFolder": {label:"Create folder",action:function(){
                                                if (file = prompt('Enter folder name')) {
                                                    FileApi.createFolder(path,file)
                                                    // refresh
                                                    me.tree.jstree('refresh',node);
                                                }
                                            }}
                                        }
                                    }
                                });
                            }

                            res["rename"] = {label: "Rename",separator_before:true, action:function(){
                                me.tree.jstree("rename");
                            }}
                            res["delete"] = {label: "Delete",action:function(){
                                me.tree.jstree("remove");
                            }}

                            if (path=='/') delete res['delete'];
                            
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
                                if (parent==dest) return false;
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