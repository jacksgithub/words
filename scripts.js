(function(){

	// load words JSON file

	var path = 'words.js';
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
		if (xhr.readyState === 4 && xhr.status === 200)
			main(xhr.responseText);
    };
    xhr.open("GET", path, true);
    xhr.send();
})();


function main(json)
{

	// **************************************************************************
	// var declarations
	// **************************************************************************
	var cl				= function(input) {	console.log(input); };	// debug

	var WORDS			= JSON.parse(json);
	var body				= document.getElementsByTagName("body")[0];
	var container		= document.getElementById('wrapper');
	var form_wrapper	= document.getElementById('form-wrapper');
	var words			= [];	// array of words in JSON file 
	var wh				= [];	// word history
	var cursor			= -1;	// current spot in word history; -1 start for 0-index

	// quiz
	var qsub				= document.getElementById('quiz-sub');
	var qwhc				= []; // correct words 
	var qwhi				= []; // incorrect words
	var qwh				= []; // quiz word history


	// **************************************************************************
	// main 
	// **************************************************************************

	// create array of all words 
	for (var w in WORDS)
		words.push(w);

	// init
	displayMenu();
	displayWord( randomWord() );



	// **************************************************************************
	// custom functions
	// **************************************************************************
	// menu (event handlers & init)
	function displayMenu()
	{
		// links: next, previous, all, quiz
		var ul			= document.createElement('ul');	
		var a 			= '';
		var li 			= '';
		var fn 			= '';
		var links		= {'new word':newWord, 'previous':previous, 'all':all, 'add word':add, 'quiz':quiz};

		ul.id				= 'menu';

		for (var k in links)
		{
				li				= document.createElement('li');
				a				= document.createElement('a');
				a.href      = '#';
				a.innerHTML = k;
				fn          = (links[k]);
				a.onclick   = function(f){ return function(e)
				{ 
					e.preventDefault(); 
					
					if ( getStyle(container, 'display') == 'none' )
					{
						form_wrapper.style.display = 'none';
						container.style.display = 'block';
					};

					f(); 
				}; }(fn);
				li.appendChild(a);
				ul.appendChild(li);
		};
		body.insertBefore(ul, container);
	};

	function newWord() 
	{
		var rw	= randomWord();

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
	function add()
	{
		clearContent();
		body.className = 'add';
	};

	// **************************************************************************
	// quiz functions
	// **************************************************************************
	function quiz()
	{
      body.className = 'single quiz-load';

      var next       = document.createElement('a');
      next.id			= 'quiz-next';
		next.innerHTML = 'next';
      next.onclick   = function(){ quizWord(); };

      var end        = document.createElement('a');
		end.innerHTML	= 'end';
      end.id			= 'quiz-end';
      end.onclick		= function(){ quizEnd(); };

		// qsub is global
		qsub.appendChild(next);
		qsub.appendChild(end);

		body.className = body.className.replace(/quiz-load/,'quiz');

		quizWord();
	};
	function quizWord()
	{
      clearContent();
		var qp = qsub.getElementsByTagName('p');
		if(qp.length > 0)
			qp[0].innerHTML = '';

		if (qwh.length == words.length)
		{
			var msg = 'End of words.';
			quizEnd(msg);	
		};

		var word			= ''; // current word
		var qwords		= '';	// words whose definitions are used this question
		var tmpword		= ''; // tmp word for loop w/ possible (incorrect) definition options 
		var def			= ''; // one correct def for current word
		var defs			= []; // possible definitions (only 1 correct)
		var i				= 1;

		while (qwh[(word = randomWord())] !== undefined)
			continue;
		qwords += ', '+word;	// add to 
		qwh.push(word);	// add to quiz word history

		def				= WORDS[word]['definitions'][(Math.floor(Math.random() * WORDS[word]['definitions'].length))];
		defs.push(def);

		while (i < 5)
		{
			if (!qwords.match(tmpword = randomWord()))
			{
				var tmpdefs	= WORDS[tmpword]['definitions'];
				var rand		= Math.floor(Math.random() * tmpdefs.length);

				defs.push(tmpdefs[rand]);
				i++;
			};
		};

		displayWord(word, defs);


		var ul					= document.getElementsByClassName('definitions')[0];
		var lis					= ul.getElementsByTagName('li');

		for (var j = 0; j <lis.length; j++)
		{
			var a					= document.createElement('a');
			a.href				= '#';
			a.className			= 'quiz-answers';
			a.innerHTML			= lis[j].innerHTML;
			lis[j].innerHTML	= '';

			a.onclick			= function(e) {
				e.preventDefault();
			
				this.word		= word;	
				this.correct	= def;
				quizVerifyAnswer(this.word, this.correct, this.innerHTML);
			};

			lis[j].appendChild(a);
		};




		// TODO: button to display results, see correct/incorrect, retry incorrect, end & exit quiz


		/*
		FLOW:
		select random word
		if word not in correct / incorrect
			select addl random defs
			build links w/ definitions
			display random word & defs
			display addl defs
			button for next word
			button for end quiz (display quiz totals)
		else if total words in quiz less than word total
			select new random word & back to if
		else
			quiz done (display quiz totals)
		*/

	};
	function quizVerifyAnswer(word, correct, guess)
	{
		var html = '';

		if (correct == guess)
		{
			html = guess+' <span class="correct">is correct</span>';
			qwhc.push(word);
		}
		else
		{
			html = guess+' <span class="incorrect">is incorrect</span>';
			qwhi.push(word);
		};

		if (this.p == undefined)
		{
			this.p				= document.createElement('p');
			this.p.className	= 'quiz-msg';
			qsub.appendChild(this.p);
		};
		
		this.p.innerHTML = html;
		qwh.push(word);
	};
	function quizEnd(msg)
	{
		var p			= document.createElement('p');
		p.className	= 'quiz-msg';
		p.innerHTML	= msg;

		qsub.appendChild(p);
	};
	// end quiz


	// word display functions
	function wordHistory(rw)
	{
		wh.push(rw);
	};

	function randomWord()
	{
		var rand = Math.floor(Math.random() * words.length);
		return words[rand];
	};

	function displayWord(word, definitions)
	{
		var defs					= definitions || WORDS[word]['definitions'];
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
			cursor = wh.length-1; // cursor at end of word history
		};
	};

	function displayAll()
	{
		clearContent();

		body.className = 'all';

		for (var i in WORDS)
			displayWord(i);
	};
	// end word display functions



	// **************************************************************************
	// helper functions 
	// **************************************************************************
	function createList(items, elem_section)
	{
		var ul				= document.createElement('ul');		
		ul.className		= 'definitions';

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

	function getStyle(elem, style)
	{
		var css = '';

		if (window.getComputedStyle)
			css = window.getComputedStyle(elem, null)[style]; // FF
		else
			css = elem.currentStyle[style]; // IE

		return css;
	};
	// end helper functions
						

}; // end main
