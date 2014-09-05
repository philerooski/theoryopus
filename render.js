"use strict";

// renders a score notated in js/VexFlow to the user's screen
// author: Phil Snyder

var STAVE = {
"x": 10,
"verticalPadding": 100,
"clefOffset": 10,
"timeSigOffset": 25,
"notePadding": 25
}

// $.get("Bach_Prelude_C_Major.js", function(data) {
// 	console.log(data);
// });

var vf = Vex.Flow;
var renderer;
var ctx;
var coords = [];
var SVGloaded = false;


function note(keys_arg, duration_arg, clef_arg) {
	var note = new vf.StaveNote({ keys: keys_arg, duration: duration_arg, clef: clef_arg });
	for (var i = 0; i < keys_arg.length; i++) {
		var accidental = note.keyProps[i].accidental
		if (accidental) {
			note.addAccidental(i, new vf.Accidental(accidental));
		}
	}
	if (duration_arg.indexOf("d") != -1) {
		note.addDotToAll();
	}
	return note;
}

function tie(clef, beginMeasure, beginVoice, beginChord, beginNote, endMeasure, endVoice, endChord, endNote) {
	var tieNotes = {
		first_note: clef["m" + beginMeasure][beginVoice].tickables[beginChord],
		last_note: clef["m" + endMeasure][endVoice].tickables[endChord],
		first_indices: beginNote,
		last_indices: endNote
	} 
	return new vf.StaveTie(tieNotes);
}

function voice() {
	var timeSig = TIME_SIGNATURE.split("/");
	return new vf.Voice({
		num_beats: timeSig[0],
		beat_value: timeSig[1],
		resolution: vf.RESOLUTION
	});
}

// TODO: This code is janky as fuck
function initNewStaveLine(lineNum) {
	var i = 0;
	var DisplayCommentLine = function() {
		$("#score").append("<div id='" + CLEFS[i].partName + "_" + lineNum + "' class='annotationcontainer'></div>");
	}
	DisplayCommentLine();
	$("#score").append("<div id='line_" + lineNum + "'></div>");
	i++;
	DisplayCommentLine();
        // $("#score").append("<hr></hr>"); Do we need to seperate each comment div with an hr?
	var paper = $("#line_" + lineNum);
	renderer = new vf.Renderer(paper, vf.Renderer.Backends.RAPHAEL);
	ctx = renderer.getContext();
	return true;
}

function calculateVoicesWidth(clefs, currentMeasure, measureCount) {
	var thisMeasuresVoices = [];
	for (var i = 0; i < clefs.length; i++) {
		var currentVoiceMeasure = "m" + (currentMeasure + measureCount);
		clefs[i][currentVoiceMeasure].forEach(function(voice) { 
			thisMeasuresVoices.push(voice);
		});
	}
	var width = new vf.Formatter().preCalculateMinTotalWidth(thisMeasuresVoices);
	return width;
}

