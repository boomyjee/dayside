dayside.plugins.push(function(){
    FileApi.dir(FileApi.root+"/.dayside",function(answer){
        var list = {};
        if (!answer.error && answer.data) {
            for (var i=0;i<answer.data.length;i++) {
                if (!answer.data[i].folder) {
                    var path = answer.data[i].path;
                    var ext = path.split("/").pop().split(".").pop();
                    if (ext=="js")
                        list[path] = 1;
                }
            }
        }
        var head = document.getElementsByTagName('head')[0];
        if (head) for (var path in list) {
            var script = document.createElement("script");
            script.src = path;
            script.setAttribute("class","dayside-autoload");
            head.appendChild(script);
        }
    });
    
});