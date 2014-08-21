
(function(){

// **************************************************************************
// var declarations
// **************************************************************************
var cl 			= function(input) {	console.log(input); };	// debug

var body 		= document.getElementsByTagName("body")[0];
var container	= document.getElementById('wrapper');
var words 		= [];	// words from WORDS JSON
var wh 			= [];	// word history
var cursor		= -1;	// current spot in word history; -1 start for 0-index


// **************************************************************************
// main
// **************************************************************************

// get list of words from JSON obj
for (var w in WORDS)
	words.push(w);

// init
displayMenu();
displayWord( randomWord() );



// **************************************************************************
// custom functions
// **************************************************************************
function displayMenu()
{
	// links: next, previous, all, quiz
	var ul			= document.createElement('ul');	
	var a 			= '';
	var li 			= '';
	var fn 			= '';
	var links		= {'new_word':next, 'previous':previous, 'all':all, 'quiz':quiz};

	ul.id			= 'menu';

	for (var k in links)
   {
	      li				= document.createElement('li');
			a				= document.createElement('a');
			a.href      = '#';
			a.innerHTML = k;
			fn          = (links[k]);
			a.onclick   = function(f){ return function(e){ e.preventDefault(); f(); }; }(fn);
			li.appendChild(a);
			ul.appendChild(li);
	};
	body.insertBefore(ul, container);
};

function next() 
{
	var rw = randomWord();

	clearContent();
	body.className = 'single';
	displayWord(rw);
};
function previous() 
{
	clearContent();
	if (cursor > 0) cursor--;
	body.className = 'previous';
	displayWord( wh[cursor] );
};
function all() 
{
	displayAll();
};
function quiz() 
{
	cl('quiz ok');
};

function wordHistory(rw)
{
	wh.push(rw);
};

function randomWord()
{
	var rand = Math.floor(Math.random() * words.length);
	return words[rand];
};

function displayWord(word)
{
	var elem_section		= document.createElement('section');
	var elem_word			= document.createElement('div');
	var elem_part			= document.createElement('div');
	var elem_examples		= document.createElement('div');
	elem_section.className 	= 'container';
	elem_word.className		= 'word';
	elem_part.className		= 'part';
	elem_examples.className = 'examples';

	elem_word.innerHTML 	= word;
	elem_part.innerHTML 	= WORDS[word]['part'];
	var defs					= WORDS[word]['definitions'];
	var examples			= WORDS[word]['examples'];

	elem_section.appendChild(elem_word);
	elem_section.appendChild(elem_part);

	createList(defs, elem_section);
	createList(examples, elem_examples);

	elem_section.appendChild(elem_examples);

	container.appendChild(elem_section);

	if (!body.className.match('all|previous'))
	{
		wordHistory(word);
		cursor = wh.length-1;
	};
};

function displayAll()
{
	clearContent();

	body.className = 'all';

	for (var i in WORDS)
		displayWord(i);
};

function createList(items, elem_section)
{
	var ul				= document.createElement('ul');		

	for (var i = 0; i < items.length; i++)
	{
		var li 			= document.createElement('li');
		li.innerHTML 	= items[i];
		ul.appendChild(li);
	};	
	elem_section.appendChild(ul);
};

function clearContent()
{
	container.innerHTML = '';
};


/* ****************** QUIZ ****************** */
function quiz()
{
	// TODO
	// links: submit
	// checks: show defs / show words / show either	

	// var: score
	// array: correct
	// array: incorrect
};

})();
