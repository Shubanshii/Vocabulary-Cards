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

function watchRestart() {
	$('.restart').on('click', function() {
		location.reload();
	});
}

/*function displayLastResult() {
	$('main').html(cardTemplate);
	$('.show').on('click', function(){
		$('h1').removeClass('hidden');
		$('.show').replaceWith('<a href="#" class="restart btn btn-red">Home Page</a>');
		watchRestart();

	});
}*/

/*function watchNext() {
	$('.next').on('click', function() {
		displayLastResult();
	});
}*/

/*displays definitions.  I'm considering having the definition appear on the same screen.  
Also displays the button and includes its functionality*/


/*function displayNextResult() {
	$('body').html(cardTemplate);
	$('.show').on('click', function(){
		$('h1').removeClass('hidden');
		$('.show').replaceWith('<a href="#" class="next btn btn-red">Next</a>');
		watchNext();

	});


}*/

/*empties screen to make room for the next screen's content.  Empties children, descendants and texts from 'main' and eliminates
header and footer*/
function emptyScreen() {
	//$('main').empty();
	$("main, header, footer").detach();
}

//watches click of next button.  goes back to API for next card
function watchNext(state) {
	$('.next').on('click', function() {
		placeholderVal++;
		fetchNextDefinitions();
	});
	
}

//displays last result with new button
function displayLastResult() {
	var curTerm = state.words[placeholderVal].word;
	var cardTemplate = (
	'<main class="mt-5">' + 
		'<div class="container">' +
			'<div class="row">' + 
				'<div class="col-md-12 mb-4">' +
					'<div class="card">' + 
						'<div class="card-body">' + 
							'<h1 class="card-title hidden">' + curTerm + '</h4>' + 
							'<ul>' + 
							'</ul>' + 
						'</div>' + 
					'</div>' +
				'</div>' +
			'</div>' + 
		'</div>' +
	'</main>'
	);
	//does this risk popping up information in front of user?
	$('body').html(cardTemplate);
	/*'<li class="card-text"><h3>The definitions of the word are the definitions of the word</h3></li>' +
	'<li class="card-text"><h3>The definitions of the word are the definitions of the word</h3></li>' + */
	for(var x=0; x < state.words[placeholderVal].definitions.length; x++){
		$('ul').append('<li class="card-text"><h3>' + state.words[placeholderVal].definitions[x] + '<h3></li>');
	}
	$('ul').append('<a href="#" class="show btn btn-indigo">Show</a>');
	$('.show').on('click', function(){
		$('h1').removeClass('hidden');
		$('.show').replaceWith('<a href="#" class="restart btn btn-red">Home Page</a>');
		watchRestart();

	});
}

//displays definitions
function displayNextResult() {
	var curTerm = state.words[placeholderVal].word;
	var cardTemplate = (
	'<main class="mt-5">' + 
		'<div class="container">' +
			'<div class="row">' + 
				'<div class="col-md-12 mb-4">' +
					'<div class="card">' + 
						'<div class="card-body">' + 
							'<h1 class="card-title hidden">' + curTerm + '</h4>' + 
							'<ul>' + 
							'</ul>' + 
						'</div>' + 
					'</div>' +
				'</div>' +
			'</div>' + 
		'</div>' +
	'</main>'
	);
	//does this risk popping up information in front of user?
	$('body').html(cardTemplate);
	/*'<li class="card-text"><h3>The definitions of the word are the definitions of the word</h3></li>' +
	'<li class="card-text"><h3>The definitions of the word are the definitions of the word</h3></li>' + */
	for(var x=0; x < state.words[placeholderVal].definitions.length; x++){
		$('ul').append('<li class="card-text"><h3>' + state.words[placeholderVal].definitions[x] + '<h3></li>');
	}
	$('ul').append('<a href="#" class="show btn btn-indigo">Show</a>');
	$('.show').on('click', function(){
		$('h1').removeClass('hidden');
		$('.show').replaceWith('<a href="#" class="next btn btn-red">Next</a>');
		watchNext();

	});

	
}

/*updates the definitions property of each object in state.words array, so they correspond with the correct word
this function is called as the user displays each word*/
function updateState(data) {
	console.log('logging data from updatestate', data);
	var curTerm = state.words[placeholderVal].word;
	console.log('logging curterm', curTerm)
	var headwordExists = false;
	console.log('word from update state', data);
	
	for (var i = 0; i < data.results.length; i++) {
		if(data.results.find(function(set) {
			return set.headword === curTerm;
		})) {
			headwordExists = true;
		}
	}
	if(data.results.length === 0 || headwordExists === false) {
		state.words[placeholderVal].definitions.push('Word not found.');
	}
	for(var i = 0; i < data.results.length; i++) {
		if(data.results[i].senses !== null) {
			if(data.results[i].headword === curTerm && (data.results[i].senses[0].definition !== undefined || 
				data.results[i].senses[0].signpost !== undefined)) {
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
	if(placeholderVal === state.words.length - 1){
		displayLastResult();
	}else {	
		displayNextResult();
	}

}

//grabs definitions from API and initiates callback function
function fetchNextDefinitions() {
	getDataFromApi(state.words[placeholderVal].word, updateState);
}

function ifFormEmpty() {
	alert('Please enter words before beginning.');
	location.reload();
}

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
  
	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
  
	  // Pick a remaining element...
	  randomIndex = Math.floor(Math.random() * currentIndex);
	  currentIndex -= 1;
  
	  // And swap it with the current element.
	  temporaryValue = array[currentIndex];
	  array[currentIndex] = array[randomIndex];
	  array[randomIndex] = temporaryValue;
	}
  
	return array;
  }

//updates the words array in the state variable with objects.  Each object contains a word and an empty array called 'definitions'
function createWordObjectArray() {
	var words = $(".js-query").val().split(/[ ,!.";:-]+/).filter(Boolean);
	if(words.length === 0) {
		ifFormEmpty();
	}
	for(var i=0; i<words.length; i++) {
		var word = {
			word: words[i],
			definitions: []
		}
		state.words.push(word);
	}
	shuffle(state.words)
}



//watches for user to hit button to begin project
function watchSubmit() {
	$('.js-query').keypress(function(event) {
		if (event.which == 13) {
			event.preventDefault();
			createWordObjectArray();
			emptyScreen();
			fetchNextDefinitions();
		}
	});
	$('.start-button').on("click", function(e) {
		e.preventDefault();
		createWordObjectArray();
		emptyScreen();
		fetchNextDefinitions();
		//displayNextResult();

	})
}

$(function(){watchSubmit();});