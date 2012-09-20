dayside.ready(function(){
    var path = FileApi.root+"/autoload.js";
    require.getFile(path,function(data){
        if (data) require(FileApi.root+"/autoload.js",true);
    },true);
},"autoload");