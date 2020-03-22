

var boxTemplateSrc = $('#box-template').html();
var boxTemplate = Handlebars.compile(boxTemplateSrc);

$('#search-button').click(function() {
    search();
});

$('#search').keypress(function(event) {
    if(event.key == 'Enter') {
        search();
    }
});


// Funzioni
function search() {
    var searchValue = $('#search').val();
    if ($('#search').val() != '') {
        // $('#search').val('');
        $('.box-container').remove();
        ajaxMovies(searchValue);
        ajaxTvShows(searchValue);
    }
}

function ajaxMovies(searchValue) {
    var api_base_url = 'https://api.themoviedb.org/3';
    $.ajax({
        url: api_base_url + '/search/movie',
        method: 'GET',
        data: {
            api_key: '75dbe3021ac7dc4530d9ca7b99004aa8',
            query: searchValue,
            language: 'it-IT'
        },
        success: function(res) {
            // console.log(res);
            var movies = res.results;
             appendMovies(movies);
        },
        error: function() {
            console.log('Errore');
        }
    });
}

function ajaxTvShows(searchValue) {
    var api_base_url = 'https://api.themoviedb.org/3';
    $.ajax({
        url: api_base_url + '/search/tv',
        method: 'GET',
        data: {
            api_key: '75dbe3021ac7dc4530d9ca7b99004aa8',
            query: searchValue,
            language: 'it-IT'
        },
        success: function(res) {
            // console.log(res);
            var tvShows = res.results;
             appendTvShows(tvShows);
        },
        error: function() {
            console.log('Errore');
        }
    });
}

function appendMovies(movies) {
    for (var i = 0; i < movies.length; i++) {
        var movie = {
            title: movies[i].title,
            originalTitle: movies[i].original_title,
            originalLanguage: movies[i].original_language,
            voteAverage: movies[i].vote_average,
            voteAveragePercentage: movies[i].vote_average * 10, // vedi css inline, classe stars
            originalLanguageUpperCase: movies[i].original_language.toUpperCase(),
            poster: 'w342' + movies[i].poster_path
        }

        if (movie.originalLanguage == 'en') {
            movie.originalLanguage = 'gb';
        }

        boxTemplateHTML = boxTemplate(movie);
        $('.container .movies').append(boxTemplateHTML);

        $('.img-container figure img').on('error', function() {
            $(this).siblings('figcaption').removeClass('hidden');
            $(this).siblings('figcaption').addClass('flex');
            this.src = 'img/default-poster.jpg';
        });
    }


}

function appendTvShows(tvShows) {
    for (var i = 0; i < tvShows.length; i++) {
        var tvShow = {
            title: tvShows[i].name,
            originalTitle: tvShows[i].original_name,
            originalLanguage: tvShows[i].original_language,
            voteAverage: tvShows[i].vote_average,
            voteAveragePercentage: tvShows[i].vote_average * 10, // vedi css inline, classe stars
            originalLanguageUpperCase: tvShows[i].original_language.toUpperCase(),
            poster: 'w342' + tvShows[i].poster_path
        }

        if (tvShow.originalLanguage == 'en') {
            tvShow.originalLanguage = 'gb';
        }

        boxTemplateHTML = boxTemplate(tvShow);
        $('.container .tv-shows').append(boxTemplateHTML);

        $('.img-container figure img').on('error', function() {
            $(this).siblings('figcaption').removeClass('hidden');
            $(this).siblings('figcaption').addClass('flex');
            this.src = 'img/default-poster.jpg';
        });
    }
}




// ----------------------------------------------------------
var greenTheme = $('head link[href*=green-theme]');
var redTheme = $('head link[href*=red-theme]');

$('#green').click(function() {
    $('head link[href*=green-theme]').remove();
    greenTheme.insertAfter('head link[href*=red-theme]');
});

$('#red').click(function() {
    $('head link[href*=red-theme]').remove();
    redTheme.insertAfter('head link[href*=green-theme]');
});
