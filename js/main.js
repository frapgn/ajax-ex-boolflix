


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
function search(){
    var searchValue = $('#search').val();
    if ($('#search').val() != '') {
        // $('#search').val('');
        $('.box-container').remove();
        ajaxMovies(searchValue);
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
                console.log(res);
                var movies = res.results;
                 appendBox(movies);
            },
            error: function() {
                console.log('Errore');
            }
        });
    }
}

function appendBox(movies) {
    for (var i = 0; i < movies.length; i++) {
        var movie = {
            title: movies[i].title,
            originalTitle: movies[i].original_title,
            originalLanguage: movies[i].original_language,
            voteAverage: movies[i].vote_average,
            voteAveragePercentage: movies[i].vote_average * 10
        }

        if (movie.originalLanguage == 'en') {
            movie.originalLanguage = 'gb';
        }



        boxTemplateHTML = boxTemplate(movie);
        $('.container').append(boxTemplateHTML);
    }
}

function stars(vote){
    return
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
