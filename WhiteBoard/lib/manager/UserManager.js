var crypto = require('crypto');
var User = require('./../model/User');

var aUsers = [];

var generateToken = function (string) {
    var timestamp = new Date().getTime();
    var shasum = crypto.createHash('sha1');
    shasum.update(string+timestamp);
    return shasum.digest('hex');
};

var emit = function (event, data) {
    for (var i in aUsers) {
        var oUser = aUsers[i];
        oUser.socket.emit(event, data);
    }
};

var addUser = function (name, socket) {
    var token = generateToken(name);
    var oUser = new User(name, token, socket);
    aUsers.push(oUser);
    return oUser;
};

var removeUser = function (socket) {
    for(var i in aUsers) {
        var oUser = aUsers[i];
        if (oUser.socket == socket) {
            aUsers.splice(i, 1);
            return oUser;
        }
    }
    return 1;
};

var updateName = function (token, name) {
    for(var i in aUsers) {
        var oUser = aUsers[i];
        if (oUser.token == token) {
            oUser.name = name;
            return oUser;
        }
    }
    return 1;
};

var getUserByToken = function (token) {
    for(var i in aUsers) {
        var oUser = aUsers[i];
        if (oUser.token == token) {
            return oUser;
        }
    }
    return undefined;
};

var getNbUser = function () {
    return aUsers.length;
};

var getUsers = function () {
    var aRes = [];
    for(var i in aUsers) {
        var oUser = aUsers[i];
        aRes.push(oUser.getInformations());
    }
    return aRes;
};

module.exports.emit = emit;
module.exports.addUser = addUser;
module.exports.removeUser = removeUser;
module.exports.updateName = updateName;
module.exports.getUserByToken = getUserByToken;
module.exports.getNbUser = getNbUser;
module.exports.getUsers = getUsers;
