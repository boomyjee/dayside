dayside.ready(function(){
    var path = FileApi.root+"/autoload.js";
    FileApi.file(path,function(answer){
        if (!answer.error && answer.data && answer.data.substring(0,5)!="ERROR") {
            require.cache[path] = answer.data;
            require(path,true);
        }
    });
},"autoload");