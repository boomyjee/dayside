dayside.plugins.push(function(){
    var path = FileApi.root+"/autoload.js";
    FileApi.file(path,function (answer){
        if (answer.data.substring(0,5)=='ERROR') return;
        var head = document.getElementsByTagName('head')[0];
        if (head) {
            var script = document.createElement("script");
            script.src = path;
            script.setAttribute("class","dayside-autoload");
            head.appendChild(script);
        }
    })
});
