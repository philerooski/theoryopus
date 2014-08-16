"use strict"

var MEASURE_COUNT = 1;
var TIME_SIGNATURE = "6/4";
var KEY_SIGNATURE = "Ab";
var beamGroups = "6/8";

var treble = {
	partName: "treble",
	clefType: "treble",
	m0: [
	voice().addTickables(
		[
		note(["c/5"], "8r"),
		note(["e/4"], "8"),
		note(["a/4"], "8"),
		note(["c/5"], "8"),
		note(["a/4"], "8"),
		note(["e/4"], "8"),
		note(["c/5"], "8r"),
		note(["e/4"], "8"),
		note(["a/4"], "8"),
		note(["c/5"], "8"),
		note(["a/4"], "8"),
		note(["e/4"], "8"),
		]
		),
	voice().addTickables(
		[
		note(["c/4"], "2d"),
		note(["c/4"], "2d")
		]
		)
	]
	// m1: [
	// voice().addTickables(
	// 	[
	// 	note(["c/4"], "8r"),
	// 	note(["e/3"], "8"),
	// 	note(["a/4"], "8"),
	// 	note(["c/4"], "8"),
	// 	note(["a/4"], "8"),
	// 	note(["e/3"], "8"),
	// 	note(["c/4"], "8r"),
	// 	note(["e/3"], "8"),
	// 	note(["a/4"], "8"),
	// 	note(["c/4"], "8"),
	// 	note(["a/4"], "8"),
	// 	note(["e/3"], "8"),
	// 	]
	// 	),
	// ],
	// m2: [
	// voice().addTickables(
	// 	[
	// 	note(["g/5", "eb/5"], "4"),
	// 	note(["c##/4"], "2"),
	// 	note(["g/4"], "4")
	// 	]
	// 	),
	// ],
	// m3: [
	// voice().addTickables(
	// 	[
	// 	note(["g/5", "eb/5"], "4"),
	// 	note(["c##/4"], "2"),
	// 	note(["g/4"], "4")
	// 	]
	// 	),
	// ],
}

var bass = {
	partName: "bass",
	clefType: "bass",
	m0: [
	voice().addTickables(
		[
		note(["a/2"], "4", "bass"),
		note(["d/3"], "4r", "bass"),
		note(["d/3"], "4r", "bass"),
		note(["d/3"], "2dr", "bass")
		]
	)
	]
}

var decorations = {
	m0: []
}

var CLEFS = [treble, bass];

$(document).ready(function() {
	drawStaves(CLEFS, 0, MEASURE_COUNT);
});