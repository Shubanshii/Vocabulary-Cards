var WORDS_BASE_URL = 'https://wordsapiv1.p.mashape.com/words/';
var i=0;
var state = {
	words: []
};

function getDataFromApi(searchTerm){
	  var settings = {
    url: 'https://wordsapiv1.p.mashape.com/words/' + searchTerm + '',
    data: {},
    dataType: 'json',
    type: 'GET',
   /* success: function(data){
      callback(data, searchTerm);
    },
    error: function(err) { alert(err); },*/
    beforeSend: function(xhr) {
    xhr.setRequestHeader("X-Mashape-Authorization", "5QNhUGUmVamshQCbuFO6ykRJBCqFp1nqhQgjsnNahs0JInCns7");
      }
  };

  return $.ajax(settings);
}

function displayFirstResult(){
	console.log('working');
	setTimeout(function(){
		for(var i=0; i < state.words[0].definitions.length; i++){
			console.log(state.words[0].definitions[i].definition);
			$('.js-search-results').append('<p>' + state.words[0].definitions[i].definition + '</p>');
		}
		$('.next-button').html('<button>Next</button>');
	}, 3000);

}

function emptyScreen(){
	$('h1, form, button').remove();
}

function createWordObjectArray(state){
	var words = $(".js-query").val().split(" ");
	for(var i=0; i<words.length; i++){
		var word = {
			word: words[i],
			definitions: ''
		}
		state.words.push(word);

		(function(j) {		
			getDataFromApi(state.words[j].word)
				.then(function(data) {
					//console.log(data); 
					state.words[j].definitions = data.results;
					//console.log(state.words[j]);
				})
				.catch(function(err){
					console.log(err);
				})
		})(i);
	}
	//console.log(state);

}


function watchSubmit() {
  $('.submitButton').on("click", function(e) {
    e.preventDefault();
    createWordObjectArray(state);
    emptyScreen();
    	    displayFirstResult();

  });
}

$(function(){watchSubmit();});