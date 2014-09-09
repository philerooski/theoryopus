<?php
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);

# files away annotations written on a score so that the rest of the world may cherish them later
# author: Phil Snyder

if (!isset($_SERVER["REQUEST_METHOD"])) {
	header("HTTP/1.1 400 Invalid Request");
	die();
} elseif ($_SERVER["REQUEST_METHOD"] == "POST") {
    $measure = $_POST["measure"];
    $voice = $_POST["voice"];
    $index = $_POST["index"];
    $table = $_POST["table"];

    $db = new PDO("mysql:dbname=theoryopus;host=vergil.u.washington.edu;port=5316", "root", "Snydph7");
    $annotation = $db->quote($_POST["annotation"]);
    $category = $db->quote($_POST["category"]);
    $clef = $db->quote($_POST["clef"]);
    $paths = $db->quote($_POST["paths"]);

    $db->exec("INSERT INTO $table VALUES ($annotation,$category,$clef,$measure,$voice,$index,$paths)");
}

// $mysqli_connection = new MySQLi('vergil.u.washington.edu', 'root', 'Snydph7', 'theoryopus', 5316);
// if($mysqli_connection->connect_error){
//    echo "Not connected, error: ".$mysqli_connection->connect_error;
// }
// else{
//    echo "Connected.";
// }
?>
