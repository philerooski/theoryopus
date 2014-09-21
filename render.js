"use strict";

// renders a score notated in js/VexFlow to the user's screen
// author: Phil Snyder

var STAVE = {
    "x": 10,
    "verticalPadding": 140,
    "clefOffset": 20,
    "timeSigOffset": 25,
    "notePadding": 20,
    "minWidth": 300
}

var vf = Vex.Flow;
var renderer;
var ctx;

function Score(containingDiv, processingDiv, currentMeasure, end) {
    var self = this;
    // TODO: This code is janky as fuck
    this.initNewStaveLine = function(lineNum) {
        var i = 0;
        // TODO: instead of lineNum, use $.data to store line number info
        var DisplayCommentLine = function(clef) {
            $(containingDiv).append("<div id='" + clef.partName + "_" + lineNum + "' class='annotationcontainer'></div>");
        }
        DisplayCommentLine(CLEFS[0]);
        $(containingDiv).append("<div id='line_" + lineNum + "'></div>");
        i++;
        DisplayCommentLine(CLEFS[1]);
        $(containingDiv).append("<hr></hr>"); 
        var paper = document.getElementById("line_" + lineNum);
        renderer = new vf.Renderer(paper, vf.Renderer.Backends.RAPHAEL);
        ctx = renderer.getContext();
        return true;
    }

    this.calculateVoicesWidth = function(CLEFS, currentMeasure, measureCount) {
        var thisMeasuresVoices = [];
        for (var i = 0; i < CLEFS.length; i++) {
            var currentVoiceMeasure = "m" + (currentMeasure + measureCount);
            CLEFS[i][currentVoiceMeasure].forEach(function(voice) { 
                if (voice.tickables[0].keys) {
                    thisMeasuresVoices.push(voice);
                }
            });
        }
        var width = new vf.Formatter().preCalculateMinTotalWidth(thisMeasuresVoices);
        return width;
    }

    this.drawStaves = function() { 
        var grandStaff = [];
        var currentLine = 0;
        var currentLineMeasure = 0;
        var LineMeasuresVoicesWidth = [];
        var LineMeasuresStaveWidth = [];
        //TODO: this should really be a constant somewhere
        var lineWidth = parseInt($(window).width() - STAVE.x - 20);
        var lineWidthSoFar = 0;
        var keySigOffset = Vex.Flow.keySignature.keySpecs[KEY_SIGNATURE].num * 10;
        var newLine = this.initNewStaveLine(currentLine);
        var spareChange; // extra width we can add to the min rendering width of each measure/stave
        while (currentMeasure < end) {
            if (newLine) {
                spareChange = 0;
                var measureWidthSoFar = 0;
                var measureCount = 0; // which potential line measure we are evaluating
                var spaceLeft = true;
                while (spaceLeft && currentMeasure + measureCount < end) {
                    var thisStavesWidth = 0;
                    var minVoicesWidth = this.calculateVoicesWidth(CLEFS, currentMeasure, measureCount);
                    var reservedSpace = 0; // for things like staveDecorations, keySignatures, etc
                    thisStavesWidth += minVoicesWidth;
                    if (!measureCount) {
                        reservedSpace += STAVE.clefOffset + keySigOffset;
                        if (!currentLine) {
                            reservedSpace += STAVE.timeSigOffset;
                        }
                    }
                    //TODO: does this actually do anything?
                    if (staveDecorations && staveDecorations["m" + measureCount]) {
                        reservedSpace += STAVE.clefOffset;
                    }
                    if (thisStavesWidth <= STAVE.minWidth) {
                        thisStavesWidth = STAVE.minWidth;
                        minVoicesWidth = thisStavesWidth - reservedSpace;
                    }
                    if (measureWidthSoFar + thisStavesWidth < lineWidth) {
                        measureWidthSoFar += thisStavesWidth;
                        LineMeasuresVoicesWidth.push(minVoicesWidth);
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
            for (var i = 0; i < CLEFS.length; i++) {
                var currentStave = new vf.Stave(STAVE.x + lineWidthSoFar, 
                        i == 0 ? STAVE.verticalPadding/5 : i * STAVE.verticalPadding, staveWidth);
                if (staveDecorations && staveDecorations["m" + currentMeasure]) {
                    $(staveDecorations["m" + currentMeasure]).each(function() {
                        if (CLEFS[i] == this.stave) {
                            if (this.method == "addEndClef") {
                                currentStave.addEndClef(this.clef, this.size);
                            }
                        }
                    })    
                }
                if (!currentLineMeasure) {
                    currentStave.addClef(CLEFS[i].clefType); 
                    currentStave.addKeySignature(KEY_SIGNATURE); // order is... 
                    if (!currentLine) {
                        currentStave.addTimeSignature(TIME_SIGNATURE); // important!!
                    }
                } else {
                    currentStave.clef = CLEFS[i].clefType;
                }
                currentStave.setContext(ctx).draw(); 
                if (!CLEFS[0]["m" + (currentMeasure + 1)]) {
                    new vf.Barline(vf.Barline.type.END, currentStave.width + STAVE.x).draw(currentStave);
                }
                grandStaff.push(currentStave);
            }
            self.drawNotes(CLEFS, grandStaff, currentMeasure, voicesWidth);
            grandStaff = [];
            currentMeasure++;
            currentLineMeasure++;
            lineWidthSoFar += staveWidth;
            if (currentLineMeasure == LineMeasuresStaveWidth.length) {
                this.organizeSVG(currentLine, lineWidth, CLEFS.length * 100, true); 
                $(processingDiv).children().appendTo("#line_" + currentLine + "> svg");
                if (currentMeasure != end) {
                    currentLine++;
                    currentLineMeasure = 0;
                    lineWidthSoFar = 0;
                    LineMeasuresVoicesWidth = [];
                    LineMeasuresStaveWidth = [];
                    newLine = this.initNewStaveLine(currentLine);
                }
            }
        }
    }

    this.drawNotes = function(CLEFS, staves, measure, voicesWidth) {
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
        var allVoices = [];
        var allJoinedVoices = {};
        $(CLEFS).each(function() {
            var currentClef = this;
            var voiceCounter = 0;
            $(this["m" + measure]).each(function() {
                this.clef = currentClef;
                this.voiceCount = voiceCounter;
                voiceCounter++;
                if (allJoinedVoices[currentClef.partName]) {
                    allJoinedVoices[currentClef.partName].push(this);
                } else {
                    allJoinedVoices[currentClef.partName] = [this];
                }
                if (!this.tickables[0].keys) {
                    $(this.tickables).each(function() {
                        this.setContext(ctx);
                    });
                }
            }) 
            allVoices = allVoices.concat(this["m" + measure]);
        });
        var formatter = new vf.Formatter();
        for (var key in allJoinedVoices) {
            formatter.joinVoices(allJoinedVoices[key]);
        }
        // formatter.createModifierContexts(allVoices);
        formatter.format(allVoices, voicesWidth - STAVE.notePadding);
        $(allVoices).each(function() {
            var currentVoice = this;
            var beamable = false;
            $(currentVoice.tickables).each(function() {
                if (this.keys) beamable = true;
            })
            if (beamable) {
                var beams = [];
                if (beamGroups) {
                    var count = beamGroups.split("/")[0];
                    var noteType = beamGroups.split("/")[1];
                    var fraction = new vf.Fraction(count, noteType);
                    beams.push(vf.Beam.generateBeams(thisVoice.tickables, {groups: [fraction]}));
                } else {
                    // TODO: think of more creative hack </sarcasm>
                    var stemD = 1;
                    if (stemDirections && stemDirections["m" + measure]) {
                        stemD = stemDirections["m" + measure];
                    }
                    beams.push(vf.Beam.generateBeams(currentVoice.tickables, {
                        stem_direction: stemD
                    }));
                }
            }
            var thisStave;
            staves.forEach(function(stave) {
                if (stave.clef == currentVoice.clef.partName) {
                    thisStave = stave;
                }
            });
            currentVoice.draw(ctx, thisStave);
            var lineNum = parseInt(renderer.sel.id.split("_")[1]);
            self.voiceDraw(ctx, thisStave, currentVoice, currentVoice.clef.clefType, measure, currentVoice.voiceCount, lineNum); 
            $(beams).each(function() {
                this.forEach(function(beam) {
                    beam.setContext(ctx).draw();
                });
            });
        }); 
        // TODO: ties don't work sometimes when beginning measure != 0 && other funky behavior
        if (decorations && decorations["m" + measure]) {
            var theseDecorations = decorations["m" + measure];
            $(theseDecorations).each(function() {
                this.setContext(ctx).draw();
            });
        }
    }

    this.voiceDraw = function(context, stave, thisVoice, clef, measure, thisVoiceCount, line) {
        var theseSVGs = $("#line_" + line).find("path");
        //TODO: how the hell do I group chords without using the convoluted coord system??!?!?!?!
        // friendly hint from a past Phil: big block chords will have horizontal overlap in note head paths,
        // regular triadic type stuff will have equavilant left/right properties
        var notes = thisVoice.tickables;
        theseSVGs.each(function() {
            var svgPosition = this.getBoundingClientRect();
            for (var i = 0; i < notes.length; i++) {
                var note = notes[i];
                var accidentalSomewhere;
                if (note.note_heads) {
                    for (var j = 0; j < note.note_heads.length; j++) {
                        var noteHead = note.note_heads[j];
                        var supposedPosition = parseInt(svgPosition.left);
                        var thisIsAnAccidental = note.keyProps[j].accidental && noteHead.x - supposedPosition < 40 && supposedPosition < noteHead.x;
                        // var thisIsAStem = (Math.abs(supposedPosition - noteHead.x) < 15 && svgPosition.width * 8 < svgPosition.height);
                        if (noteHead.isDisplaced()) {
                            console.log();
                        }
                        if (((!noteHead.taken && (supposedPosition === parseInt(noteHead.x) 
                            || (noteHead.isDisplaced() && Math.abs(supposedPosition - noteHead.x) < 15))) // is a !taken note
                            || thisIsAnAccidental && note.keyProps[j].accidental) // or accidental 
                            && (svgPosition.width > 5 && svgPosition.height > 8 && svgPosition.width * 5 > svgPosition.height)) { // and has note-like dimension
                                var noteIncrementer = note.keys.length - 1 - j; // !!! note names must be ordered low->high in score file 
                                if (note.stem_direction == 1) {
                                    noteIncrementer = j;
                                }
                                $(this).data({
                                    "index": i,
                                    "note": note.keys[noteIncrementer],
                                    "accidental": note.keyProps[j].accidental,
                                    "duration": note.duration
                                });
                                if (!thisIsAnAccidental) noteHead.taken = true;
                                break;
                            }
                    }
                }
            }
            $(this).data({
                "clef": clef, 
            "measure": measure,
            "voice": thisVoiceCount,
            "line": line,
            });
        });
        $(theseSVGs).appendTo(processingDiv);
    }

    this.organizeSVG = function(lineNum, lineWidth, lineHeight) {
        var thisSVG = "#line_" + lineNum + " svg";
        $(thisSVG).attr("width", lineWidth + STAVE.x + 10);
        $(thisSVG).removeAttr("style");
        var lowestPoint = 0;
        $(thisSVG).children().each(function() {
            var height = parseInt($(this).attr("y"));
            if (height > lowestPoint) {
                lowestPoint = height;
            }
        });
        $(thisSVG).attr("height", lowestPoint + 40);
        return thisSVG;
    }
}

function note(keys_arg, duration_arg, clef_arg, sd_arg) {
    var note = new vf.StaveNote({ keys: keys_arg, duration: duration_arg, clef: clef_arg, stem_direction: sd_arg});
    for (var i = 0; i < keys_arg.length; i++) {
        var accidental = note.keyProps[i].accidental;
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
    var timeSig = NUMERICAL_TIME_SIGNATURE.split("/");
    return new vf.Voice({
        num_beats: timeSig[0],
           beat_value: timeSig[1],
           resolution: vf.RESOLUTION
    });
}
