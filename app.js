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

function test(){
	console.log(state.words[0]);
	console.log(state.words[1]);
	console.log(state.words[2]);
}

/*function storeResults(data, search){

	/*console.log(data);
	if(i===0){
		state.words[0].definitions = data.results;

	}
	else{
		state.words[i].definitions = data.results;

	}

	i++;

//test();
			state.words[i].definitions = data.results;
			i++;

	
}*/

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
					console.log(state.words[j]);
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
    
  });
}

$(function(){watchSubmit();});