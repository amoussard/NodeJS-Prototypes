// "includes"
var express = require('express');
var app = express();
var routes = require('./router/routes');

// Routes declarations
app.get('/', routes.homepage);
app.post('/post', routes.post);
app.get('/hello/:name', routes.hello);

app.listen(8081);
console.log('Listening on port 8081');