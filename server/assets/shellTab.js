var ShellTab = (function($){
    return teacss.ui.tab.extend("ShellTab",{},{
        init : function (options) {
            var me = this;
            this._super(options);
            
            this.element.append(
                this.outScroll = $("<div>")
                    .css({position:'absolute',left:0,right:0,top:0,bottom:30,background:'#fff',
                        border:'1px solid #666',overflow:'auto',padding:5})
                    .append(
                        this.outPanel = $("<pre>")
                    ),
                $("<table>")
                    .css({position:'absolute',left:0,right:0,height:30,bottom:0,margin:0})
                    .append(
                        $("<tr>").append(
                            this.pathPanel = $("<td>").css({padding:5,'white-space':'nowrap'}),
                            $("<td>").css({padding:0,width:'100%'}).append(
                                this.input = $("<input>").css({margin:0,width:'98%'})
                            )
                        )
                    )
            );

            this.path = options.path;
            this.rel = this.path.replace(FileApi.root,'')+"/";
            
            this.command("clear");
            this.options.caption = "Console: "+this.rel;

            this.input.keydown(function(e){
                if(e.which==13){
                    me.command(me.input.val());
                    me.input.val("");
                }
            });
        },
        command : function (command) {
            if (!command) return;
            if (command=="clear") {
                this.outPanel.html("");
            } else {
                var res = FileApi.request('shell',{path:this.path,command:command},true);
                this.outPanel.append(this.rel+"> "+command+"\n");
                this.outPanel.append(res.text);
            }
            this.pathPanel.html(this.rel+">");
            this.outScroll.animate({ scrollTop: this.outScroll.prop("scrollHeight") }, 1000);
        }
    });
})(teacss.jQuery);