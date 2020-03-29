
// Template Handlebars
var boxTemplateSrc = $('#box-template').html();
var boxTemplate = Handlebars.compile(boxTemplateSrc);

// Ricerca con il click e con il tasto Enter
$('#search-button').click(function() {
    search();
});

$('#search').keypress(function(event) {
    if(event.key == 'Enter') {
        search();
    }
});

// Visualizza / Nascondi Descrizione
$('.container').on('click', '#show-overview-btn', function() {
    $(this).siblings('.overview-container').removeClass('hidden').addClass('flex');
});

$('.container').on('click', '#hide-overview-btn', function() {
    $(this).parent('.overview-container').removeClass('flex').addClass('hidden');
});

// Ottieni info aggiuntive dopo il click sul pulsante Altre Info
$('.container').on('click', '#more-info-btn', function() {
    var mediaID = $(this).parents('.box-container').data('boxId');
    var mediaType = $(this).parents('.box-container').data('mediaType');
    if ($(this).siblings('.more-info-container').lenght) {
        $(this).siblings('.more-info-container').removeClass('hidden').addClass('flex');

    } else {
        ajaxGetMediaInfo(mediaType, mediaID);
    }
});

// Nascondi Altre Info: click sul tasto chiudi -> aggiungi classe hidden a more-info-container
$('.container').on('click', '#hide-more-info-btn', function() {
    $(this).parents('.more-info-container').addClass('hidden').removeClass('flex');
});

