// how do i modularize this file?

var placeholderVal = 0;
var state = {
	words: []
};


function getDataFromApi(searchTerm, callback) {
	// THIS APP IS FOR PERSONAL USE.  I BUILT IT TO LEARN HOW TO MAKE API CALLS
	// AND USE THE DATA
	var url = "https://dictionaryapi.com/api/v3/references/learners/json/" + searchTerm + "?key=557292e0-2038-430d-929b-e805b0afd354"

	$.getJSON(url, updateState)
	
}

function watchRestart() {
	$('.restart').on('click', function() {
		location.reload();
	});
}

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
	
	
	$('body').html(cardTemplate);

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
	console.log('logging data from updatestate', data)
	var curTerm = state.words[placeholderVal].word;
	
	if(data.length===0) {
		alert(`${curTerm} not found`)
		location.reload()
	} 
	else if(data[0].shortdef==undefined) {
		alert(`${curTerm} not found`)
		location.reload()
	} else {
		// state.words[placeholderVal].definitions.push(data.shortdef);
		// is there a way to just add the array all at once instead of iterating 
		// through it?
		for(var i = 0; i < data[0].shortdef.length; i++) {
			state.words[placeholderVal].definitions.push(data[0].shortdef[i])
			console.log('logging shortdef from inside else statement ', data[0].shortdef[i])
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
	console.log('words var inside createwordobjectarray', words)

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
		if (event.which === 13) {
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

	})
}

$(function(){watchSubmit();});