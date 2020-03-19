
var api_base_url = 'https://api.themoviedb.org/3';

var filmBoxSrc = $('#film-box-template').html();
var filmBoxTemplate = Handlebars.compile(filmBoxSrc);

$('#search-button').click(function() {
    var searchValue = $('#search').val();
    $('#search').val('');
    $('.film-box').remove();

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
            var films = res.results;
            for (var i = 0; i < films.length; i++) {
                var film = {
                    title: films[i].title,
                    originalTitle: films[i].original_title,
                    originalLanguage: films[i].original_language,
                    voteAverage: films[i].vote_average
                }

                filmBoxTemplateHTML = filmBoxTemplate(film);
                $('.container').append(filmBoxTemplateHTML);
            }

        },
        error: function() {
            console.log('Errore');
        }
    });

});
