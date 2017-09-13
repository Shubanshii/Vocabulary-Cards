var baseURL = 'https://api.pearson.com/v2/dictionaries/ldoce5/entries?headword=';
var suffixURL = '&apikey=wwaDFEhNeysOIwAWZS9fczjtRAnhJFGk';
var placeholderVal = 0;
var state = {
	words: []
};

function getDataFromApi(searchTerm, callback) {
	var URL = baseURL + searchTerm + suffixURL;
	$.getJSON(URL, callback);

}

function emptyScreen(){
	$('h1, form, button, p').remove();
}

function updateDefinitions(data) {

	searchTerm = state.words[placeholderVal].word;
	for(var i = 0; i < data.results.length; i++) {
		if(data.results[i].headword === searchTerm) {
			state.words[placeholderVal].definitions.push(data.results[i].senses[0].definition[0]);
		}
		else {
			console.log(false);
		}
	}
	placeholderVal++;
}

/*function loadAPI(y)
{
  var curTerm = state.words[0].word;
  //API CALL HERE
  var URL = baseURL + curTerm + suffixURL;
  $.getJSON(URL)
      //API PROMISE --> .then()
    .then(function(data) {
    	for(var x = 0; x < data.results.length; x++) {
		if(data.results[x].headword === curTerm) {
			state.words[y].definitions.push(data.results[x].senses[0].definition[0]);
		}
		else {
			console.log(false);
		}
	}
    })
  let fakeData = 'this is fake data';
  state.arr.push(fakeData);
  if(y < state.words.length)
  { loadAPI(++y); }
  else{ /*displayFirstResult() }
  //END API PROMISE
}*/

function displayFirstDefinitions(data) {
	console.log(data);
}

//displays word and next button.  button increments placeholderVal and fetches next definition.
function displayNextWord() {
	$('.js-search-results').html('<p>' + state.words[placeholderVal].word + '</p>');
	$('.next-index-button').html('<button class="next-index-button">Next</button>');
	$('button.next-index-button').on('click', function(){
		console.log('working');
		emptyScreen();
		placeholderVal++;
		fetchNextDefinitions();
	});
}

//displays definitions and next button
function displayNextResult(){
	for(var x=0; x < state.words[placeholderVal].definitions.length; x++){
			console.log(state.words[placeholderVal].definitions[x]);
			$('.js-search-results').append('<p>' + state.words[placeholderVal].definitions[x] + '</p>');
		}
	$('.next-button').html('<button class="next-button">Next</button>');
	$('button.next-button').on('click', function(){
	 	emptyScreen();
   		displayNextWord();
   	});
}

//updates state with definitions; NTS: shouldn't need a separate function for first index
function updateState(data) {
	console.log(data.results[0].senses[0].definition !== undefined );
	console.log(data.results);
	curTerm = state.words[placeholderVal].word;
	console.log(curTerm);
	for(var i = 0; i < data.results.length; i++) {
		if(data.results[i].senses !== null) {
			if(data.results[i].headword === curTerm && (data.results[i].senses[0].definition !== undefined || data.results[i].senses[0].signpost !== undefined)) {
			if(data.results[i].senses[0].definition !== undefined) {
				state.words[placeholderVal].definitions.push(data.results[i].senses[0].definition[0]);
			}
			else if (data.results[i].senses[0].signpost !== undefined) {
				state.words[placeholderVal].definitions.push(data.results[i].senses[0].signpost);
			}
		}		
		}

		else {
			console.log(false);
		}
	}
	displayNextResult();

}

//grabs definitions
function fetchNextDefinitions() {
	getDataFromApi(state.words[placeholderVal].word, updateState);
}

function createWordObjectArray(state) {
	var words = $(".js-query").val().split(" ");
	for(var i=0; i<words.length; i++) {
		var word = {
			word: words[i],
			definitions: []
		}
		state.words.push(word);
		//getDataFromApi(state.words[i].word, updateDefinitions);
	}
	//console.log(state);	
	fetchNextDefinitions();

}

function watchSubmit() {
  $('.submitButton').on("click", function(e) {
    e.preventDefault();
    //getDataFromApi("rock", displayDictionaryData);
    createWordObjectArray(state);
    emptyScreen();
    console.log(state);
    //loadAPI(0);
  });
}

$(function(){watchSubmit();});