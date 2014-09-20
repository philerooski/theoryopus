"use strict";

var TIME_SIGNATURE = "C";
var NUMERICAL_TIME_SIGNATURE = "4/4";
var MEASURE_COUNT = 13;
var KEY_SIGNATURE = "Cm";
var TITLE = "Pr&eacute;lude";
var SUBTITLE = "Op. 28, No. 20";
var COMPOSER = "Fr&eacute;d&eacute;ric Chopin";
var SUMMARY = "This is an awesome piece.";
var TEMPO = "Largo";
var FORM = "ABB (binary)";
var beamGroups = null;

function Notes() {
    var TABLE_ID = "Chopin_Prelude_C_Minor";
    this.getTableId = function() {
        return TABLE_ID;
    }
}

var treble = {
    partName: "treble",
    clefType: "treble",
    m0: [
        voice().addTickables(
                [
                note(["g/3", "c/4", "e/4", "g/4"], "4"),
                note(["a/3", "c/4", "e/4", "a/4"], "4"),
                note(["e/4", "g/4"], "8d"),
                note(["d/4", "f/4"], "16"),
                note(["e/3", "g/3", "c/4", "e/4"], "4")
                ] 
                ),
    voice().addTickables(
            [
            new vf.GhostNote("2"),
            new Vex.Flow.StaveNote({
                keys: ["g/3", "b/3"], duration: "4", stem_direction: -1
            }).addAccidental(1, new vf.Accidental("n")),
            new vf.GhostNote("4")
            ] 
            ),
    voice().addTickables([
            new vf.TextNote({
                glyph: "f", duration: "1"
            }).setLine(12)
            ])
        ],
    m1: [
        voice().addTickables(
                [
                note(["e/3", "a/3", "c/4", "e/4"], "4", "bass"),
                note(["f/3", "a/3", "db/4", "f/4"], "4", "bass"),
                new vf.StaveNote({
                    keys: ["c/4", "e/4"], duration: "8d", clef: "bass", stem_direction: 1
                }),
                new vf.StaveNote({
                    keys: ["b/3", "d/4"], duration: "16", clef: "bass", stem_direction: 1
                }),
                note(["c/3", "e/3", "a/3", "c/4"], "4", "bass"),
                ] 
                ),
    voice().addTickables(
            [
            new vf.GhostNote("2"),
            new vf.StaveNote({
                keys: ["db/3", "e/3", "g/3"], duration: "4", clef: "bass", stem_direction: -1
            }).addAccidental(0, new vf.Accidental("b")),
            new vf.GhostNote("4")
            ]
            )
        ],
    m2: [
        voice().addTickables(
                [
                note(["dn/3", "f/3", "bn/3", "dn/4"], "4", "bass"),
                note(["en/3", "g/3", "bb/3", "c/4", "en/4"], "4", "bass"),
                note(["g/4"], "8d", "bass"),
                note(["f/4"], "16", "bass"),
                note(["g/3", "c/4", "eb/4"], "4", "bass")
                ] 
                ),
    voice().addTickables(
            [
            new vf.GhostNote("2"),
            new vf.StaveNote({
                keys: ["a/3", "c/4"], duration: "4", clef: "bass", stem_direction: -1
            }),
            new vf.GhostNote("4")
            ]
            )
        ],
    m3: [
        voice().addTickables(
                [
                new vf.StaveNote({
                    keys: ["f/3", "c/4", "d/4"], duration: "4"
                }).addAccidental(0, new vf.Accidental("#")),
                new vf.StaveNote({
                    keys: ["g/3", "b/3", "d/4", "g/4"], duration: "4"
                }).addAccidental(1, new vf.Accidental("n")),
                new vf.StaveNote({
                    keys: ["b/4"], duration: "8d"
                }).addAccidental(0, new vf.Accidental("n")),
                note(["an/4"], "16"),
                new vf.StaveNote({
                    keys: ["b/3", "d/4", "g/4"], duration: "4"
                }).addAccidental(0, new vf.Accidental("n"))
                ]
                ),
    voice().addTickables(
            [
            new vf.GhostNote("2"),
            new Vex.Flow.StaveNote({
                keys: ["c/4", "d/4", "f/4"], duration: "4", stem_direction: -1
            }).addAccidental(2, new vf.Accidental("#")),
            new vf.GhostNote("4")
            ] 
            )
        ],
    m4: [
        voice().addTickables([
                note(["e/4", "g/4", "e/5"], "4"),
                note(["e/4", "a/4", "e/5"], "4"),
                note(["d/4", "d/5"], "4"),
                note(["d/4", "a/4", "d/5"], "4")
                ]),
    voice().addTickables([
            new vf.GhostNote("2"),    
            new vf.StaveNote({
                keys: ["a/4"], duration: "8d"
            }),
            new vf.StaveNote({
                keys: ["f/4"], duration: "16"
            }).addAccidental(0, new vf.Accidental("#")),
            new vf.GhostNote("4")
            ]),
    voice().addTickables([
            new vf.TextNote({
                glyph: "p", duration: "1"
            }).setLine(11)
            ])
        ],
    m5: [
        voice().addTickables([
                note(["c/4", "g/4", "c/5"], "4"),
                note(["c/4", "d/4", "f#/4", "d/5"], "4"),
                note(["d/4", "g/4", "bn/4"], "8d"),
                note(["c/4", "a/4"], "16"),
                note(["bn/3", "d/4", "g/4"], "4")
                ])
        ],
    m6: [
        voice().addTickables([
                note(["c/4", "g/4", "c/5"], "4"),
                note(["a/3", "c/4", "a/4"], "4"),
                note(["g/4"], "8d"),
                note(["f/4"], "16"),
                note(["g/3", "c/4", "e/4"], "4").addAnnotation(2, new vf.Annotation("riten."))
                ]),
    voice().addTickables([
            new vf.GhostNote("2"),
            new vf.StaveNote({
                keys: ["g/3", "d/4"], duration: "4", stem_direction: -1
            }),
            new vf.GhostNote("4")
            ])
        ],
    m7: [
        voice().addTickables([
                note(["e/3", "a/3", "c/4", "e/4"], "4", "bass"),
                note(["f/3", "a/3", "db/4", "f/4"], "4", "bass"),
                note(["e/4"], "8d", "bass"),
                note(["dn/4"], "16", "bass"),
                note(["e/3", "g/3", "c/4"], "4", "bass"),
                ]),
    voice().addTickables([
            new vf.GhostNote("2"),
            new vf.StaveNote({
                keys: ["f/3", "g/3", "b/3"], duration: "4", clef: "bass", stem_direction: -1
            }).addAccidental(2, new vf.Accidental("n")),
            new vf.GhostNote("4")
            ])
        ],
    m8: [
        voice().addTickables([
                note(["e/4", "g/4", "e/5"], "4").addAnnotation(2, new vf.Annotation("(a tempo)")),
                note(["e/4", "a/4", "e/5"], "4"),
                note(["d/4", "d/5"], "4"),
                note(["d/4", "a/4", "d/5"], "4"),
                ]),
    voice().addTickables([
            new vf.GhostNote("2"),    
            new vf.StaveNote({
                keys: ["a/4"], duration: "8d"
            }),
            new vf.StaveNote({
                keys: ["f/4"], duration: "16"
            }).addAccidental(0, new vf.Accidental("#")),
            new vf.GhostNote("4")
            ])
        ],
    m9: [
        voice().addTickables([
                note(["c/4", "g/4", "c/5"], "4"),
                note(["c/4", "d/4", "f#/4", "d/5"], "4"),
                note(["d/4", "g/4", "bn/4"], "8d"),
                note(["c/4", "a/4"], "16"),
                note(["bn/3", "d/4", "g/4"], "4")
                ])
        ],
    m10: [
        voice().addTickables([
                note(["c/4", "g/4", "c/5"], "4"),
                note(["a/3", "c/4", "a/4"], "4"),
                note(["g/4"], "8d"),
                note(["f/4"], "16"),
                note(["g/3", "c/4", "e/4"], "4").addAnnotation(2, new vf.Annotation("riten."))
                ]),
    voice().addTickables([
            new vf.GhostNote("2"),
            new vf.StaveNote({
                keys: ["g/3", "d/4"], duration: "4", stem_direction: -1
            }),
            new vf.GhostNote("4")
            ])
        ],
    m11: [
        voice().addTickables([
                note(["e/3", "a/3", "c/4", "e/4"], "4", "bass"),
                note(["f/3", "a/3", "db/4", "f/4"], "4", "bass"),
                note(["e/4"], "8d", "bass"),
                note(["dn/4"], "16", "bass"),
                note(["e/3", "g/3", "c/4"], "4", "bass"),
                ]),
    voice().addTickables([
            new vf.GhostNote("2"),
            new vf.StaveNote({
                keys: ["f/3", "g/3", "b/3"], duration: "4", clef: "bass", stem_direction: -1
            }).addAccidental(2, new vf.Accidental("n")),
            new vf.GhostNote("4")
            ])
        ],
    m12: [
        voice().addTickables([
                note(["c/4", "e/4", "g/4", "c/5"], "1")
                ]),
    voice().addTickables([
            new vf.TextNote({
                glyph: "p", duration: "1"
            }).setLine(11)
            ])
        ]
}

