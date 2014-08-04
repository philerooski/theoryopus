"use strict";

(function() {
	var mouseDrag = false;
	var isSVGloaded = window.setInterval(function() {	
		if (SVGloaded) {
			$("#score svg").mousedown(scoreDrag);
			$("#score svg").click(scoreSelect);
			window.clearInterval(isSVGloaded);
		}
	}, 1000);


	// TODO?: code breaks unless these are module-globals
	var downX;
	var downY;

	function scoreDrag(e) {
		if (!e.metaKey) {
			$("path").attr("fill", "black");
		}
		downX = e.pageX;
		downY = e.pageY;
		var selectBox = document.createElement("div");
		selectBox.style.position = "absolute";
		selectBox.setAttribute("id", "selectBox");
		selectBox.style.top = downY + "px";
		selectBox.style.left = downX + "px";
		selectBox.style.backgroundColor = "rgba(184, 181, 255, 0.2)";
		$(selectBox).appendTo("#score");
		$(window).mousemove(function(event) {
			mouseDrag = true;
			var width = (event.pageX - downX);
			var height = (event.pageY - downY);
			if (width >= 0 && height >= 0) {
				$("selectBox").css("left", downX + "px");
				$("selectBox").css("top", downY + "px");
				$("#selectBox").css("width", width + "px");
				$("#selectBox").css("height", height + "px");
			} else {
				var left = downX + width;
				var top = downY + height;
				if (width < 0 && height < 0) {
					$("#selectBox").css("left", left + "px");
					$("#selectBox").css("width", (downX - left) + "px");
					$("#selectBox").css("top", top + "px");
					$("#selectBox").css("height", (downY - top) + "px");
				} else if (width < 0) {
					$("#selectBox").css("left", left + "px");
					$("#selectBox").css("width", (downX - left) + "px");
					$("#selectBox").css("height", height + "px");
				} else if (height < 0) {
					$("#selectBox").css("top", top + "px");
					$("#selectBox").css("height", (downY - top) + "px");
					$("#selectBox").css("width", width + "px");
				}
			}
		});
		$(window).mouseup(function(e) {
			if (mouseDrag) {
				var upX = e.pageX;
				var upY = e.pageY;
				findSVGRange(downX, downY, upX, upY);
				mouseDrag = false;
				$(window).unbind("mousemove");
				$("#selectBox").remove();
			}
			e.stopPropagation();
		});
	}

	function scoreSelect(e) {
		var x = e.pageX;
		var y = e.pageY;
		$(window).unbind("mousemove");
		// find corresponding SVG (calls findCoord)
		var coord = findSVG(x, y);
		if (coord) createAnnotation(coord);
		$("#selectBox").remove();
	}

	function createAnnotation(coord) {
		// init stuff
		var previousACreatorContainer = $(".annotationcreator").parent();
		$(".annotationcreator").remove();
		$(previousACreatorContainer).css("height", findChildrenHeight(previousACreatorContainer));
		var annotation = document.createElement("div");
		annotation.classList.add("annotationcreator");
		var textarea = document.createElement("textarea");
		$(textarea).keyup(function() {
			if (textarea.value.length) {
				$(submit).css("backgroundColor", "");
				submit.classList.add("annotationsubmitvalid");
			} else {
				$(submit).css("backgroundColor", falseColorize(submit));
				submit.classList.remove("annotationsubmitvalid");
			}
		});
		annotation.appendChild(textarea);
		var categories = document.createElement("div");
		categories.classList.add("categories");
		annotation.appendChild(categories);
		var submit = document.createElement("div");
		submit.classList.add("annotationsubmit");
		submit.innerHTML = "Submit";
		annotation.appendChild(submit);
		// categories
		var melody = document.createElement("div");
		var harmony = document.createElement("div");
		var rhythm = document.createElement("div");
		var form = document.createElement("div");
		var none = document.createElement("div");
		var catArray = ["melody", "harmony", "rhythm", "form", "none"];
		var catVarArray = [melody, harmony, rhythm, form, none];
		for (var i = 0; i < catVarArray.length; i++) {
			catVarArray[i].innerHTML = catArray[i].charAt(0).toUpperCase() + catArray[i].slice(1);
			catVarArray[i].classList.add(catArray[i]);
			catVarArray[i].classList.add("category");
			$(catVarArray[i]).click(function(e) {
				var doubleCat = false;
				if (!e.metaKey) {
					doubleCat = true;
				}
				for (var j = 0; j < catArray.length; j++) {
					submit.classList.remove(catArray[j]);
					catVarArray[j].classList.remove("categoryhighlight");
				}
				this.classList.add("categoryhighlight");
				$(submit).css("backgroundColor", ""); // inherits styling from stylesheet instead
				submit.classList.add(this.innerHTML.charAt(0).toLowerCase() + this.innerHTML.slice(1));
				if (!textarea.value.length) {
					$(submit).css("backgroundColor", falseColorize(submit));
				}
				textarea.focus();
			});
			categories.appendChild(catVarArray[i]);
		}
		// annotation editor behavior
		var containingDiv = "#" + coord.staveNote.location.clef + "_" + coord.staveNote.location.lineNum;
		$(annotation).appendTo(containingDiv);
		textarea.focus();
		if (coord.x + parseInt($(annotation).css("width")) > $(window).width()) {
			annotation.style.left = $(window).width() - parseInt($(annotation).css("width")) - 20 + "px";
		} else {
			annotation.style.left = coord.x + "px";
		}
		$(containingDiv).css("height", findChildrenHeight(containingDiv));
		$(annotation).hover(function() {
			annotation.style.opacity = 1;
		});
		$(".annotationcontainer").click(function() {
			$(annotation).animate({opacity: "0.25"}, 250);
		}).children().click(function() {
			return false;
		});
		$(submit).click(function() {
			var validCategory;
			$(catArray).each(function() {
				if (submit.classList.contains(this)) {
					validCategory = true;
				}
			});
			if (!textarea.value.length) {
				jiggle(textarea, 3);
				textarea.focus();
			} else if (!validCategory) {
				jiggle(categories, 3);
			} else {
				$(annotation).remove();
				var note = document.createElement("div");
				note.innerHTML = textarea.value;
				note.classList.add("annotation");
				for (var i = catArray.length - 1; i >= 0; i--) {
					if (submit.classList.contains(catArray[i])) {
						note.classList.add(catArray[i]);
						if (catArray[i] == "melody" ||  catArray[i] == "rhythm") {
							note.classList.add("categoryhighlight");
						}
					}
				}
				note.style.left = coord.x + "px";
				$(note).appendTo(containingDiv);
				$(containingDiv).css("height", findChildrenHeight(containingDiv));
			}
		}); 
	}

	function falseColorize(element) {
		var fullColor = $(element).css("backgroundColor");
		var falseColor = "rgba" + fullColor.slice(3, fullColor.length - 1) + ", 0.5)";
		return falseColor;
	}

	function findChildrenHeight(thisContainer) {
		var children = $(thisContainer).children();
		var maxHeight = 0;
		children.each(function() {
			var height = parseInt($(this).css("height")) + parseInt($(this).css("padding-top")) + parseInt($(this).css("padding-bottom")) 
			+ parseInt($(this).css("border-top")) + parseInt($(this).css("border-bottom")); + parseInt($(this).css("margin-top")) 
			+ parseInt($(this).css("margin-bottom"));
			if (height > maxHeight) {
				maxHeight = height;
			}
		});
		return maxHeight;
	} 

	function jiggle(item, count) {
		$(item)
	    .animate({top: '+=2', left: '+=2'}, 25)
	    .animate({top: '-=4', left: '-=4'}, 50)
	    .animate({top: '+=2', left: '+=2'}, 25, function(){
	        if (count > 0) {
	            jiggle(item, count-1);
	        }
	    });
	}

	function findSVGRange(downX, downY, upX, upY) {
		var paths = $("path");
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
				$(this).attr("fill", "blue");
			}
		});
	}

	function findCoord(x, y) {
		for (var i = 0; i < coords.length; i++) {
			for (var j = 0; j < coords[i].staveNote.note_heads.length; j++) {
				// note_head coordinates not accurate?!?!?!
				var left = coords[i].staveNote.note_heads[j].x + coords[i].staveNote.context.paper.canvas.offsetLeft - 2;
				if (coords[i].staveNote.note_heads[j].displaced) left += 10;
				var right = left + coords[i].staveNote.note_heads[j].width + 4;
				var top = coords[i].staveNote.note_heads[j].y + coords[i].staveNote.context.paper.canvas.offsetTop - 7;
				var bottom = top + 12;
				if (left < x && right > x && top < y && bottom > y) {
					console.log(coords[i]);
					return coords[i];
				}
			}
		} 
	}

	function noteMatch(pathIndex, coord) {
		var neighborHeads = coord.staveNote.note_heads;
		var paths = $("path");
		var lastIndex = -1;
		var numAccidentals = 0;
		for (var n = 0; n < neighborHeads.length; n++) {
			var left = neighborHeads[n].x + coord.staveNote.context.paper.canvas.offsetLeft - 2;
			if (neighborHeads[n].displaced) left += 10;
			var right = left + neighborHeads[n].width + 4;
			var top = neighborHeads[n].y + coord.staveNote.context.paper.canvas.offsetTop - 7;
			var bottom = top + 12;
			var verticalCenter = (top + bottom) / 2;
			var horizontalCenter = (left + right) / 2;
			if (coord.staveNote.keyProps[n].accidental && coord.staveNote.keyProps[n].accidental.length) numAccidentals++;
			var closest = 20;
			var closestPath;
			pathIndex = (pathIndex < 10) ? 10 : pathIndex;
			pathIndex = (pathIndex + 10 >= paths.length) ? (paths.length - 11) : pathIndex;
			for (var i = pathIndex - 10; i < pathIndex + 10; i++) {
				var bb = paths[i].getBoundingClientRect();
				var pathTop = parseInt(bb.top + window.scrollY);
				var pathLeft = parseInt(bb.left + window.scrollX);
				var pathBottom = parseInt(bb.bottom + window.scrollY);
				var pathRight = parseInt(bb.right + window.scrollX);
				if (pathRight - pathLeft > 8 && pathRight - pathLeft < 15) {
					var horizontalPathCenter = (pathLeft + pathRight) / 2;
					var verticalPathCenter = (pathTop + pathBottom) / 2;
					var thisDistance = Math.abs(verticalCenter - verticalPathCenter) + Math.abs(horizontalCenter - horizontalPathCenter);
					if (thisDistance < closest && $(paths[i]).attr("fill") != "blue") { 
						closestPath = i;
						closest = thisDistance; 
					}
				}
			}
			$(paths[closestPath]).attr("fill", "blue");
			if (closestPath > lastIndex) lastIndex = closestPath;
		}
		for (var j = 0; j < numAccidentals; j++) {
			$(paths[lastIndex + j + 1]).attr("fill", "blue");
		}
	}

	function findSVG(x, y) {
		var paths = $("path");
		var coordinate;
		for (var i = 0; i < paths.length; i++) {
			var bb = paths[i].getBoundingClientRect();
			var top = Math.ceil(bb.top + window.scrollY);
			var left = Math.ceil(bb.left + window.scrollX);
			var bottom = Math.floor(bb.bottom + window.scrollY);
			var right = Math.floor(bb.right + window.scrollX);
			if (x <= right && x >= left && y >= top && y <= bottom && right - left < 15 && right - left > 8) {
				coordinate = findCoord(x,y);
				noteMatch(i, coordinate);
				return coordinate;
			}
		}
	}
}());
