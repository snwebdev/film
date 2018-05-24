//last modified 24/05/18 11.18

$.getJSON("times.php", function (times) {
    times = removeStarted(times);

    var wholeListHTML = "";

    for (var i = 0; i < times.length; i++) {
        wholeListHTML += "<li  class='selectable bothItems list-group-item'  data-id='" + i + "'>" +
            "<div class='time'>" +
            times[i][0] +
            "</div>" +
            "<div class='secondItem'>" +
            "<span class='filmName'>" +
            times[i][1] +
            "</span>" +
            ", " +
            times[i][2] +
            "</div>" +
            "</li>";
    }

    $("#output").html(wholeListHTML);

    $(document).on("click", ".selectable", function () {

        var bigListIndex = $(this).data("id");
        var film = times[bigListIndex][1];
        var cinema = times[bigListIndex][2];

        $("#moreCinemas").text("Cinemas showing " + film);
        $("#moreFilms").text("Films in " + cinema);
        $("#myModal").modal("show");
        $("#myModal li").on("click", function (event) {

            switch (event.target.id) {

                case "moreFilms":

                    filmsForCinema(bigListIndex, $(event.target).text());
                    break;

                case "moreCinemas":

                    cinemasForFilm(bigListIndex, $(event.target).text());
                    break;

                case "close":

                    $("#myModal").modal("hide");
                    break;
            }
        });


        $("#back").on("click", function () {
            $("#back").css("visibility", "hidden");
            $("#heading").html("Films around <span id='city'>Glasgow</span>");
            $("#output").html(wholeListHTML);
        });
    });


    function cinemasForFilm(index, heading) {
        $("#back").css("visibility", "visible");

        var cinemasForFilm = [];

        for (var i = 0; i < times.length; i++) {
            if (times[i][1] === times[index][1]) {
                cinemasForFilm.push([times[i][0], times[i][2]]);
            }
        }


        var html = "";
        for (var i = 0; i < cinemasForFilm.length; i++) {
            html += "<li class='bothItems list-group-item' data-id='" + i + "'>" +
                "<div class='time'>" +
                cinemasForFilm[i][0] +
                "</div><div class='secondItem'>" +
                cinemasForFilm[i][1] +
                "</div></li>";
        }


        $("#myModal").modal("hide");
        $("#heading").html(heading);
        resizeOutput();
        $("#output").html(html);

    }

    function filmsForCinema(index, heading) {
        $("#back").css("visibility", "visible");
        var html = "";
        var filmsForCinema = [];

        for (var i = 0; i < times.length; i++) {
            if (times[i][2] === times[index][2]) {
                filmsForCinema.push([times[i][0], times[i][1]]);
            }
        }

        for (var i = 0; i < filmsForCinema.length; i++) {
            html += "<li class='bothItems list-group-item' data-id='" + i + "'>" +
                "<div class='time'>" +
                filmsForCinema[i][0] +
                "</div><div class='secondItem'>" +
                filmsForCinema[i][1] +
                "</div></li>";
        }

        $("#myModal").modal("hide");
        $("#heading").html(heading);
        resizeOutput();
        $("#output").html(html);

    }

    function removeStarted(times) {
        var currentDate = new Date();
        var currentHour = currentDate.getHours();
        var currentMinute = currentDate.getMinutes();
        var newTimes = [];
        var filmHour, filmMinute;

        for (var i = 0; i < times.length; i++) {
            filmHour = times[i][0].substring(0, 2);
            filmMinute = times[i][0].substring(3, 5);

            if (filmHour > currentHour || (filmHour == currentHour && filmMinute >= currentMinute)) {
                newTimes.push(times[i]);
            }
        }
        return (newTimes);
    }
});
