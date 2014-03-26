// "includes"
var express = require('express');
var app = express();
var swig = require('swig');
var path = require('path');

var userManager = require('./lib/manager/UserManager');

app.use(express.urlencoded());
app.use(express.json());

app.configure(function() {
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.bodyParser());
    app.use(express.logger("short"));
});

// This is where all the magic happens!
app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', './views');

// Activate cache on prod environment
app.set('view cache', false);
swig.setDefaults({ cache: false });

app.get('/', function (req, res) {
    res.render('index', { /* template locals context */ });
});

app.listen(8081);
console.log('Application Started on http://localhost:8081/');


// "includes"
var io_client = require('socket.io').listen(8082);

io_client.sockets.on('connection', function (socket) {
    console.log('connection_client');

    socket.on('authentication', function (data) {
        if (data.name) {
            var aUsers = userManager.getUsers();
            var oUser = userManager.addUser(data.name, socket);
            if (oUser) {
                socket.emit('authentication_success', {
                    'user': oUser.getInformations(),
                    'users' : aUsers
                });
                userManager.emit('new_user', oUser.getInformations());
            } else {
                socket.emit('authentication_error', {
                    'reason': 'Fail'
                });
            }
        }
    });

    socket.on('modify_name', function (oUser) {
        oUser = userManager.updateName(oUser.token, oUser.name);
        userManager.emit('update_user', oUser.getInformations());
    });

    socket.on('send_message', function (data) {
        var oUser = userManager.getUserByToken(data.token);
        userManager.emit('new_message', {
            'user': oUser.getInformations(),
            'message': data.message,
            'time': data.time
        });
        userManager.emit('user_not_writing', oUser.getInformations());
    });

    socket.on('user_writing', function (data) {
        var oUser = userManager.getUserByToken(data.token);
        console.log(oUser.getInformations());
        userManager.emit('user_writing', oUser.getInformations());
    });

    socket.on('user_not_writing', function (data) {
        var oUser = userManager.getUserByToken(data.token);
        userManager.emit('user_not_writing', oUser.getInformations());
    });

    /**
     * At disconnection, remove from manager and send event on all users
     */
    socket.on('disconnect', function () {
        var oUser = userManager.removeUser(socket);
        userManager.emit('remove_user', oUser.getInformations());
        userManager.emit('user_not_writing', oUser.getInformations());
    });
});