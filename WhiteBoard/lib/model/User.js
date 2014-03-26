var User = function(_name, _token, _socket) {
    this.name = _name;
    this.token = _token;
    this.socket = _socket;
};

User.prototype.getName = function () {
    return this.name;
};

User.prototype.getToken = function () {
    return this.token;
};

User.prototype.getInformations = function () {
    return {
        'name': this.name,
        'token': this.token
    };
};

module.exports = User;