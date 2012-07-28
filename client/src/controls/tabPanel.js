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
                if (tab) {
                    tab.trigger("select",tab);
                	me.trigger("select",tab);
                    
                    setTimeout(function(){
                        tab.element.find(".ui-accordion").accordion("resize");
                    },1);
                }
            }
        });
        this.element.find(".ui-tabs-nav:first").sortable({
            axis: "x",
            helper: function(e, item) {
                var h = item;
                h.width(item.width()+2);
                return h;
            },
            sort: function (event, ui) {
                var that = $(this),
                w = ui.helper.outerWidth();
                that.children().each(function () {
                    if ($(this).hasClass('ui-sortable-helper') || $(this).hasClass('ui-sortable-placeholder')) 
                        return true;
                    // If overlap is more than half of the dragged item
                    var dist = Math.abs(ui.position.left - $(this).position().left),
                        before = ui.position.left > $(this).position().left;
                    if ((w - dist) > (w / 2) && (dist < w)) {
                        if (before)
                            $('.ui-sortable-placeholder', that).insertBefore($(this));
                        else
                            $('.ui-sortable-placeholder', that).insertAfter($(this));
                        return false;
                    }
                });
            },    
            stop: function (e, ui) {
                $(this).children().css('width','');
            },
            update: function () {
                var container = $(this); // ul
                var panel;
                $(this).children().each(function() {
                    panel = $($(this).find('a').attr('href'));
                    panel.insertAfter(container);
                    container = panel; // div
                });
            },
            containment: 'parent'
        });
        
        this.element.css({background:"transparent",padding:0});
        this.element.on("click","span.ui-icon-close", function(){
            var href = $(this).prev().attr("href");
            var tab = me.element.find(href).data("tab");
            var e = {tab:tab,cancel:false};
            tab.trigger("close",e);
            
            if (!e.cancel) {
                me.element.tabs("remove",$(this).prev().attr("href"));
            }
        });
    },
    
    showNavigation: function (flag) {
        if (!flag) {
            this.element.find("> .ui-tabs-nav:first").hide();
            this.element.find("> .ui-tabs-panel").css({top:0});
        } else {
            this.element.find("> .ui-tabs-nav:first").show();
            this.element.find("> .ui-tabs-panel").css({top:''});
        }
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
    },
    selectedTab: function () {
        var sel = this.element.tabs("option","selected");
        if (sel<0) return false;
        return this.element.find("> div").eq(sel).data("tab");
    }
});