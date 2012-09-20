dayside.ready(function () {
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
                    pixlr.overlay.show({image:file, title:file.split("/").pop()});
                })
            )
        }
    });
})