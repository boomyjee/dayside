var http = require("http");

http.createServer(function(request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello World Live");
    response.end();
    console.log("some message\n");
}).listen(process.env.PORT);