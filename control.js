"use strict";
(function() {
$(document).ready(function() {
    var score = new Score("#score", CLEFS, 0, MEASURE_COUNT);
    score.drawStaves();
    var view = new View("#score");
    $("#score").mousedown(view.scoreDrag);
    $("#score svg").click(view.scoreSelect);
    $(window).keyup(view.windowKeyUp);
    $(window).mouseup(view.checkForScoreDrag);

    var selectables = $("#score svg path");
    for (var i = 0; i < selectables.length; i++) {
        $(selectables[i]).data("id", i);
    }
    drawHeader();
    drawSummary();
});

function drawHeader() {
    $("header").html("");
    $("header").html(TITLE);
    if (COMPOSER) $("header").append("<div id='composer'>" + COMPOSER + "</div>"); 
}

function drawSummary() {
    $("#summarycontainer").html("");
    if (SUMMARY) $("#summarycontainer").html("<div id='programnotes'><strong>Program Notes:</strong> " + SUMMARY + "</div>");
    // TODO: replace all this with a definition list
    $("#summarycontainer").append("<div id='quickfacts'><strong>Quick Facts:</strong></br></br>"
            + "<strong>Primary Key:</strong> " + KEY_SIGNATURE + "</br>"
            + "<strong>Tempo:</strong> " + TEMPO + "</br>"
            + "<strong>Form:</strong> " + FORM + "</br>"
            + "<strong>Primary Time Signature:</strong> " + TIME_SIGNATURE + "</br>"
            + "<strong>Total Measures:</strong> " + MEASURE_COUNT + "</div>");
    // TODO: quit hacking and just type out all the margin and border styles
    $("#programnotes, #quickfacts").css("width", parseInt($(window).width()/2 - 40)); 
}
}());
