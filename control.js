"use strict";
(function() {
$(document).ready(function() {
    var notes = new Notes();
    var noteInfo = notes.getInfo();
    
    var score = new Score("#score", noteInfo.CLEFS, 0, noteInfo.MEASURE_COUNT);
    score.drawStaves(noteInfo.KEY_SIGNATURE, noteInfo.beamGroups, noteInfo.decorations);
    
    var view = new View("#score", noteInfo.TABLE_ID);
    view.drawHeader(noteInfo.TITLE, noteInfo.COMPOSER);
    view.drawSummary(noteInfo.SUMMARY, noteInfo.KEY_SIGNATURE, noteInfo.TEMPO,
        noteInfo.FORM, noteInfo.TIME_SIGNATURE, noteInfo.MEASURE_COUNT);
    
    $("#score").mousedown(view.scoreDrag);
    $("#score svg").click(view.scoreSelect);
    $(window).keyup(view.windowKeyUp);
    $(window).mouseup(view.checkForScoreDrag);

    var selectables = $("#score svg path");
    for (var i = 0; i < selectables.length; i++) {
        $(selectables[i]).data("id", i);
    }

});


}());
