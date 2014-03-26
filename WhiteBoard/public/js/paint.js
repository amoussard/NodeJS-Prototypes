$(document).ready(function() {

    // Variables
    var color = "#000";
    var painting = false;
    var started = false;
    var width_brush = 5;
    var canvas = $("#canvas");
    var cursorX, cursorY;

    var context = canvas[0].getContext('2d');

    // Trait arrondi
    context.lineJoin = 'round';
    context.lineCap = 'round';

    // Click souris enfoncée sur le canvas, je dessine
    canvas.mousedown(function(e) {
        painting = true;

        // Coordonnées de la souris
        cursorX = (e.offsetX);
        cursorY = (e.offsetY);
    });

    // Relachement du Click sur tout le document, j'arrête de dessiner
    $(this).mouseup(function() {
        painting = false;
        started = false;
    });

    // Mouvement de la souris sur le canvas
    canvas.mousemove(function(e) {
        if (painting) {
            // Set CoordonnÃ©es de la souris
            cursorX = (e.offsetX);
            cursorY = (e.offsetY);

            // Dessine une ligne
            drawLine();
        }
    });

    // Fonction qui dessine une ligne
    function drawLine() {
        // Si c'est le début, j'initialise
        if (!started) {
            // Je place mon curseur pour la première fois
            context.beginPath();
            context.moveTo(cursorX, cursorY);
            started = true;
        } else { // Sinon je dessine
            context.lineTo(cursorX, cursorY);
            context.strokeStyle = color;
            context.lineWidth = width_brush;
            context.stroke();
        }
    }

    // Clear du Canvas
    function clear_canvas() {
        context.clearRect(0,0, canvas.width(), canvas.height());
    }

    // Pour chaque couleur
    $("#couleurs a").each(function() {
        // Je lui attribut une couleur de fond
        $(this).css("background", $(this).attr("data-couleur"));

        // Et au click :
        $(this).click(function() {
            // Je change la couleur du pinceau
            color = $(this).attr("data-couleur");

            // Et les classes CSS
            $("#couleurs a").removeAttr("class", "");
            $(this).attr("class", "actif");

            return false;
        });
    });

    // Largeur du pinceau
    $("#largeurs_pinceau input").change(function() {
        if (!isNaN($(this).val())) {
            width_brush = $(this).val();
            $("#output").html($(this).val() + " pixels");
        }
    });

    // Bouton Reset
    $("#reset").click(function() {
        // Clear canvas
        clear_canvas();

        // Valeurs par défaut
        $("#largeur_pinceau").attr("value", 5);
        width_brush = 5;
        $("#output").html("5 pixels");

    });

    // Bouton Save
    $("#save").click(function() {
        var canvas_tmp = document.getElementById("canvas");	// Ca merde en pernant le selecteur jQuery
        window.location = canvas_tmp.toDataURL("image/png");
    });

});