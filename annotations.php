<?php
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);

# files away annotations written on a score so that the rest of the world may cherish them later
# author: Phil Snyder

if (!isset($_SERVER["REQUEST_METHOD"]) || $_SERVER["REQUEST_METHOD"] != "POST") {
	header("HTTP/1.1 400 Invalid Request");
	die("ERROR 400: Invalid request - This service accepts only POST requests.");
}

$annotation = $_POST["annotation"];
$coords = $_POST["coordinates"];
$paths = implode(",", $_POST["paths"]);
$entry = $coords . ":" . $annotation . ":" . $paths . PHP_EOL;
# sort
list($clef, $measure, $voice, $index) = explode(":", $coords);
$data = NULL;
if (file_exists("data.txt")) {
	$data = array_filter(explode(PHP_EOL, file_get_contents("data.txt")));
}

// $db = new PDO("mysql:dbname=theoryopus;unix_socket=/da00/d28/phil0/mysql.sock", "root", "Snydph7!");
// $rows = $db->query("select * from test");
// foreach ($rows as $row) {
// 	echo ($row);
// }
$mysqli_connection = new MySQLi('vergil.u.washington.edu', 'root', 'Snydph7!', 'theoryopus', 5316);
if($mysqli_connection->connect_error){
   echo "Not connected, error: ".$mysqli_connection->connect_error;
}
else{
   echo "Connected.";
}
// file_put_contents("data.txt", "");
// if ($data) {
// 	$inserted = false;
// 	for ($i = 0; $i < count($data); $i++) {
// 		$d = $data[$i] . PHP_EOL;
// 		if (!$inserted) {
// 			list($dclef, $dmeasure, $dvoice, $dindex) = array_slice(explode(":", $d), 0, 4);
// 			if ($clef == $dclef) {
// 				if ($measure == $dmeasure) {
// 					if ($voice == $dvoice) {
// 						if ($index >= $dindex) {
// 							$inserted == true;
// 						}
// 					} else if ($voice > $dvoice) {
// 						$inserted = true;
// 					}
// 				} else if ($measure > $dmeasure) {
// 					$inserted = true;
// 				}
// 				if ($inserted) {
// 					$d .= $entry;
// 					$inserted = true;
// 				}
// 			} else {
// 				$d = $entry . $d;
// 				$inserted = true;
// 			}
// 		}
// 		file_put_contents("data.txt", $d, FILE_APPEND);
// 	}
// } else {
// 	file_put_contents("data.txt", $entry);
// }

// file_put_contents("data.txt", , FILE_APPEND);
?>
