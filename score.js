"use strict";

// handles user interaction with the score
// author: Phil Snyder

function View(containingDiv, TABLE_ID) {
    var annotations = [];
    var mouseDrag = false;
    var currentSelection = [];
    var self = this;

    this.drawHeader = function() {
        $("header").html("");
        $("header").html("<div id='title' class='title'>" + TITLE + "</div>");
        if (SUBTITLE) $("header").append("<div id='subtitle' class='title'>" + SUBTITLE + "</div>");
        if (COMPOSER) $("<div id='composer'>" + COMPOSER + "</div>").insertAfter("header"); 
    }

    this.drawSummary = function() {
        $("#summarycontainer").html("");
        if (SUMMARY) $("#summarycontainer").html("<div id='programnotes'><strong>Program Notes:</strong> " + SUMMARY + "</div>");
        $("#summarycontainer").append("<div id='quickfacts'><strong>Quick Facts:</strong></br><ul>"
                + "<li><strong>Primary Key:</strong> " + KEY_SIGNATURE + "</li>"
                + "<li><strong>Tempo:</strong> " + TEMPO + "</li>"
                + "<li><strong>Form:</strong> " + FORM + "</li>"
                + "<li><strong>Primary Time Signature:</strong> " + NUMERICAL_TIME_SIGNATURE + "</li>"
                + "<li><strong>Total Measures:</strong> " + MEASURE_COUNT + "</li></ul></div>")
            $("body").append("<audio src='http://javanese.imslp.info/files/imglnks/usimg/6/6a/IMSLP110304-PMLP02344-25_Chopin-_Prelude_no._20_in_C_minor.mp3' controls></audio>");
        // TODO: quit hacking and just type out all the margin and border styles
        $("#programnotes, #quickfacts").css("width", parseInt($(window).width()/2 - 40)); 
    }
    this.windowKeyUp = function(e) {
        if (e.keyCode == 27) { // esc
            $(".annotationcreator").remove();
            $("path").attr("fill", "black");
            currentSelection = [];
        }
    }

    this.loadComments = function(tableID) {
        $.ajax({
            type: "GET",
        url: "annotations.php", 
        data: {
            table_id: TABLE_ID
        },
        dataType: "json",
        complete: self.displayComments
        });  
    }

    /*var fakejax = [{"text":"The world's first comment!","category":"melody","clef":"treble","measure":"0","voice":"0","index":"0","paths":"[11,12,13,14,15,16,17,18,19,20]"},{"text":"The world's second comment :)","category":"harmony","clef":"treble","measure":"0","voice":"0","index":"3","paths":"[25,26,27,28,29,30,31,33,35]"},{"text":"Music is like, my life.","category":"rhythm","clef":"treble","measure":"1","voice":"0","index":"3","paths":"[68]"},{"text":"Mine too!","category":"form","clef":"treble","measure":"1","voice":"0","index":"3","paths":"[68]"},{"text":"Bass comments for all the baes out there.","category":"none","clef":"bass","measure":"1","voice":"0","index":"3","paths":"[95]"},{"text":"A comment on the second line, say wha?!?!?!?!","category":"rhythm","clef":"bass","measure":"5","voice":"0","index":"2","paths":"[271]"}];*/
    this.displayComments = function(xhr, status) {
        var json = JSON.parse(xhr.responseText);
        $(json).each(function() {
            var text = this.text;  
            var category = this.category;
            var clef = this.clef;
            var measure = this.measure;
            var voice = this.voice;
            var index = this.index;
            var pathIndices = JSON.parse(this.paths).sort(function(a, b) {
                return a - b;
            });
            var notes = $("path");        
            var anchor;
            for (var i = 0; i < notes.length; i++) {
                var noteData = $(notes[i]).data();
                if (noteData.clef == clef && noteData.measure == measure && noteData.voice == voice && noteData.index == index) {
                    anchor = notes[i];
                    break;
                }
            }
            var danchor = $(anchor).data();
            var locationData = {
                "clef": danchor.clef,
                "measure": danchor.measure,
                "voice": danchor.voice,
                "index": danchor.index 
            }
            var containingElement = $("#" + clef + "_" + $(anchor).data().line)[0];
            var listContainer = self.buildAnnotationList(containingElement, anchor, locationData);
            var list = listContainer.children[0];
            self.sortByX(listContainer, containingElement);
            var paths = [];
            var currentlyLookingFor = 0;
            $("path").each(function() {
                if (pathIndices.length != currentlyLookingFor && $(this).data().id == pathIndices[currentlyLookingFor]) {
                    paths.push(this);
                    currentlyLookingFor++;
                }
            });
            var li = self.createLi(text, category);
            self.assignAnnotationHoverHandlers(li, paths);
            list.appendChild(li);
            containingElement.appendChild(listContainer);
        });
        $(".annotationcontainer").each(function() {
            var lists = this.children;
            var container = this;
            $(lists).each(function() {
                if (container.id.indexOf("treble" != -1)) {
                    self.adjustAnnotationHeight(this, "bottom");
                } else if (container.id.indexOf("bass") != -1) {
                    self.adjustAnnotationHeight(this, "top");
                }
            });
        });
        $(".annotationcontainer").each(function() {
            self.tightWrapAnnotations(this);
        });
    }

    this.checkForScoreDrag = function(e) {
        $(".selectbox").remove();
        $(window).unbind("mousemove");
        $("body").removeClass("noselect");
        if (mouseDrag) {
            var upX = e.pageX;
            var upY = e.pageY;
            if (!currentSelection.length) {
                $(".annotationcreator").remove();
                $("path").attr("fill", "black");
            }
            var selectedNotes = self.findSVGRange(downX, downY, upX, upY);
            if (!currentSelection.length) self.createAnnotation(selectedNotes);
            var firstNote;
            for (var i = 0; i < selectedNotes.length; i++) {
                var color = "blue";
                if (e.altKey) {
                    color = "black";
                }
                $(selectedNotes[i]).attr("fill", color);
            }
            if (selectedNotes.length) $(selectedNotes).each(function(){currentSelection.push(this)});
        }
    }

    var downX;
    var downY;

    // handles the drag select behavior for the score
    this.scoreDrag = function(e) {
        if (e.button == 0) {
            downX = e.pageX;
            downY = e.pageY;
            var selectBox = document.createElement("div");
            selectBox.style.top = downY + "px";
            selectBox.style.left = downX + "px";
            selectBox.classList.add("selectbox");
            $(selectBox).appendTo(containingDiv);
            mouseDrag = false;
            $(window).mousemove(function(event) {
                mouseDrag = true;
                $("body").addClass("noselect");
                var width = (event.pageX - downX);
                var height = (event.pageY - downY);
                if (width >= 0 && height >= 0) {
                    $(".selectbox").css("left", downX + "px");
                    $(".selectbox").css("top", downY + "px");
                    $(".selectbox").css("width", width + "px");
                    $(".selectbox").css("height", height + "px");
                } else {
                    var left = downX + width;
                    var top = downY + height;
                    if (width < 0 && height < 0) {
                        $(".selectbox").css("left", left + "px");
                        $(".selectbox").css("width", (downX - left) + "px");
                        $(".selectbox").css("top", top + "px");
                        $(".selectbox").css("height", (downY - top) + "px");
                    } else if (width < 0) {
                        $(".selectbox").css("left", left + "px");
                        $(".selectbox").css("width", (downX - left) + "px");
                        $(".selectbox").css("height", height + "px");
                    } else if (height < 0) {
                        $(".selectbox").css("top", top + "px");
                        $(".selectbox").css("height", (downY - top) + "px");
                        $(".selectbox").css("width", width + "px");
                    }
                }
            });
        }
    }

    // what to do when note(s) on the score are selected
    this.scoreSelect = function(e) {
        var x = e.pageX;
        var y = e.pageY;
        $(window).unbind("mousemove");
        if (!mouseDrag) {
            if (!$(".annotationcreator")) currentSelection = []; // in case of accidental click selection is preserved
            var SVGnote = self.findSVG(x, y);
            if (SVGnote) {
                currentSelection = [];
                var color = "blue";
                if ($(SVGnote[0]).attr("fill") == "blue") {
                    color = "black";
                    $(".annotationcreator").remove();
                } else {
                    $("path").attr("fill", "black");
                    self.createAnnotation(SVGnote);
                    currentSelection.push(SVGnote);
                }
                $(SVGnote).each(function() {
                    $(this).attr("fill", color);
                });
                return 1; // fixes strange bug in mozilla
            } else if (!$(".annotationcreator")) {
                $("path").attr("fill", "black");
            }
        } else {
            mouseDrag = false;
        }
    }

    // creates an annotation editor box and handles annotation submition + placement
    this.createAnnotation = function(paths) {
        // init stuff
        var firstPath; 
        var maxX = $(window).width();
        var minY = $(window).height();
        $(paths).each(function() {
            var thisX = this.getBoundingClientRect().left;
            var thisY = this.getBoundingClientRect().top;
            if (thisX < maxX && thisY - 200 < minY) {
                firstPath = this;
                maxX = thisX;
                minY = thisY;
            }
        });
        var locationData = $(firstPath).data();
        var containingDiv = "#" + locationData.clef + "_" + locationData.line;
        var containingElement = document.getElementById(containingDiv.slice(1));
        var annotation = document.createElement("div");
        annotation.classList.add("annotationcreator");

        var textarea = document.createElement("textarea");

        var categories = document.createElement("div");
        categories.classList.add("categories");

        var submit = document.createElement("div");
        $(submit).addClass("annotationsubmit annotationsubmitinvalid");
        submit.innerHTML = "Submit";

        // categories
        var melody = document.createElement("div");
        var harmony = document.createElement("div");
        var rhythm = document.createElement("div");
        var form = document.createElement("div");
        var none = document.createElement("div");
        var catArray = ["melody", "harmony", "rhythm", "form", "none"];
        var catVarArray = [melody, harmony, rhythm, form, none];

        annotation.appendChild(textarea);
        annotation.appendChild(categories);
        annotation.appendChild(submit);

        // method definitions
        var removePreviousAnnotationEditor = function() {
            var previousACreatorContainer = document.getElementsByClassName("annotationcreator")[0];
            if (previousACreatorContainer) {
                $(".annotationcreator").remove();
            }
        }

        // returns an rgb to rgba with half opacity
        var falseColorize = function(element) {
            var fullColor = $(element).css("backgroundColor");
            var falseColor = "rgba" + fullColor.slice(3, fullColor.length - 1) + ", 0.5)";
            return falseColor;
        }

        // change the color of the submit button depending on the level of completeness of annotation
        var checkForSubmitValidity = function() { 
            if (textarea.value.length) {
                var hasCategory = false;
                for (var i = 0; i < catArray.length; i++) {
                    if (submit.classList.contains(catArray[i])) {
                        hasCategory = true;
                    }
                }
                if (hasCategory) {
                    $(submit).css("backgroundColor", "");
                    submit.classList.add("annotationsubmitvalid");
                }
            } else {
                $(submit).css("backgroundColor", falseColorize(submit));
                submit.classList.remove("annotationsubmitvalid");
            }
        }

        // displays categories within the annotation editor
        var initCategoryBehavior = function() {
            for (var i = 0; i < catVarArray.length; i++) {
                catVarArray[i].innerHTML = catArray[i].charAt(0).toUpperCase() + catArray[i].slice(1);
                catVarArray[i].classList.add(catArray[i]);
                $(catVarArray[i]).click(function(e) {
                    for (var j = 0; j < catArray.length; j++) {
                        submit.classList.remove(catArray[j]);
                        catVarArray[j].classList.remove("categoryhighlight");
                    }
                    this.classList.add("categoryhighlight");
                    $(submit).css("backgroundColor", ""); // inherits styling from stylesheet instead
                    submit.classList.remove("annotationsubmitinvalid");
                    submit.classList.add(this.innerHTML.charAt(0).toLowerCase() + this.innerHTML.slice(1));
                    if (!textarea.value.length) {
                        $(submit).css("backgroundColor", falseColorize(submit));
                    }
                });
                categories.appendChild(catVarArray[i]);
            }
        }

        // appends annotation editor to appropriate div and assigns behavior/position
        var displayAnnotationEditor = function() {
            $(annotation).appendTo(containingDiv);
            if (containingElement.offsetTop < parseInt(firstPath.getBoundingClientRect().top)
                    + window.pageYOffset) { // if the note lies below its comment box
                        var topOffset = containingElement.offsetTop + containingElement.offsetHeight - $(annotation).height();
                        if (topOffset <= 0) {
                            // TODO: 200 should not be hard coded
                            annotation.style.top = containingElement.offsetTop + containingElement.offsetHeight + 200 + "px";
                        } else {
                            annotation.style.top = topOffset + "px";
                        }
                    } else {
                        annotation.style.top = containingElement.offsetTop + "px";
                    }

            textarea.focus();
            if (parseInt(firstPath.getBoundingClientRect().left) + parseInt($(annotation).css("width")) > $(window).width()) {
                annotation.style.left = $(window).width() - parseInt($(annotation).css("width")) - 20 + "px";
            } else {
                annotation.style.left = parseInt(firstPath.getBoundingClientRect().left) + "px";
            }
            $(annotation).hover(function() {
                annotation.style.opacity = 1;
            }, function() {
                $(annotation).animate({opacity: "0.25"}, 200);
            });
        }

        $(submit).hover(checkForSubmitValidity);
        $(textarea).keyup(checkForSubmitValidity);
        removePreviousAnnotationEditor();
        checkForSubmitValidity();
        initCategoryBehavior();
        displayAnnotationEditor(); 

        // add the new annotation to the document in the appropriate position
        $(submit).click(function() {
            var thisCategory;
            $(catArray).each(function() {
                if (submit.classList.contains(this)) {
                    thisCategory = this;
                }
            });

            // This is a valid annotation to add to the score, right?
            var areWeGoodToGo = function() {
                if (!textarea.value.length) {
                    self.jiggle(textarea, 3);
                    textarea.focus();
                    return false;
                } else if (!thisCategory) {
                    self.jiggle(categories, 3);
                    return false;
                } else {
                    return true;
                }
            }

            if (areWeGoodToGo()) {
                $(annotation).remove();

                // are their already annotations beginning on this note?
                var existingList = function() {
                    for (var i = 0; i < annotations.length; i++) {
                        if (locationData.measure == annotations[i].measure
                                && locationData.clef == annotations[i].clef
                                && locationData.voice == annotations[i].voice
                                && locationData.index == annotations[i].index) {
                                    return annotations[i].list;
                                }
                    }
                    return null;
                }

                var list = existingList();
                var listContainer = self.buildAnnotationList(containingElement, firstPath, locationData);
                if (!list) list = listContainer.children[0];
                self.sortByX(listContainer, containingElement);
                var note = self.createLi(textarea.value, thisCategory);
                list.appendChild(note);
                var indicesSelected = self.assignAnnotationHoverHandlers(note, currentSelection); 
                var ajaxTest = {
                    "measure": parseInt(locationData.measure),
                    "voice": parseInt(locationData.voice),
                    "index": parseInt(locationData.index),
                }
                if (ajaxTest.measure == NaN || ajaxTest.voice == NaN || ajaxTest.index == NaN) {
                    console.log("this note isn't valid");
                }
                $. ajax({
                    type:"POST",
                url: "annotations.php",
                data: {
                    "annotation": textarea.value,
                "clef": locationData.clef,
                "measure": parseInt(locationData.measure),
                "voice": parseInt(locationData.voice),
                "index": parseInt(locationData.index),
                "paths": JSON.stringify(indicesSelected),
                "category": thisCategory,
                "table": TABLE_ID
                },
                complete: self.checkAnnotationStatus
                });  

                // sort on screen
                var theseChildren = containingElement.children;
                // TODO: Make top/bottom diffentiation more versatile (generalizable across many types of clefs)
                for (var i = 0; i < theseChildren.length; i++) {
                    if (locationData.clef == "treble") { 
                        self.adjustAnnotationHeight(theseChildren[i], "bottom");
                    } else if (locationData.clef == "bass") {
                        self.adjustAnnotationHeight(theseChildren[i], "top");
                    }
                }
                var allContainers = document.getElementsByClassName("annotationcontainer");
                for (var j = 0; j < allContainers.length; j++) {
                    self.tightWrapAnnotations(allContainers[j]);
                }
                $("path").attr("fill", "black");
                currentSelection = [];
            }
        });
    }

    this.createLi = function (text, category) {
        var li = document.createElement("li");
        li.innerHTML = text;
        li.classList.add(category);
        if (category == "melody" || category == "rhythm") {
            li.classList.add("categoryhighlight");
        }
        return li;
    }

    this.assignAnnotationHoverHandlers = function(li, notesSelected) {
        $(li).hover(function() {
            $(notesSelected).each(function() {
                $(this).attr("fill", "blue");
            });
        }, function() {
            $(notesSelected).each(function() {
                $(this).attr("fill", "black");
            });
        });
        var indicesSelected = [];
        $(notesSelected).each(function() {
            indicesSelected.push($(this).data("id"));
            $(this).hover(function() {
                li.classList.add("annotationhighlight");
            }, function() {
                li.classList.remove("annotationhighlight");
            });
        });
        return indicesSelected;
    }

    this.sortByX = function(toInsert, containingElement) {
        var children = containingElement.children;
        if (children.length) {
            var inserted = false;
            for (var i = children.length - 1; i >= 0; i--) {
                if (parseInt(children[i].style.left) < parseInt(toInsert.style.left)) {
                    containingElement.insertBefore(toInsert, children[i].nextSibling);
                    inserted = true;
                    break;
                }
            }
            if (!inserted) {
                containingElement.insertBefore(toInsert, containingElement.firstChild);
            }
        } else {
            containingElement.appendChild(toInsert);
        }
    }
    /* builds a wrapper for ol that contains annotations
     * containingElement: parent of wrapper
     * anchor: note (<path>) that acts as an anchor and determines position of container
     * locationData: {clef,measure,voice,index}
     */
    this.buildAnnotationList = function(containingElement, anchor, locationData) {
        var listContainer = document.createElement("div");
        listContainer.classList.add("listannotation");
        listContainer.style.left = parseInt(anchor.getBoundingClientRect().left) + "px";
        listContainer.style.top = parseInt(containingElement.offsetTop) + "px";
        var list = document.createElement("ol");
        listContainer.appendChild(list);
        locationData.list = list;
        annotations.push(locationData);
        return listContainer;
    }

    // TODO: for now, debug, but eventually error checking
    this.checkAnnotationStatus = function(xhr, status) {
        if (status != "success") {
            console.log(this.status);	
        } else {
            console.log(xhr.responseText);
        }
    }

    // "wraps" annotation wrappers around each other so they don't lie on top of each other
    this.adjustAnnotationHeight = function(wrapper, direction) {
        var containerTop = wrapper.parentNode.offsetTop;
        var containerBottom = containerTop + wrapper.parentNode.offsetHeight;
        var containerChildren = wrapper.parentNode.children;
        if (wrapper.getAttribute("modified") != "true") {
            if (direction == "bottom") { // if treble/top stave  
                wrapper.style.top = (containerBottom - wrapper.clientHeight) + "px";
            } else if (direction == "top") {
                wrapper.style.top = containerTop + "px";
            }
        }
        var childX = parseInt(wrapper.style.left);
        var childY = parseInt(wrapper.style.top);
        var childWidth = wrapper.clientWidth;
        var childHeight = wrapper.clientHeight;
        var childBottom = childY + childHeight;
        var childRight = childX + childWidth;
        var childrenLength = containerChildren.length;
        for (var k = 0; k < childrenLength; k++) {
            if (containerChildren[k] != wrapper) {
                var thisContainer = containerChildren[k];
                var thisX = parseInt(thisContainer.style.left);
                var thisY = parseInt(thisContainer.style.top);
                var thisWidth = thisContainer.clientWidth;
                var thisHeight = thisContainer.clientHeight;
                var thisRight = thisX + thisWidth;
                var thisBottom = thisY + thisHeight;
                if (childX >= thisX && childX <= thisRight) { 
                    if ((thisY < childBottom && thisY >= childY) || (thisBottom <= childBottom && thisBottom > childY)) {
                        if (direction == "top") { // (if bass)
                            wrapper.style.top = thisBottom + "px";
                            wrapper.setAttribute("modified", true);
                            childY = parseInt(wrapper.style.top);
                            childBottom = childY + childHeight;
                        } else if (direction == "bottom") { // (if treble)
                            wrapper.style.top = (thisY - childHeight) + "px";
                            wrapper.setAttribute("modified", true);
                            childY = parseInt(wrapper.style.top);
                            childBottom = childY + childHeight;
                        }
                        self.adjustAnnotationHeight(wrapper, direction);
                    }
                } else if (thisX >= childX && thisX <= childRight) {
                    if ((childY < thisBottom && childY >= thisY) || (childBottom > thisY && childBottom <= thisBottom)) {
                        self.adjustAnnotationHeight(thisContainer, direction);
                    };
                } else {
                    wrapper.removeAttribute("modified");
                }
            }
        }
    }

    // pushes annotation wrappers towards either the top or the bottom by a set amount
    this.tightWrapAnnotations = function(container) {
        var children = container.children;
        var minHeight = 10000;
        var maxHeight = 0;
        for (var i = 0; i < children.length; i++) {
            var top = parseInt(children[i].style.top);
            var bottom = top + $(children[i]).height();
            if (bottom > maxHeight) {
                maxHeight = bottom;
            } if (top < minHeight) {
                minHeight = top;
            }
        }
        //if (minHeight == 10000) minHeight = 0;
        var annotationContainerSize = maxHeight - minHeight;
        $(container).css("height", annotationContainerSize);
        var topOffset = minHeight - container.offsetTop;
        for (var i = 0; i < children.length; i++) {
            children[i].style.top = (parseInt(children[i].style.top) - topOffset) + "px";
        }
    }

    // get the users attention by jiggling this item
    this.jiggle = function(item, count) {
        $(item)
            .animate({top: '+=2', left: '+=2'}, 25)
            .animate({top: '-=4', left: '-=4'}, 50)
            .animate({top: '+=2', left: '+=2'}, 25, function(){
                if (count > 0) {
                    self.jiggle(item, count - 1);
                }
            });
    }

    // find a set of svgs within a range of values
    this.findSVGRange = function(downX, downY, upX, upY) {
        var paths = $("path");
        var targets = [];
        paths.each(function() {
            var bb = this.getBoundingClientRect();
            var top = bb.top + window.scrollY;
            var left = bb.left + window.scrollX;
            var bottom = bb.bottom + window.scrollY;
            var right = bb.right + window.scrollX;
            if ((downX < left && upX > right && downY < top && upY > bottom) // top-left to bottom-right
                || (downX > right && upX < left && downY > bottom && upY < top) // bottom-right to top-left
                || (downX < left && upX > right && downY > top && upY < bottom) // bottom-left to top-right
                || (downX > right && upX < left && downY < bottom && upY > top) /* top-right to bottom-left */) {
                    targets.push(this);
                }
        });
        return targets;
    }

    // find an individual svg at the coordinate (x,y) to use as reference when finding other svgs in the chord
    this.findSVG = function(x, y) {
        var paths = $("path");
        for (var i = 0; i < paths.length; i++) {
            var bb = paths[i].getBoundingClientRect();
            if (bb.width > 7 && bb.height > 7 && bb.width * 3 > bb.height) {
                var top = Math.ceil(bb.top + window.scrollY);
                var left = Math.ceil(bb.left + window.scrollX);
                var bottom = Math.floor(bb.bottom + window.scrollY);
                var right = Math.floor(bb.right + window.scrollX);
                if (x <= right && x >= left && y >= top && y <= bottom && right - left < 15 && right - left > 8) {
                    var selectData = $(paths[i]).data();
                    var neighbors = [paths[i]];
                    // TODO: make one click chord selection a thing
                    paths.each(function() {
                        var d = $(this).data();
                        if (d.clef == selectData.clef && d.measure == selectData.measure
                            && d.voice == selectData.voice && d.index == selectData.index) {
                                neighbors.push(this);
                            }
                    });
                    return neighbors;
                }
            }
        }
    } 
}
