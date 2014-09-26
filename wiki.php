<?php

# returns the first paragraph and first thumbnail image from a topics wikipedia page

ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);

if (!isset($_SERVER["REQUEST_METHOD"])) {
	header("HTTP/1.1 400 Invalid Request");
	die();
} elseif ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET["topic"])) {
    $topic = $_GET["topic"];
    $ch = curl_init("http://en.wikipedia.org/wiki/" . $topic);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_BINARYTRANSFER, true);
    $content = curl_exec($ch);
    curl_close($ch);
    $paragraphs = array();
    preg_match('/<p.*<\/p>/', $content, $paragraphs);
    $img = array();
    preg_match('/<img.*class="thumbimage".*>/', $content, $img);
    $imgsrc = array();
    preg_match('/src="\/\/upload.wikimedia.org.*\.(jpg|jpeg|png)"/', $img[0], $imgsrc);
    echo preg_replace("/\[\d\]/", "", strip_tags($paragraphs[0])) . "&&&&" 
        . substr($imgsrc[0], 7, strlen(trim($imgsrc[0])) - 8) . "&&&&" . $topic;
}
