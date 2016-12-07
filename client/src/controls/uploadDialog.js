teacss.ui.uploadDialog = teacss.ui.dialog.extend({
    init: function (o) {
        var $ = teacss.jQuery;
        this._super($.extend({
            autoOpen: false,
            resizable: false,
            width: 650, 
            height: 'auto',
            modal: true,
            title: "Upload files"
        },o));
        
        this.panel = teacss.ui.panel({label:"Upload"});
        this.java_panel = teacss.ui.panel({label:"Java Upload"});
        
        this.tabs = teacss.ui.tabPanel({height: 400,width:"100%",margin:0});
        this.tabs.push(this.panel);
        this.tabs.push(this.java_panel);
        this.push(this.tabs);
        
        this.element.css({padding:0,border:'none'});
        this.tabs.element.css({border:"none"});
        
        var me = this;
        setTimeout(function(){
            me.panel.element.plupload({
                runtimes : 'html5',
                url : "http://no-url-set",
                max_file_size : '10000mb',
                chunk_size: '500kb',
                views: {
                    list: true,
                    thumbs: true, // Show thumbs
                    active: 'list'
                },
                resize: false,
                flash_swf_url : 'http://rawgithub.com/moxiecode/moxie/master/bin/flash/Moxie.cdn.swf',
                silverlight_xap_url : 'http://rawgithub.com/moxiecode/moxie/master/bin/silverlight/Moxie.cdn.xap',
                complete: function () {
                    me.tree.jstree('refresh',me.node);
                },
                init: {
                    Init: function () {
                        me.initParams();
                    }
                },
                multipart_params: {_csrf:FileApi.getCSRFToken()}
            });
        },1);
        
        this.java_panel.bind("select",function(){
            setTimeout(function(){
                me.createJavaApplet();
            },1);
        });
    },
    
    createJavaApplet: function () {
        var me = this;
        var $ = teacss.jQuery;
        
        if (me.uploadPanel) return;
        
        var formdata = me.options.jupload_data || {};
        formdata = $.extend(formdata,{path:FileApi.root,_type:"upload",_csrf:FileApi.getCSRFToken()});
        var inputs = "";
        for (var key in formdata)
            inputs += '<input type="hidden" name="'+key+'" value="'+formdata[key]+'">';
        me.uploadPanel = teacss.jQuery([
            '<div>',
                '<form id="uploadForm">',
                    inputs,
                '</form>',
                '<APPLET',
                '        CODE="wjhk.jupload2.JUploadApplet"',
                '        NAME="JUpload"',
                '        ARCHIVE="'+me.options.jupload+'"',
                '        WIDTH="100%"',
                '        HEIGHT="370px"',
                '        MAYSCRIPT="true"',
                '        ALT="The java pugin must be installed.">',
                '    <param name="postURL" value="'+FileApi.ajax_url+'" />',
                '    <param name="lookAndFeel" value="system" />',
                '    <param name="formdata" value="uploadForm" />',
                '    <param name="afterUploadURL" value="javascript:window.afterJUpload()" />',
                '    <param name="showLogWindow" value="false" />',
                '    <param name="debugLevel" value="100" />',
                '    <param name="lang" value="en" />',
                '    Java 1.5 or higher plugin required.',
                '</APPLET>',
            '</div>'
        ].join("\n"));
        me.uploadPanel.appendTo(me.java_panel.element);
        me.initJavaParams();
    },
    
    initParams: function () {
        var data = this.panel.element.data("uiPlupload");
        if (data) {
            data.uploader.setOption("url",
                FileApi.ajax_url+"?"+teacss.jQuery.param({path:this.path,_type:"upload"})
            );
            if (this.filesToAdd) {
                data.uploader.addFile(this.filesToAdd);
                this.filesToAdd = false;
            }
        }
    },
    
    initJavaParams: function () {
        var me = this;
        if (me.uploadPanel) {
            me.uploadPanel.find("input[name=path]").val(me.path);
            window.afterJUpload = function () {
                me.tree.jstree('refresh',me.node);
            }
        }
    },
    
    open: function (path,tree,node,filesToAdd) {
        this._super();
    
        this.path = path;
        this.tree = tree;
        this.node = node;
        this.filesToAdd = filesToAdd;
        
        this.initJavaParams();
        this.initParams();
    }
})