var bass = {
    partName: "bass",
    clefType: "bass",
    m0: [
        voice().addTickables(
                [
                note(["c/2", "c/3"], "4", "bass"),
                note(["f/1", "f/2"], "4", "bass"),
                note(["g/1", "g/2"], "4", "bass"),
                note(["c/2", "g/2", "c/3"], "4", "bass"),
                ]
                )
        ],
    m1: [
        voice().addTickables(
                [
                note(["a/1", "a/2"], "4", "bass"),
                note(["db/1", "db/2"], "4", "bass"),
                note(["e/1", "e/2"], "4", "bass"),
                note(["a/1", "a/2"], "4", "bass"),
                ]
                )
        ],
    m2: [
        voice().addTickables(
                [
                note(["g/1", "g/2"], "4", "bass"),
                note(["c/1", "c/2"], "4", "bass"),
                note(["f/1", "f/2"], "4", "bass"),
                note(["c/2", "c/3"], "4", "bass")
                ] 
                )
        ],
    m3: [
        voice().addTickables(
                [
                new vf.StaveNote({
                    keys: ["d/2", "a/2", "d/3"], duration: "4", clef: "bass"
                }).addAccidental(1, new vf.Accidental("n")),
                new vf.StaveNote({
                    keys: ["g/1", "g/2"], duration: "4", clef: "bass"
                }),
                new vf.StaveNote({
                    keys: ["d/1", "d/2"], duration: "4", clef: "bass"
                }),
                new vf.StaveNote({
                    keys: ["g/1", "g/2"], duration: "4", clef: "bass"
                })
                ]
                )
        ],
    m4: [
        voice().addTickables([
                note(["c/2", "c/3"], "4", "bass"),
                note(["c/3", "c/4"], "4", "bass"),
                note(["bn/2", "bn/3"], "4", "bass"),
                note(["bb/2", "bb/3"], "4", "bass"),
                ])
        ],
    m5: [
        voice().addTickables([
                note(["an/2", "an/3"], "4", "bass"),
                note(["ab/2", "ab/3"], "4", "bass"),
                note(["g/2", "g/3"], "4", "bass"),
                note(["f/2", "f/3"], "4", "bass"),
                ])
        ],
    m6: [
        voice().addTickables([
                note(["e/2", "e/3"], "4", "bass"),
                note(["f/2", "f/3"], "4", "bass"),
                note(["bn/1", "bn/2"], "4", "bass"),
                note(["c/2", "c/3"], "4", "bass")
                ])
        ],
    m7: [
        voice().addTickables([
                note(["a/1", "a/2"], "4", "bass"),
                note(["db/1", "db/2"], "4", "bass"),
                note(["g/1", "g/2"], "4", "bass"),
                note(["c/1", "c/2"], "4", "bass"),
                ])
        ],
    m8: [
        voice().addTickables([
                note(["c/2", "c/3"], "4", "bass"),
                note(["c/3", "c/4"], "4", "bass"),
                note(["bn/2", "bn/3"], "4", "bass"),
                note(["bb/2", "bb/3"], "4", "bass"),
                ])
        ],
    m9: [
        voice().addTickables([
                note(["an/2", "an/3"], "4", "bass"),
                note(["ab/2", "ab/3"], "4", "bass"),
                note(["g/2", "g/3"], "4", "bass"),
                note(["f/2", "f/3"], "4", "bass"),
                ])
        ],
    m10: [
        voice().addTickables([
                note(["e/2", "e/3"], "4", "bass"),
                note(["f/2", "f/3"], "4", "bass"),
                note(["bn/1", "bn/2"], "4", "bass"),
                note(["c/2", "c/3"], "4", "bass")
                ])
        ],
    m11: [
        voice().addTickables([
                note(["a/1", "a/2"], "4", "bass"),
                note(["db/1", "db/2"], "4", "bass"),
                note(["g/1", "g/2"], "4", "bass"),
                note(["c/1", "c/2"], "4", "bass"),
                ]),
    voice().addTickables([
            new vf.GhostNote("2d"),
            new vf.TextNote({
                glyph: "pedal_open", duration: "4"
            }).setLine(16)
            ])
        ],
    m12: [
        voice().addTickables([
                note(["c/3", "g/3"], "1", "bass")
                ])
        ]
}

var decorations = {
    
}

var staveDecorations = {
    m0: [{
        "stave": treble,
        "method": "addEndClef",
        "clef": "bass",
        "size": "small"
    }],
    m2: [{
        "stave": treble,
        "method": "addEndClef",
        "clef": "treble",
        "size": "small"
    }],
    m6: [{
        "stave": treble,
        "method": "addEndClef",
        "clef": "bass",
        "size": "small"
    }],
    m7: [{
        "stave": treble,
        "method": "addEndClef",
        "clef": "treble",
        "size": "small"
    }],
    m10: [{
        "stave": treble,
        "method": "addEndClef",
        "clef": "bass",
        "size": "small"
    }],
    m11: [{
        "stave": treble,
        "method": "addEndClef",
        "clef": "treble",
        "size": "small"
    }]
}

var stemDirections = {
    "m4": -1,
    "m8": -1
}

var CLEFS = [treble, bass];
