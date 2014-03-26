var whiteboard = function() {
    // Variables
    var socket = false;
    var oCurrentUser = false;

    var color = "#000";
    var painting = false;
    var started = false;
    var pencil_width = 5;
    var canvas = $("#canvas");
    var context = canvas[0].getContext('2d');
    // Round corners
    context.lineJoin = 'round';
    context.lineCap = 'round';

    var last_position = {
        'x' : -1,
        'y' : -1
    };

    function touchHandlerDummy(e) { e.preventDefault(); return false; }

    // Membres privés
    function _init(_socket, _oCurrentUser) {



        socket = _socket;
        oCurrentUser = _oCurrentUser;

        // Au clic sur le canvas, on commence à dessiner
        canvas.mousedown(function(e) {
            startDrawing(e.offsetX, e.offsetY);
        });

        // Au clic sur le canvas, on commence à dessiner
        $(document).hammer().on('touch', '#canvas', function(e) {
            console.log('touch');
            document.addEventListener("touchmove", touchHandlerDummy, false);
            startDrawing(
                e.gesture.center.pageX - canvas.offset().left,
                e.gesture.center.pageY - canvas.offset().top
            );
        });

        // Si on relache la souris, on arrête de dessiner
        $(document).mouseup(function() {
            stopDrawing();
        });
        canvas.hammer().on('release', function(e) {
            console.log('release');
//            document.removeEventListener("touchmove", touchHandlerDummy);
            stopDrawing();
        });

        // Mouvement de la souris
        canvas.mousemove(function(e) {
            draw(e.offsetX, e.offsetY)
        });
        canvas.hammer().on('drag', function(e) {
            console.log('drag');
            draw(
                e.gesture.center.pageX - canvas.offset().left,
                e.gesture.center.pageY - canvas.offset().top
            );
        });

        // Bouton Reset
        $("#reset").click(function(e) {
            e.preventDefault();
            socket.emit('reset');
        });

        $(".color").click(function(e) {
            e.preventDefault();

            // Je change la couleur du pinceau
            color = $(this).attr("data-couleur");

            // Et les classes CSS
            $(".color").removeClass("active");
            $(this).attr("class", "active");
        });


        /*
         * Interface
         */

        // Couleurs
        $(".color").each(function() {
            $(this).css("background", $(this).attr("data-couleur"));
        });

        // Largeur du pinceau
        $("#pencil_width").change(function() {
            if (!isNaN($(this).val())) {
                pencil_width = $(this).val();
                $("#output").html($(this).val() + " pixels");
            }
        });





        socket.on('draw', function(data) {
            context.beginPath();
            context.moveTo(data.from.x, data.from.y);
            context.lineTo(data.to.x, data.to.y);
            context.strokeStyle = data.color;
            context.lineWidth = data.pencil_width;
            context.stroke();
        });

        socket.on('reset', function() {
            reset();
        });
    }

    /**
     * Start and move cursor to the right position
     * Emit an event to the server
     * @param x X position of the cursor on the canvas
     * @param y Y position of the cursor on the canvas
     */
    function startDrawing(x, y) {
        painting = true;
        last_position.x = x;
        last_position.y = y;
    }

    function draw(x, y) {
        if (painting) {
            context.beginPath();
            context.moveTo(last_position.x, last_position.y);
            context.lineTo(x, y);
            context.strokeStyle = color;
            context.lineWidth = pencil_width;
            context.stroke();

            socket.emit('draw', {
                'token': oCurrentUser.token,
                'from': {
                    'x' : last_position.x,
                    'y' : last_position.y
                },
                'to': {
                    'x' : x,
                    'y' : y
                },
                'color': color,
                'pencil_width': pencil_width,
                'time': new Date().getTime()
            });

            last_position.x = x;
            last_position.y = y;
        }
    }

    function stopDrawing() {
        painting = false;
    }

    // Clear du Canvas
    function reset() {
        context.clearRect(0, 0, canvas.width(), canvas.height());

        // Valeurs par défaut
        $("#largeur_pinceau").attr("value", 5);
        pencil_width = 5;
        $("#output").html("5 pixels");
    }

    return {
        init: _init
    };
}();