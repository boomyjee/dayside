dayside.plugins.pixlr = teacss.jQuery.Class.extend({
    init: function (options) {
        var me = this;
        this.options = teacss.jQuery.extend({
            callback_url: function (dir,file) {
                var params = {
                    auth_token: teacss.jQuery.cookie('editor_auth'),
                    dir: dir,
                    _type: 'pixlr'
                };
                return FileApi.ajax_url+"?"+teacss.jQuery.param(params);
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
    
    buildUrl: function (opt) {
        var url = 'https://pixlr.com/' + opt.service + '/?s=c', attr;
        for (attr in opt) {
            if (opt.hasOwnProperty(attr) && attr !== 'service') {
                url += "&" + attr + "=" + escape(opt[attr]);
            }
        }
        return url;
    },
    
    openForDir: function(dir,file,codeTab) {
        var dir_short = (dir==FileApi.root) ? "/" : dir.split("/").pop();
        var title = "Pixrl: " + dir_short;
        var options = {
            service:'editor',
            locktarget: true,
            referrer: "UXCandy",
            target: this.options.callback_url(dir,file)
        };
        if (file) {
            options.title = file.split("/").pop();
            options.image = file;
        }
        
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
                .attr("src", this.buildUrl(options))
                .css({width: "100%", height: "100%"})
        );
        dayside.editor.contentTabs.addTab(tab);
        dayside.editor.contentTabs.selectTab(tab);
    }
})