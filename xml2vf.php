<?php

header("Content-type: text/plain");
error_reporting(E_ALL);
$score = simplexml_load_file("helloworld.xml");
$note = $score->part[0]->measure->note->pitch->step;
$parts = $score->part;

echo $note;

foreach ($parts as $part) {
	$measures = $part->measure;
	$voice_groups = array();
	foreach ($measures as $measure) {
		$notes = array();
	}
}

?>