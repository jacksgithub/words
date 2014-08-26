<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Tom</title>
  <meta name="description" content="Tom">
  <meta name="author" content="Tom">
  <link rel="stylesheet" href="../css/normalize.css">
  <link rel="stylesheet" href="styles.css?v=1.0">
  <!--[if lt IE 9]>
  <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
  <![endif]-->
</head>

<body>
	<!--
	<section class="container">
		<div class="word"></div>
		<div class="part"></div>
		<ul class="definitions"></ul>
	</section>
	-->
  <div id="wrapper"></div>

<?php
if ($_GET['msg'] && preg_match('/^[a-zA-Z0-9!\',\s-]+$/',$_GET['msg']))
{
	echo '<p id="msg">';
	echo $_GET['msg'];
	echo '</p>';
};
?>

	<div id="form-wrapper">
		<form method="get" action="add.php">
		<p>
			<input type="text" name="add-word" placeholder="Word to add" />
			<select name="add-part">
				<option value="noun">noun</option>
				<option value="verb">verb</option>
				<option value="adjective">adjective</option>
			</select>
		</p>	
		<p>
			<label for="add-definitions">Definitions <span>(separate by new line)</span>:</label>
			<textarea name="add-definitions"></textarea>
		</p>
		<p>
			<label for="add-examples">Examples <span>(separate by new line)</span>:</label>
			<textarea name="add-examples"></textarea>
		</p>
		<p>
			<input type="submit" name="submit" value="add word" />
		</p>
		</form>
	</div>
	
  <script src="scripts.js"></script>
</body>
</html>