// Filtro i risultati della ricerca attraverso un menu a tendina con i generi
$('#genre-select').change(function() {
    var selectedGenre = $(this).val();
    if (selectedGenre == '') {
        $('.box-container').show();
    } else {
        $('.box-container').each(function() {
            if( $(this).attr('data-genre-ids').includes(selectedGenre) ) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }
});

// Funzioni /////////////////////////////////////
function search() {
    var searchValue = $('#search').val();
    if ($('#search').val() != '') {
        // $('#search').val('');        // da decommentare
        $('.box-container').remove();

        // ajaxMovies(searchValue);     // OLD CODE
        // ajaxTvShows(searchValue);    // OLD CODE

        ajaxSearchMediaPreview('movie', searchValue);
        ajaxSearchMediaPreview('tv', searchValue);
    }
}

// Chiamata ajax all'API: Vari dati da MOVIES e TV
function ajaxGetMediaInfo(mediaType, mediaId) {
    var api_base_url = 'https://api.themoviedb.org/3/';
    $.ajax({
        url: api_base_url + mediaType + '/' + mediaId,
        method: 'GET',
        data: {
            api_key: '75dbe3021ac7dc4530d9ca7b99004aa8',
            language: 'it-IT',
            append_to_response: 'credits'
        },
        success: function(res) {
            var genres = res.genres; // array con id e genere corrispondente
            var cast = res.credits.cast; // array con il cast del film o serie tv
            appendMoreInfo(genres, cast, mediaId);

        },
        error: function() {
            console.log('Errore!');
        }
    });
}

// Template Altre Info + append Generi e Cast
var moreInfoTemplateSrc = $('#more-info-template').html();
var moreInfoTemplate = Handlebars.compile(moreInfoTemplateSrc);

function appendMoreInfo(mediaGenres, mediaCast, mediaId) {
    var whereToAppend = $('.box-container[data-box-id="' + mediaId + '"] .box');
    moreInfoTemplateHTML = moreInfoTemplate();
    whereToAppend.append(moreInfoTemplateHTML);

    for (var i = 0; i < mediaGenres.length; i++) {
        // var genreId = mediaGenres[i].id;
        var genreName = mediaGenres[i].name;
        whereToAppend.find('.more-info .genres').append('<div>' + genreName + '</div>');
    }

    for (var i = 0; i < 5; i++) {
        var castName = mediaCast[i].name
        whereToAppend.find('.more-info .cast').append('<div>' + castName + '</div>');
    }
}

// Chiamata ajax all'API: SEARCH -> Search Movies, Search TV Shows
function ajaxSearchMediaPreview(mediaType, searchValue) {
    var api_base_url = 'https://api.themoviedb.org/3';
    $.ajax({
        url: api_base_url + '/search/' + mediaType,
        method: 'GET',
        data: {
            api_key: '75dbe3021ac7dc4530d9ca7b99004aa8',
            query: searchValue,
            language: 'it-IT'
        },
        success: function(res) {
            var mediaPreview = res.results;
             appendMediaPreview(mediaType, mediaPreview);
        },
        error: function() {
            console.log('Errore!');
        }
    });
}

// Ciclo l'array con il risultato della ricerca e faccio l'append degli oggetti con Handlebars
var posterSize = 'w342';
function appendMediaPreview(mediaType, mediaJSON) {
    for (var i = 0; i < mediaJSON.length; i++) {
        if (mediaType == 'movie') {
            var infoTitle = mediaJSON[i].title;
            var infoOriginalTitle = mediaJSON[i].original_title;
            var whereToAppend = $('.container .movies');
        } else if (mediaType == 'tv') {
            var infoTitle = mediaJSON[i].name;
            var infoOriginalTitle = mediaJSON[i].original_name;
            var whereToAppend = $('.container .tv-shows');
        }
        var info = {
            type: mediaType,
            title: infoTitle,
            originalTitle: infoOriginalTitle,
            originalLanguage: mediaJSON[i].original_language,
            voteAverage: mediaJSON[i].vote_average,
            voteAveragePercentage: mediaJSON[i].vote_average * 10, // vedi css inline, classe stars
            originalLanguageUpperCase: mediaJSON[i].original_language.toUpperCase(),
            poster: posterSize + mediaJSON[i].poster_path,
            overview: mediaJSON[i].overview,
            mediaId: mediaJSON[i].id,
            genreIds: mediaJSON[i].genre_ids // array con gli id ed i corrispondenti generi
        }
        // Gestisco la bandierina della lingua inglese
        if (info.originalLanguage == 'en') { // FIXME: non riesco a far funzionare l'if in una funzione
            info.originalLanguage = 'gb';
        }
        // Gestisco la descrizione non disponibile
        if (info.overview == '') { // FIXME: non riesco a far funzionare l'if in una funzione
            info.overview = 'Descrizione non disponibile';
        }
        boxTemplateHTML = boxTemplate(info);
        whereToAppend.append(boxTemplateHTML);
        posterNotAvailable();
        flagNotAvailable(info.originalLanguageUpperCase);

        var genreIds = '';
        for (var x = 0; x < info.genreIds.length; x++) { // ciclo gli id dei generi
            // $('.box-container[data-box-id="' + info.mediaId + '"]').attr('data-genre-id-' + x, info.genreIds[x]); // li aggiungo come attributo-valore
            genreIds += info.genreIds[x] + ' ';
            // console.log(genreIds);
            $('.box-container[data-box-id="' + info.mediaId + '"]').attr('data-genre-ids', genreIds);
        }

    }
}

// function flagENtoGB(originalLanguage) {
//     if (originalLanguage == 'en') {
//         originalLanguage = 'gb';
//     }
// }

// Gestisco la locandina non disponibile
function posterNotAvailable() {
    $('.img-container figure img').on('error', function() {
        $(this).siblings('figcaption').removeClass('hidden').addClass('flex');
        this.src = 'img/default-poster.jpg';
    });
}

// Gestisco la bandierina non disponibile
function flagNotAvailable(originalLanguageUpperCase) {
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

// Change template color
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

// test vari
$('.container').data('test', {genres: [45, 84, 78]});
// console.log($('.container').data());


// OLD CODE ------------------------------------------------

// function ajaxMovies(searchValue) {
//     var api_base_url = 'https://api.themoviedb.org/3';
//     $.ajax({
//         url: api_base_url + '/search/movie',
//         method: 'GET',
//         data: {
//             api_key: '75dbe3021ac7dc4530d9ca7b99004aa8',
//             query: searchValue,
//             language: 'it-IT'
//         },
//         success: function(res) {
//             var movies = res.results;
//              appendMovies(movies);
//         },
//         error: function() {
//             console.log('Errore');
//         }
//     });
// }
//
// function ajaxTvShows(searchValue) {
//     var api_base_url = 'https://api.themoviedb.org/3';
//     $.ajax({
//         url: api_base_url + '/search/tv',
//         method: 'GET',
//         data: {
//             api_key: '75dbe3021ac7dc4530d9ca7b99004aa8',
//             query: searchValue,
//             language: 'it-IT'
//         },
//         success: function(res) {
//             var tvShows = res.results;
//              appendTvShows(tvShows);
//         },
//         error: function() {
//             console.log('Errore');
//         }
//     });
// }
//
// function appendMovies(movies) {
//     for (var i = 0; i < movies.length; i++) {
//         var movie = {
//             title: movies[i].title,
//             originalTitle: movies[i].original_title,
//             originalLanguage: movies[i].original_language,
//             voteAverage: movies[i].vote_average,
//             voteAveragePercentage: movies[i].vote_average * 10, // vedi css inline, classe stars
//             originalLanguageUpperCase: movies[i].original_language.toUpperCase(),
//             poster: 'w342' + movies[i].poster_path,
//             overview: movies[i].overview
//         }
//         if (movie.originalLanguage == 'en') { // FIXME: non riesco a far funzionare l'if in una funzione
//             movie.originalLanguage = 'gb';
//         }
//         if (movie.overview == '') { // FIXME: non riesco a far funzionare l'if in una funzione
//             movie.overview = 'Descrizione non disponibile';
//         }
//         boxTemplateHTML = boxTemplate(movie);
//         $('.container .movies').append(boxTemplateHTML);
//         posterNotAvailable();
//         imgNotAvailable(movie.originalLanguageUpperCase);
//     }
// }
//
// function appendTvShows(tvShows) {
//     for (var i = 0; i < tvShows.length; i++) {
//         var tvShow = {
//             title: tvShows[i].name,
//             originalTitle: tvShows[i].original_name,
//             originalLanguage: tvShows[i].original_language,
//             voteAverage: tvShows[i].vote_average,
//             voteAveragePercentage: tvShows[i].vote_average * 10, // vedi css inline, classe stars
//             originalLanguageUpperCase: tvShows[i].original_language.toUpperCase(),
//             poster: 'w342' + tvShows[i].poster_path,
//             overview: tvShows[i].overview
//         }
//         if (tvShow.originalLanguage == 'en') { // FIXME: non riesco a far funzionare l'if in una funzione
//             tvShow.originalLanguage = 'gb';
//         }
//         if (tvShow.overview == '') { // FIXME: non riesco a far funzionare l'if in una funzione
//             tvShow.overview = 'Descrizione non disponibile';
//         }
//         boxTemplateHTML = boxTemplate(tvShow);
//         $('.container .tv-shows').append(boxTemplateHTML);
//         posterNotAvailable();
//         imgNotAvailable(tvShow.originalLanguageUpperCase);
//     }
//
// }
