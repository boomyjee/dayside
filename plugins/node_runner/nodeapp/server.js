var http = require("http");

http.createServer(function(request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello World 123");
    // console.log("started");
    //bla();
    response.end();
}).listen(8888);