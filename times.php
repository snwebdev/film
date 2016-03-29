
        
        <?php
       
        $scraped = file_get_contents('http://www.findanyfilm.com/find-cinema-tickets?townpostcode=glasgow');
        $cinemaStartString = '<span class="cinemaName">';
        $cinemaEndString = '</span>';
        $filmStartString = '<li class="filmTitle">';
        $filmTitleEndString = '</h1>';
        $filmsEndString = '<!-- End Films -->';
        $timeStartString = 'class="cssTouchButton">';
        $timeEndString = '</a>';
        $timesEndString = '<!-- End Screenings for film -->';
        $cinemaCount = 0;
        $filmCount = 0;
        $timeCount = 0;
        $timeArray = array();

        $listingEndString = 'id="jsrender_screenings"';
        $endString = "</span>";


        while (isMoreCinemas($scraped, $cinemaStartString)) {

            $cinemaCount++;
            $cinemaName = getPartBetween($scraped, $cinemaStartString, $cinemaEndString);
            $cinemaName = getPartBeforeSubstring($cinemaName, ',');
            //echo($cinemaName) . "<br>";
            $scraped = getPartAfterSubstring($scraped, $cinemaStartString);
            $scraped = getPartAfterSubstring($scraped, $cinemaEndString);

            while (isMoreFilms($scraped, $filmStartString, $cinemaStartString, $listingEndString)) {

                $filmCount++;
                $scraped = getPartAfterSubstring($scraped, $filmStartString);
                $scraped = getPartAfterSubstring($scraped, '<h1>');
                $filmName = getPartBeforeSubstring("$scraped", '</h1>');
                $filmName = removeYear($filmName);
               // echo($filmName) . "<br>";

                while (isMoreTimes($scraped, $timeStartString, $timeEndString, $timesEndString, $filmStartString, $listingEndString)) {
                    $timeCount++;
                  
                    $scraped = getPartAfterSubstring($scraped, $timeStartString);
                    $time = getPartBeforeSubstring($scraped, $timeEndString);
                   // echo($time).', ';
                 $lineArray = array($time, $filmName, $cinemaName);
                    array_push($timeArray, $lineArray);
                    $scraped = getPartAfterSubstring($scraped, $timeEndString);
                }
               // echo '<br>';
            }
        }
       // print_r($timeArray);
        sort($timeArray);
        
        echo json_encode($timeArray);
        /*
        foreach ($timeArray as $line){
            echo($line[0].', '.$line[1].', '.$line[2].'<br>');
        }
       */
      

        /*
          $string="abcdefghijklmn";
          $sub="de";
          echo(getPartAfterSubstring($string, $sub));
         */
        function removeYear ($filmName){
            return substr($filmName, 0, - 6);
        }

        function isMoreTimes($scraped, $timeStartString, $timeEndString, $timesEndString, $filmStartString, $listingEndString) {
            $indexOfTimesEndString = getIndexOfSubstring($scraped, $timesEndString);
            $indexOfNextTimeStartString = getIndexAfterSubstring($scraped, $timeStartString);
            $indexOfListingEndString = getIndexOfSubstring($scraped, $listingEndString);
            $indexOfFilmStartString = getIndexOfSubstring($scraped, $filmStartString);
            if ($indexOfListingEndString > $indexOfNextTimeStartString) {
                // there are more times before end of file
                if ($indexOfNextTimeStartString < $indexOfTimesEndString) {
                    //there are more times fior this film
                    return true;
                } else {
                    return false;
                }
            } else {
                // no more times for this film
                return false;
            }
        }

        function isMoreCinemas($scraped, $cinemaStartString) {
            if (getIndexOfSubstring($scraped, $cinemaStartString) > -1) {
                return true;
            }
            return false;
        }

        function isMoreFilms($scraped, $filmStartString, $cinemaStartString, $listingEndString) {
            $indexOfNextFilmStart = getIndexOfSubstring($scraped, $filmStartString);
            $indexOfCinemaStartString = getIndexOfSubstring($scraped, $cinemaStartString);
            $indexOfListingEndString = getIndexOfSubstring($scraped, $listingEndString);

            if ($indexOfCinemaStartString > -1) {
                //there are more cinemas (with their own films) to come
                if ($indexOfNextFilmStart < $indexOfCinemaStartString) {
                    //there are more films before the next cinema
                    return true;
                } else {
                    //have done the last film for this cinema
                    return false;
                }
            } else {
                // this is the last cinema
                if ($indexOfNextFilmStart > -1 && $indexOfNextFilmStart < $indexOfListingEndString) {
                    //there are more films to come in this last cinema
                    return true;
                } else {
                    return false;
                }
            }
        }

        function getIndexOfSubstring($string, $subString) {

            $index = strpos($string, $subString);
            return($index);
        }

        function getIndexAfterSubstring($string, $substring) {

            $index = strpos($string, $substring) + strlen($substring);
            return($index);
        }

        function stripStringBeforeIndex($string, $start) {
            $indexStartOfStart = getIndexOfSubstring($string, $start);
            $indexEndOfStart = $indexStartOfStart + strlen($start) - 1;
            $indexStartOfPart = $indexEndOfStart + 1;
            $lengthOfPart = strlen($string) - $indexEndOfStart;
            $part = substr($string, $indexStartOfPart, $lengthOfPart);
            return($part);
        }

        function getPartBeforeSubstring($string, $substring) {
            $indexStartOfSubstring = getIndexOfSubstring($string, $substring);
            $lengthOfPart = $indexStartOfSubstring;
            $part = substr($string, 0, $lengthOfPart);
            return($part);
        }

        function getPartBetween($string, $start, $end) {
            $string = stripStringBeforeIndex($string, $start);
            $part = getPartBeforeSubstring($string, $end);
            return($part);
        }

        function stripToEndOfSubstring($string, $substring) {
            $indexPart = getIndexAfterSubstring($string, $substring);
            $part = stripStringBeforeIndex($string, $indexPart);
            return($part);
        }

        function getPartAfterSubstring($string, $substring) {
            $indexOfPart = strpos($string, $substring) + strlen($substring);
            $lengthOfSubstring = strlen($substring);
            $lengthOfPart = strlen($string) - $indexOfPart;
            $part = substr($string, $indexOfPart, $lengthOfPart);
            return($part);
        }
        ?>
  