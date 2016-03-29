

$.getJSON("times.php", function (times) {
//alert(times);
    var html = "";
    for (var i = 0; i < times.length; i++) {
        html += "<li  class='timeFilmCinema list-group-item'  data-id='" + i + "'>" +
                "<span class='time'>" +
                times[i][0] +
                "</span>" +
                "<span class='filmName'>" +
                times[i][1] +
                "</span>" +
                ", " +
                times[i][2] +
                "</li>";
    }

    $("#output").html(html);

    $("#output li").on("click", function(event){
    
   bigListIndex =  $(this).data("id");
       

        
       
        var film = times[bigListIndex][1];
 
        var cinema = times[bigListIndex][2];
       
       $("#moreCinemas").text("All cinemas showing " + film);
        $("#moreFilms").text("All films at " + cinema);
        
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
   
    });

    


    

    function filmsForCinema(index, heading) {
        var html = "";
        var filmsForCinema = [];

        for (var i = 0; i < times.length; i++) {
            if (times[i][2] === times[index][2]) {
                filmsForCinema.push([times[i][0], times[i][1]]);
            }
        }
       
        for (var i = 0; i < filmsForCinema.length; i++) {
            html += "<li data-toggle='modal' data-target='#myModal' data-backdrop='static' class='timeFilm list-group-item' data-id='" + i + "'>" +
                    "<span class='time'>" +
                    filmsForCinema[i][0] +
                    "</span>" +
                    filmsForCinema[i][1] +
                    "</li>";
        }
        // alert("passed secon loop");
        $("#myModal").modal("hide");
        $("#heading").html(heading);
        $("#output").html(html);

    }
    
      function cinemasForFilm(index) {

        var html = "";
        var cinemasForFilm = [];

        for (var i = 0; i < times.length; i++) {
            if (times[i][1] === times[index][1]) {
                cinemasForFilm.push([times[i][0], times[i][2]]);
            }
        }
 
        for (var i = 0; i < cinemasForFilm.length; i++) {
            html += "<li data-toggle='modal' data-target='#myModal' data-backdrop='static' class='timeFilm list-group-item' data-id='" + i + "'>" +
                    "<span class='time'>" +
                    cinemasForFilm[i][0] +
                    "</span>" +
                   cinemasForFilm[i][1] +
                    "</li>";
        }
        // alert("passed secon loop");
        $("#myModal").modal("hide");
        $("#heading").html($(event.target).text());
        $("#output").html(html);

    }


});








   