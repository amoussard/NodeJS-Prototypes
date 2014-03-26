var chat = function() {
    // Membres privés
    function _init(socket, oCurrentUser) {
        var userSource   = $("#user-template").html();
        var userTemplate = Handlebars.compile(userSource);
        var messageSource   = $("#message-template").html();
        var messageTemplate = Handlebars.compile(messageSource);
        var writingSource   = $("#writing-template").html();
        var writingTemplate = Handlebars.compile(writingSource);

        // User Management
        socket.on('new_user', function (oUser) {
            $('#members ul').append(userTemplate(oUser));
        });
        socket.on('remove_user', function (oUser) {
            $('#'+oUser.token).remove();
        });

        // Username Management
        $("#modify_name").on("click", function (e) {
            e.preventDefault();
            var $name = $("#name");
            oCurrentUser.name = $name.val();
            socket.emit('modify_name', oCurrentUser);
            $name.val('');
        });
        socket.on('update_user', function (oUser) {
            $('#'+oUser.token).html(oUser.name);
        });

        // Message Management
        $("#send_message").on("click", function (e) {
            e.preventDefault();
            var $message = $("#message")
            var message = $message.val();
            socket.emit('send_message', {
                'token': oCurrentUser.token,
                'message': message,
                'time': new Date().getTime()
            });
            $message.val('');
        });
        socket.on('new_message', function (data) {
            var date = new Date();
            date.setTime(data.time);
            $('#messages').prepend(
                messageTemplate({
                    name: data.user.name,
                    message: data.message,
                    date: date.toLocaleTimeString()
                })
            );
        });
        $("#message").on('keyup', function(e) {
            if ($(this).val() == '') {
                socket.emit('user_not_writing', {
                    'token': oCurrentUser.token
                });
                $('#send_message').prop('disabled', true);
            } else {
                socket.emit('user_writing', {
                    'token': oCurrentUser.token
                });
                $('#send_message').prop('disabled', false);
            }
        });
        socket.on('user_writing', function (oUser) {
            if (oUser.token != oCurrentUser.token) {
                var $writer = $('#writer-'+oUser.token);
                if ($writer.length == 0) {
                    $('#writers').append(writingTemplate(oUser));
                }
            }
        });
        socket.on('user_not_writing', function (data) {
            $('#writer-'+data.token).remove();
        });
    }

    // Membres publics
    return {
        init: _init
    };
}();