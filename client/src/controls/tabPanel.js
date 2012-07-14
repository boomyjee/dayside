teacss.ui.tabPanel = teacss.ui.Control.extend({
    tabIndex: 0
},{
    init: function(options) {
        var me = this;
        var $ = teacss.jQuery;
        this._super($.extend({
            height: '100%'
        },options));
        // structure for ui.tabs
        this.element = $("<div></div>").css({
            height: this.options.height,
            position: 'relative'
        });
        this.element.append("<ul></ul>");
        this.element.tabs({
            select: function (e,ui) { 
                var tab = $(ui.panel).data("tab");
                if (tab && tab.onSelect) tab.onSelect();
            }
        });
        
        this.element.css({background:"transparent",padding:0});
        this.element.on("click","span.ui-icon-close", function(){
            var href = $(this).prev().attr("href");
            var tab = me.element.find(href).data("tab");
            tab.element.detach();
            me.element.tabs("remove",$(this).prev().attr("href"));
        });
    },
    addTab: function (tab) {
        if (!(tab instanceof teacss.ui.tab)) tab = teacss.ui.tab(tab);
        var id = 'tab' + this.Class.tabIndex++;
        
        if (tab.options.closable) {
            tabTemplate = "<li><a href='#{href}'>#{label}</a><span class='ui-icon ui-icon-close'>Close</span></li>"
        } else {
            tabTemplate = "<li><a href='#{href}'>#{label}</a></li>"
        }
        this.element.tabs("option","tabTemplate",tabTemplate);
        this.element.tabs("add",'#'+id,tab.options.caption || "Tab "+this.Class.tabIndex);
        this.element.find('#'+id).append(tab.element).data("tab",tab);
        
        tab.options.nested = true;
        tab.options.id = id;
    },
    selectTab: function(tab) {
        this.element.tabs("select",'#'+tab.options.id);
    },
    prevTab: function () {
        var sel = this.element.tabs("option","selected");
        if (sel>0) this.element.tabs("option","selected",sel-1);
    },
    nextTab: function () {
        var sel = this.element.tabs("option","selected");
        var N = this.element.tabs("length");
        if (sel+1<N) this.element.tabs("option","selected",sel+1);
    }
});