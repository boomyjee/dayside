dayside.plugins.pixlr = teacss.jQuery.Class.extend({
    init: function (options) {
        var me = this;
        this.options = teacss.jQuery.extend({
            preload: false,
            callback_url: function (dir,file) {
                var params = {
                    auth_token: teacss.jQuery.cookie('editor_auth'),
                    dir: dir,
                    _type: 'pixlr'
                };
                return teacss.path.absolute(FileApi.ajax_url)+"?"+teacss.jQuery.param(params);
            }
        },options);
        
        dayside.ready(function () {
            // context menu item
            dayside.editor.filePanel.bind("contextMenu",function(b,e){
                if (e.node.data("folder")) {
                    e.menu.create.submenu.createImage = {
                        label: 'Create Pixlr image',
                        action: function () {
                            me.openForDir(e.path.replace(/\/+$/,'')+"/");
                        }
                    }
                }
            });
            
            // link in codeTab image panel
            dayside.editor.bind("codeTabCreated",function (b,tab){
                var file = tab.options.file;
                var ext = file.split(".").pop();
                if (ext=='jpg' || ext=='png' || ext=="jpeg") {
                    tab.element.append(
                        teacss.jQuery("<a href='#'>")
                        .css({
                            position: 'absolute',
                            bottom: 15, left: 60
                        })
                        .html("Open Pixlr")
                        .click(function(e){
                            e.preventDefault();
                            var dir = file.split("/"); dir.pop(); dir = dir.join("/")+"/";
                            me.openForDir(dir,file,tab);
                        })
                    )
                }
            });
        })        
    },
    
    openForDir: function(dir,file,codeTab) {
        var root = FileApi.root.replace(/\/$/,'');
        var dir = dir.replace(/\/$/,'');
        var dir_short = (dir==root) ? "/" : dir.split("/").pop();
        var title = "Pixrl: " + dir_short;
        
        var frame_url = FileApi.ajax_url+"?"+teacss.jQuery.param({
            _type:'pixlr_frame',
            target: this.options.callback_url(dir,file),
            path:file || "",
            preload:this.options.preload ? 1:0
        });
        
        var frame,loaded;    
        var tab = teacss.ui.panel({label:title,closable:true}).push(
            frame = teacss.jQuery("<iframe>")
                .load(function(){
                    if (!loaded) 
                        loaded = true;
                    else {
                        setTimeout(function(){
                            // save result after second iframe refresh
                            dayside.editor.filePanel.tree.jstree("refresh");
                            dayside.editor.contentTabs.closeTab(tab);
                            if (codeTab) {
                                var img = codeTab.element.find("img");
                                var src = img.attr("src");
                                src = src.split("?")[0] + "?t=" + Math.floor(Math.random()*0x10000).toString(16);
                                img.attr("src",src);
                            }
                        },1);
                    }
                })
                .attr("src", frame_url)
                .css({width: "100%", height: "100%"})
        );
        dayside.editor.contentTabs.addTab(tab);
        dayside.editor.contentTabs.selectTab(tab);
    }
})