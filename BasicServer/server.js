http = require('http');

http.createServer(function (req, res) {

    // Return code
    res.writeHead(200);

    // Content
    res.end('Hello World!\n');

}).listen(8081);

console.log('Server running at http://localhost:8081/');