function drawStaves(clefs, currentMeasure, end) {
	var grandStaff = [];
	var currentLine = 0;
	var currentLineMeasure = 0;
	var LineMeasuresVoicesWidth = [];
	var LineMeasuresStaveWidth = [];
	var lineWidth = parseInt($(window).width() - STAVE.x - 50);
	var lineWidthSoFar = 0;
	var keySigOffset = Vex.Flow.keySignature.keySpecs[KEY_SIGNATURE].num * 10;
	var newLine = initNewStaveLine(currentLine);
	var spareChange; // extra width we can add to the min rendering width of each measure/stave
	while (currentMeasure < end) {
		if (newLine) {
			spareChange = 0;
			var measureWidthSoFar = 0;
			var measureCount = 0; // which potential line measure we are evaluating
			var spaceLeft = true;
			while (spaceLeft && currentMeasure + measureCount < end) {
				var thisStavesWidth = 0;
				var theseVoicesWidth = calculateVoicesWidth(clefs, currentMeasure, measureCount);
				thisStavesWidth += theseVoicesWidth;
				if (!measureCount) {
					thisStavesWidth += STAVE.clefOffset + keySigOffset;
					if (!currentLine) {
						thisStavesWidth += STAVE.timeSigOffset;
					}
				}
				if (measureWidthSoFar + thisStavesWidth < lineWidth) {
					measureWidthSoFar += thisStavesWidth;
					LineMeasuresVoicesWidth.push(theseVoicesWidth);
					LineMeasuresStaveWidth.push(thisStavesWidth);
					measureCount++;
					spareChange = parseInt((lineWidth - measureWidthSoFar) / measureCount);
				} else {
					spaceLeft = false;
				}
			}
			newLine = false;
		}
		var voicesWidth =  LineMeasuresVoicesWidth[currentLineMeasure] + spareChange;
		var staveWidth = LineMeasuresStaveWidth[currentLineMeasure] + spareChange;
		for (var i = 0; i < clefs.length; i++) {
			var currentStave = new vf.Stave(STAVE.x + lineWidthSoFar, i * STAVE.verticalPadding, staveWidth);
			if (!currentLineMeasure) {
				currentStave.addClef(clefs[i].clefType); 
				currentStave.addKeySignature(KEY_SIGNATURE); // order is... 
				if (!currentLine) {
					currentStave.addTimeSignature(TIME_SIGNATURE); // important!!
				}
			} else {
				currentStave.clef = clefs[i].clefType;
			}
			currentStave.setContext(ctx).draw(); 
			grandStaff.push(currentStave);
		}
		drawNotes(clefs, grandStaff, currentMeasure, voicesWidth);
		grandStaff = [];
		currentMeasure++;
		currentLineMeasure++;
		lineWidthSoFar += staveWidth;
		if (currentLineMeasure == LineMeasuresStaveWidth.length) {
			organizeSVG(currentLine, lineWidth, clefs.length * 100, true);
			if (currentMeasure != end) {
				currentLine++;
				currentLineMeasure = 0;
				lineWidthSoFar = 0;
				LineMeasuresVoicesWidth = [];
				LineMeasuresStaveWidth = [];
				newLine = initNewStaveLine(currentLine);
			}
		}
	}
	SVGloaded = true;
}

function drawNotes(clefs, staves, measure, voicesWidth) {
	var beams = [];
	var max_x = 0;
	for (var stave = 0; stave < staves.length; stave++) {
		var this_x = staves[stave].getNoteStartX();
		if (this_x > max_x) {
			max_x = this_x;
		}
	}
	for (stave = 0; stave < staves.length; stave++) {
		staves[stave].setNoteStartX(max_x);
	}
	clefs.forEach(function(clef) {
		var formatter = new vf.Formatter();
		formatter.format(clef["m" + measure], voicesWidth - STAVE.notePadding);
		var voiceCount = 0;
		clef["m" + measure].forEach(function(voice) {
			if (beamGroups) {
				var count = beamGroups.split("/")[0];
				var noteType = beamGroups.split("/")[1];
				var fraction = new vf.Fraction(count, noteType);
				beams.push(vf.Beam.generateBeams(voice.tickables, {groups: [fraction]}));
			} else {
				beams.push(vf.Beam.generateBeams(voice.tickables));
			}
			var thisStave;
			staves.forEach(function(stave) {
				if (stave.clef == clef.partName) {
					thisStave = stave;
				}
			});
			voice.draw(ctx, thisStave);
			var noteIndex = 0;
			voice.tickables.forEach(function(note) {
				var theseCoords = note.getBoundingBox();
				theseCoords.x = parseInt(note.context.paper.canvas.offsetLeft + theseCoords.x);
				note.location = {};
				note.location.clef = clef.clefType;
				note.location.measure = measure;
				note.location.voice = voiceCount;
				note.location.index = noteIndex;
				note.location.lineNum = parseInt(renderer.sel[0].id.split("_")[1]);
				theseCoords.staveNote = note;
				coords.push(theseCoords);
				noteIndex++;
			});
			voiceCount++;
		});
	});
	beams.forEach(function(beamSet) {
		beamSet.forEach(function(beam) {
			beam.setContext(ctx).draw();
		});
	});
	// TODO: ties don't work sometimes when beginning measure != 0 && other funky behavior
	var theseDecorations = decorations["m" + measure];
	theseDecorations.forEach(function(decoration) {
		decoration.setContext(ctx).draw();
	});
}

function organizeSVG(lineNum, lineWidth, lineHeight) {
	$("body > svg").attr("width", lineWidth + STAVE.x + 10);
	$("body > svg").removeAttr("style");
	$("body > svg").appendTo($("#line_" + lineNum));
	var thisSVG = "#line_" + lineNum + " svg";
	var lowestPoint = 0;
	$(thisSVG).children().each(function() {
		var height = parseInt($(this).attr("y"));
		if (height > lowestPoint) {
			lowestPoint = height;
		}
	});
	$(thisSVG).attr("height", lowestPoint + 20);
	return thisSVG;
}
