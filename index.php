<!DOCTYPE html>
<html>
<head>
    <title>TheoryOpus Test Page</title>
    <link rel="stylesheet" type="text/css" href="style.css">
    <script src="jquery.min.js"></script>
    <script type="text/javascript" src="raphael.js"></script>
    <script type="text/javascript" src="vexflow-min.js"></script>
    <script type="text/javascript" src="render.js"></script>
    <script type="text/javascript" src="score.js"></script>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <meta charset="UTF-8">
<?php
if (!isset($_SERVER["REQUEST_METHOD"]) || $_SERVER["REQUEST_METHOD"] != "GET" || !$_GET["score"]) {
?>
        <div class='error'>Try accessing this page from TODO instead.</div>
<?php 
    die();
} else {
    $score = $_GET["score"] . ".js";
    if (file_exists($score)) {
?>
            <script type="text/javascript" src="<?= $score ?>"></script>
<?php 
    } else {
?>
            <div class="error">Sorry, we don't have that score you requested! But you're welcome to pick another one TODO</div>
<?php
        die();
    }
}
?>
    <script type="text/javascript" src="control.js"></script>
</head>
<body>
    <header>
        <div></div>
    </header>    
    <div id="summarycontainer"></div>
    <div id="score">
    </div>
    <div id="pathpurgatory"></div>
</body>
</html>
