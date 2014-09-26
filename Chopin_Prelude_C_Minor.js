"use strict";

var TIME_SIGNATURE = "C";
var NUMERICAL_TIME_SIGNATURE = "4/4";
var MEASURE_COUNT = 13;
var KEY_SIGNATURE = "Cm";
var TITLE = "Pr&eacute;lude";
var SUBTITLE = "Op. 28, No. 20";
var COMPOSER = "Fr&eacute;d&eacute;ric Chopin";
var SUMMARY = "Commonly called the \"Chord Prelude\" (or \"Funeral March\" by <a data-wiki='Hans_von_B&uuml;low'>Hans von B&uuml;low</a>), <a data-wiki='Fr&eacute;d&eacute;ric_Chopin'>Chopin</a>'s Prelude in C minor is one of the most famous and well-recognized of his preludes. While seemingly simple on the surface, the actual harmonic construction of the piece is quite complex. <a data-wiki='Sergei_Rachmaninoff'>Sergei Rachmaninoff</a> took advantage of this complexity when composing his <a href='http://youtu.be/8kaEUWZyB2Y' target='_blank'>Variatons on a Theme of Chopin</a>, a beautiful, yet incredibly technically demanding piece based on this prelude.";
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
            note(["g/3", "bn/3"], "4", "treble", -1),
            new vf.GhostNote("4")
            ] 
            ),
    voice().addTickables([
            new vf.TextDynamics({
                text: "ff", duration: "1"
            }).setLine(12)
            ]),
    voice().addTickables([
            new vf.TextNote({
                text: "i", duration: "4"
            }),
            new vf.TextNote({
                text: "iv", duration: "4", superscript: "7"
            }),
            new vf.TextNote({
                text: "V", duration: "4", superscript: "7"
            }),
            new vf.TextNote({
                text: "i", duration: "4"
            })
            ])
        ],
    m1: [
        voice().addTickables(
                [
                note(["e/3", "a/3", "c/4", "e/4"], "4", "bass"),
                note(["f/3", "a/3", "db/4", "f/4"], "4", "bass"),
                note(["c/4", "e/4"], "8d", "bass"),
                note(["b/3", "d/4"], "16", "bass"),
                note(["c/3", "e/3", "a/3", "c/4"], "4", "bass"),
                ] 
                ),
    voice().addTickables(
            [
            new vf.GhostNote("2"),
            note(["db/3", "e/3", "g/3"], "4", "bass", -1),
            new vf.GhostNote("4")
            ]
            ),
    voice().addTickables([
            new vf.TextNote({
                text: "I", duration: "4", subscript: "VI"
            }).setLine(10),
            new vf.TextNote({
                text: "IV", duration: "4", subscript: "VI"
            }).setLine(10),
            new vf.TextNote({
                text: "V", duration: "4", subscript: "VI", superscript: "7"
            }).setLine(10),
            new vf.TextNote({
                text: "I", duration: "4", subscript: "VI"
            }).setLine(10)
            ])
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
            note(["a/3", "c/4"], "4", "bass", -1),
            new vf.GhostNote("4")
            ]
            ),
    voice().addTickables([
            new vf.TextNote({
                text: "V", duration: "4", superscript: "7"
            }).setLine(10),
            new vf.TextNote({
                text: "V7/iv", duration: "4"
            }).setLine(10),
            new vf.TextNote({
                text: "iv", duration: "4"
            }).setLine(10),
            new vf.TextNote({
                text: "i", duration: "4"
            }).setLine(10)
            ])
        ],
    m3: [
        voice().addTickables(
                [
                note(["f#/3", "c/4", "d/4"], "4", "treble", -1),
                note(["g/3", "bn/3", "d/4", "g/4"], "4"),
                note(["bn/4"], "8d"),
                note(["an/4"], "16"),
                note(["bn/3", "d/4", "g/4"], "4")
                ]
                ),
    voice().addTickables(
            [
            new vf.GhostNote("2"),
            note(["c/4", "d/4", "f#/4"], "4", "treble", -1),
            new vf.GhostNote("4")
            ] 
            ),
    voice().addTickables([
            new vf.TextNote({
                text: "V7/V", duration: "4"
            }),
            new vf.TextNote({
                text: "V", duration: "4"
            }),
            new vf.TextNote({
                text: "V7/5", duration: "4"
            }),
            new vf.TextNote({
                text: "V", duration: "4"
            })
            ])
        ],
    m4: [
        voice().addTickables([
                note(["e/4", "g/4", "e/5"], "4"),
                note(["e/4", "a/4", "e/5"], "4"),
                note(["d/4", "d/5"], "4"),
                note(["d/4", "g/4", "d/5"], "4")
                ]),
    voice().addTickables([
            new vf.GhostNote("2"),    
            note(["a/4"], "8d"),
            note(["f#/4"], "16"),
            new vf.GhostNote("4")
            ]),
    voice().addTickables([
            new vf.TextDynamics({
                text: "p", duration: "1"
            }).setLine(11)
            ]),
    voice().addTickables([
            new vf.TextNote({
                text: "i", duration: "4"
            }),
            new vf.TextNote({
                text: "VI", duration: "4", superscript: "6"
            }),
            new vf.TextNote({
                text: "vii", duration: "4", superscript: vf.unicode["degrees"] + "7"
            }),
            new vf.TextNote({
                text: "v", duration: "4", superscript: "6"
            })
            ])
        ],
    m5: [
        voice().addTickables([
                note(["c/4", "g/4", "c/5"], "4"),
                note(["c/4", "d/4", "f#/4", "d/5"], "4"),
                note(["d/4", "g/4", "bn/4"], "8d"),
                note(["c/4", "an/4"], "16"),
                note(["bn/3", "d/4", "g/4"], "4")
                ]),
    voice().addTickables([
            new vf.TextNote({
                text: vf.unicode["sharp"] + "vi", duration: "4", superscript: vf.unicode["o-with-slash"] + "7"
            }),
            new vf.TextNote({
                text: "Fr+6", duration: "4"
            }),
            new vf.TextNote({
                text: "V", duration: "4"
            }),
            new vf.TextNote({
                text: "V", duration: "4", superscript: "4", subscript: "2"
            })
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
            note(["g/3", "d/4"], "4", "treble", -1),
            new vf.GhostNote("4")
            ]),
    voice().addTickables([
            new vf.TextNote({
                text: "i", duration: "4"
            }),
            new vf.TextNote({
                text: "iv", duration: "4"
            }),
            new vf.TextNote({
                text: "V", duration: "4", superscript: "6", subscript: "5"
            }),
            new vf.TextNote({
                text: "i", duration: "4"
            })
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
            note(["f/3", "g/3", "bn/3"], "4", "bass", -1),
            new vf.GhostNote("4")
            ]),
    voice().addTickables([
            new vf.TextNote({
                text: "VI", duration: "4"
            }).setLine(10),
            new vf.TextNote({
                text: "N", duration: "4"
            }).setLine(10),
            new vf.TextNote({
                text: "V", duration: "4", superscript: "7"
            }).setLine(10),
            new vf.TextNote({
                text: "i", duration: "4"
            }).setLine(10)
            ])
        ],
    m8: [
        voice().addTickables([
                note(["e/4", "g/4", "e/5"], "4").addAnnotation(2, new vf.Annotation("(a tempo)")),
                note(["e/4", "a/4", "e/5"], "4"),
                note(["d/4", "d/5"], "4"),
                note(["d/4", "g/4", "d/5"], "4"),
                ]),
    voice().addTickables([
            new vf.GhostNote("2"),    
            note(["a/4"], "8d"),
            note(["f#/4"], "16"),
            new vf.GhostNote("4")
            ]),
    voice().addTickables([
            new vf.TextDynamics({
                text: "pp", duration: "1"
            }).setLine(11)
            ]),
    voice().addTickables([
            new vf.TextNote({
                text: "i", duration: "4"
            }).setLine(-2),
            new vf.TextNote({
                text: "VI", duration: "4", superscript: "6"
            }).setLine(-2),
            new vf.TextNote({
                text: "vii", duration: "4", superscript: vf.unicode["degrees"] + "7"
            }).setLine(-2),
            new vf.TextNote({
                text: "v", duration: "4", superscript: "6"
            }).setLine(-2)
            ])
        ],
    m9: [
        voice().addTickables([
                note(["c/4", "g/4", "c/5"], "4"),
                note(["c/4", "d/4", "f#/4", "d/5"], "4"),
                note(["d/4", "g/4", "bn/4"], "8d"),
                note(["c/4", "an/4"], "16"),
                note(["bn/3", "d/4", "g/4"], "4")
                ]),
    voice().addTickables([
            new vf.TextNote({
                text: vf.unicode["sharp"] + "vi", duration: "4", superscript: vf.unicode["o-with-slash"] + "7"
            }).setLine(-2),
            new vf.TextNote({
                text: "Fr+6", duration: "4"
            }).setLine(-2),
            new vf.TextNote({
                text: "V", duration: "4"
            }).setLine(-2),
            new vf.TextNote({
                text: "V", duration: "4", superscript: "4", subscript: "2"
            }).setLine(-2)
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
            note(["g/3", "d/4"], "4", "treble", -1),
            new vf.GhostNote("4")
            ]),
    voice().addTickables([
            new vf.TextNote({
                text: "i", duration: "4"
            }).setLine(-2),
            new vf.TextNote({
                text: "iv", duration: "4"
            }).setLine(-2),
            new vf.TextNote({
                text: "V", duration: "4", superscript: "6", subscript: "5"
            }).setLine(-2),
            new vf.TextNote({
                text: "i", duration: "4"
            }).setLine(-2)
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
            note(["f/3", "g/3", "bn/3"], "4", "bass", -1),
            new vf.GhostNote("4")
            ]),
    voice().addTickables([
            new vf.TextNote({
                text: "VI", duration: "4"
            }).setLine(10),
            new vf.TextNote({
                text: "N", duration: "4"
            }).setLine(10),
            new vf.TextNote({
                text: "V", duration: "4", superscript: "7"
            }).setLine(10),
            new vf.TextNote({
                text: "i", duration: "4"
            }).setLine(10)
            ])
        ],
    m12: [
        voice().addTickables([
                note(["c/4", "e/4", "g/4", "c/5"], "1").addModifier(0, new vf.Articulation("a@a").setPosition(vf.Modifier.Position.ABOVE))
                .addModifier(0, new vf.Articulation("a>").setYShift(-15))
                ]),
    voice().addTickables([
            new vf.TextDynamics({
                text: "p", duration: "1"
            }).setLine(11)
            ]),
    voice().addTickables([
            new vf.TextNote({
                text: "i", duration: "1"
            })
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
                note(["d/2", "an/2", "d/3"], "4", "bass"),
                note(["g/1", "g/2"], "4", "bass"),
                note(["d/1", "d/2"], "4", "bass"),
                note(["g/1", "g/2"], "4", "bass")
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
                note(["c/3", "g/3"], "1", "bass").addModifier(0, new vf.Articulation("a@a").setPosition(vf.Modifier.Position.ABOVE))
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
