// Route used only with POST
exports.post = function(req, res){
    var body = 'Test of route by post';
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', Buffer.byteLength(body));
    res.end(body);
};

// Route used only with POST
exports.homepage = function(req, res){
    var body = 'Test of route by get';
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', Buffer.byteLength(body));
    res.end(body);
};

// Route used only with GET and a param name
exports.hello = function(req, res){
    var body = 'Hello ' + req.params.name + '!';
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', Buffer.byteLength(body));
    res.end(body);
};