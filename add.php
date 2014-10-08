<?php
// add words to JSON file

// vars
$word			= trim($_GET['add-word']);
$part			= trim($_GET['add-part']);
$defs			= trim($_GET['add-definitions']);
$examples	= trim($_GET['add-examples']);

// verify/sanitize input
$verify		= array();
$reg_word	= '/^[a-zA-Z]+$/';
$reg_part	= '/^(noun|verb|adjective)$/';
$reg_chars	= '/^[a-zA-Z0-9\'"_()*&!?@#$%+\s<>-]{1,500}$/';

$defs			= htmlentities($defs);
$examples	= htmlentities($examples);

$verify['word']		= preg_match($reg_word, $word);
$verify['part']		= preg_match($reg_part, $part);
$verify['defs']		= preg_match($reg_chars, $defs);
$verify['examples']	= preg_match($reg_chars, $examples);


// build array for new word parts
$input = array();

$a_defs		= preg_split('/\n|\r|\n\r|\r\n/', $defs);
$a_examples	= preg_split('/\n|\r|\n\r|\r\n/', $examples);

$input['part']				= $part;
$input['definitions']	= $a_defs;
$input['examples']		= $a_examples;


// open words JSON file & decode to array
$file		= 'words.js';
$json		= file_get_contents($file);

$words	= json_decode($json, true);
$words[$word]	= $input;					// add new word & sort
ksort($words);							
$words			= json_encode($words);	// encode back to json & write back to file

file_put_contents($file, $words);

$msg = '"'. ucfirst($word) . '" was added successfully!';
header('Location: index.php?msg='.$msg);
?>
