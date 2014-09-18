"use strict";
(function() {
$(document).ready(function() {
    var notes = new Notes();
    var TABLE_ID = notes.getTableId();
    
    var scoreContainer = "#score";
    var scoreProcessor = "#pathpurgatory";
    var score = new Score(scoreContainer, scoreProcessor, 0, MEASURE_COUNT);
    score.drawStaves();
    
    var view = new View(scoreContainer, TABLE_ID);
    view.drawHeader();
    view.drawSummary();
    view.loadComments();
    
    $("#score svg").mousedown(view.scoreDrag);
    $("#score svg").click(view.scoreSelect);
    $(window).keyup(view.windowKeyUp);
    $(window).mouseup(view.checkForScoreDrag);

    var selectables = $("#score svg path");
    for (var i = 0; i < selectables.length; i++) {
        $(selectables[i]).data("id", i);
    }

});
}());
