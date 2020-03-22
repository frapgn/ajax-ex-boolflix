
// Template
var boxTemplateSrc = $('#box-template').html();
var boxTemplate = Handlebars.compile(boxTemplateSrc);

// Ricerca col click e con Enter
$('#search-button').click(function() {
    search();
});

$('#search').keypress(function(event) {
    if(event.key == 'Enter') {
        search();
    }
});

// Visualizza / Nascondi Descrizione
$('.container').on('click', '#show-overview', function() {
    $(this).siblings('.overview-container').removeClass('hidden').addClass('flex');
});

$('.container').on('click', '#hide-overview', function() {
    $(this).parent('.overview-container').removeClass('flex').addClass('hidden');
});

// Funzioni
function search() {
    var searchValue = $('#search').val();
    if ($('#search').val() != '') {
        $('#search').val('');
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
            poster: 'w342' + movies[i].poster_path,
            overview: movies[i].overview
        }
        if (movie.originalLanguage == 'en') { // FIXME: non riesco a far funzionare l'if in una funzione
            movie.originalLanguage = 'gb';
        }
        if (movie.overview == '') { // FIXME: non riesco a far funzionare l'if in una funzione
            movie.overview = 'Descrizione non disponibile';
        }
        boxTemplateHTML = boxTemplate(movie);
        $('.container .movies').append(boxTemplateHTML);
        posterNotAvailable();
        imgNotAvailable(movie.originalLanguageUpperCase);
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
            poster: 'w342' + tvShows[i].poster_path,
            overview: tvShows[i].overview
        }
        if (tvShow.originalLanguage == 'en') { // FIXME: non riesco a far funzionare l'if in una funzione
            tvShow.originalLanguage = 'gb';
        }
        if (tvShow.overview == '') { // FIXME: non riesco a far funzionare l'if in una funzione
            tvShow.overview = 'Descrizione non disponibile';
        }
        boxTemplateHTML = boxTemplate(tvShow);
        $('.container .tv-shows').append(boxTemplateHTML);
        posterNotAvailable();
        imgNotAvailable(tvShow.originalLanguageUpperCase);
    }

}

// function flagENtoGB(originalLanguage) {
//     if (originalLanguage == 'en') {
//         originalLanguage = 'gb';
//     }
// }

function posterNotAvailable() {
    $('.img-container figure img').on('error', function() {
        $(this).siblings('figcaption').removeClass('hidden').addClass('flex');
        this.src = 'img/default-poster.jpg';
    });
}

function imgNotAvailable(originalLanguageUpperCase) {
    $('.original-language-container img').on('error', function() {
        $(this).parent().append('<span class="text-instead-of-the-flag">' + originalLanguageUpperCase + '</span>');
        $(this).remove();
    });
}

// function overviewNotAvailable(overview) {
//     if (overview.length === 0) {
//         return overview = 'Descrizione non disponibile';
//     }
// }

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
