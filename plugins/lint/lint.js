(function($,ui){
    
require("./jshint.js");

dayside.plugins.lint = $.Class.extend({
    init: function (o) {
        this.options = o;
        dayside.ready(function(){
            dayside.editor.bind("editorOptions",function(b,e){
                if (e.tab.options.file.split(".").pop()!="js") return;
                var gutters = e.options.gutters || [];
                gutters.unshift("CodeMirror-lint-markers");
                e.options.gutters = gutters;
                e.options.lint = true;
            });
        });
        
    }
});

})(teacss.jQuery,teacss.ui);