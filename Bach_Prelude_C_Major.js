"use strict";

var MEASURE_COUNT = 6;
var TIME_SIGNATURE = "4/4";
var KEY_SIGNATURE = "Cb";

var treble = {
	partName: "treble",
	clefType: "treble",
	m0: [
	voice().addTickables(
		[
		note(["g/5", "eb/5"], "4"),
		note(["c##/4", "a/4"], "2"),
		note(["g/4"], "4")
		]
		),
	voice().addTickables(
		[
		note(["e/4"], "16"),
		note(["cn/5", "a/4"], "16"),
		note(["g/3"], "16"),
		note(["e/4"], "16"),
		note(["cn/5", "a/4"], "16"),
		note(["g/3"], "16"),
		note(["e/4"], "16"),
		note(["cn/5", "a/4"], "16"),
		note(["g/3"], "16"),
		note(["e/4"], "16"),
		note(["cn/5", "a/4"], "16"),
		note(["g/3"], "16"),
		note(["e/4"], "16"),
		note(["cn/5", "a/4"], "16"),
		note(["g/3"], "16"),
		note(["e/4"], "16")
		]
		)
	], 
	m1: [
	voice().addTickables(
		[
		note(["c/4"], "4"),
		note(["d/4"], "16"),
		note(["f/4"], "8d"),
		note(["g/4"], "16").addModifier(0, new vf.Articulation("a.")),
		note(["ab/4"], "16").addModifier(0, new vf.Articulation("a.")),
		note(["g/4"], "16").addModifier(0, new vf.Articulation("a.")),
		note(["e/4"], "16").addModifier(0, new vf.Articulation("a.")),
		note(["f/4"], "4")
		]
		)
	],
	m2: [
	voice().addTickables(
		[
		note(["eb/5"], "4"),
		note(["c##/4", "a/4"], "2"),
		note(["g/4"], "4")
		]
		),
	voice().addTickables(
		[
		note(["e/4"], "16"),
		note(["cn/5", "a/4"], "16"),
		note(["g/3"], "16"),
		note(["e/4"], "16"),
		note(["cn/5", "a/4"], "16"),
		note(["g/3"], "16"),
		note(["e/4"], "16"),
		note(["cn/5", "a/4"], "16"),
		note(["g/3"], "16"),
		note(["e/4"], "16"),
		note(["cn/5", "a/4"], "16"),
		note(["g/3"], "16"),
		note(["e/4"], "16"),
		note(["cn/5", "a/4"], "16"),
		note(["g/3"], "16"),
		note(["e/4"], "16")
		]
		)
	], 
	m3: [
	voice().addTickables(
		[
		note(["c/4"], "4"),
		note(["d/4"], "16"),
		note(["f/4"], "8d"),
		note(["g/4"], "16"),
		note(["ab/4"], "16"),
		note(["g/4"], "16"),
		note(["e/4"], "16"),
		note(["f/4"], "4")
		]
		)
	],
	m4: [
	voice().addTickables(
		[
		note(["eb/5"], "4"),
		note(["c##/4", "a/4"], "2"),
		note(["g/4"], "4")
		]
		),
	voice().addTickables(
		[
		note(["e/4"], "16"),
		note(["cn/5", "a/4"], "16"),
		note(["g/3"], "16"),
		note(["e/4"], "16"),
		note(["cn/5", "a/4"], "16"),
		note(["g/3"], "16"),
		note(["e/4"], "16"),
		note(["cn/5", "a/4"], "16"),
		note(["g/3"], "16"),
		note(["e/4"], "16"),
		note(["cn/5", "a/4"], "16"),
		note(["g/3"], "16"),
		note(["e/4"], "16"),
		note(["cn/5", "a/4"], "16"),
		note(["g/3"], "16"),
		note(["e/4"], "16")
		]
		)
	], 
	m5: [
	voice().addTickables(
		[
		note(["c/4", "eb/4", "f/4", "ab/4", "c/5"], "4"),
		note(["d/4"], "16"),
		note(["f/4"], "8d"),
		note(["g/4"], "16"),
		note(["ab/4"], "16"),
		note(["g/4"], "16"),
		note(["e/4"], "16"),
		note(["f/4"], "4")
		]
		)
	]
}

var bass = {
	partName: "bass",
	clefType: "bass",
	m0: [
	voice().addTickables(
		[
		note(["d/4"], "4", "bass"),
		note(["c/3"], "2", "bass"),
		note(["e/3", "e/2"], "4", "bass")
		]
		)
	],
	m1: [
	voice().addTickables(
		[
		note(["g/3"], "4", "bass"),
		note(["c/3"], "2", "bass"),
		note(["e/3", "e/2"], "4", "bass")
		]
		)
	],
	m2: [
	voice().addTickables(
		[
		note(["d/4"], "4", "bass"),
		note(["c/3"], "2", "bass"),
		note(["e/3", "e/2"], "4", "bass")
		]
		)
	],
	m3: [
	voice().addTickables(
		[
		note(["g/3"], "4", "bass"),
		note(["c/3"], "2", "bass"),
		note(["e/3", "e/2"], "4", "bass")
		]
		)
	],
	m4: [
	voice().addTickables(
		[
		note(["d/4"], "4", "bass"),
		note(["c/3"], "2", "bass"),
		note(["e/3", "e/2"], "4", "bass")
		]
		)
	],
	m5: [
	voice().addTickables(
		[
		note(["g/3"], "4", "bass"),
		note(["c/3"], "2", "bass"),
		note(["e/3", "e/2"], "4", "bass")
		]
		)
	]
}

var decorations = {
	m0: [tie(treble,0,1,1,[0,1],0,1,4,[0,1]),
	tie(treble,0,1,4,[0,1],0,1,7,[0,1])],
	m1: [],
	m2: [],
	m3: [tie(treble,2,1,15,[0],3,0,6,[0])],
	m4: [],
	m5: [tie(bass,4,0,1,[0],5,0,1,[0])]
}

var CLEFS = [treble, bass];

$(document).ready(function() {
	drawStaves(CLEFS, 0, MEASURE_COUNT);
});