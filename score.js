"use strict";

(function() {
	var annotations = [];
	var mouseDrag = false;
	var isSVGloaded = window.setInterval(function() {	
		if (SVGloaded) {
			$("#score svg").mousedown(scoreDrag);
			$("#score svg").click(scoreSelect);
			window.clearInterval(isSVGloaded);
		}
	}, 100);


	// TODO?: code breaks unless these are module-globals
	var downX;
	var downY;

	// handles the drag select behavior for the score
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

	// what to do when note(s) on the score are selected
	function scoreSelect(e) {
		var x = e.pageX;
		var y = e.pageY;
		$(window).unbind("mousemove");
		// find corresponding SVG (calls findCoord)
		var coord = findSVG(x, y);
		if (coord) createAnnotation(coord);
		$("#selectBox").remove();
	}

	// creates an annotation editor box and handles annotation submition + placement
	function createAnnotation(coord) {
		// init stuff
		var containingDiv = "#" + coord.staveNote.location.clef + "_" + coord.staveNote.location.lineNum;
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
				// $(previousACreatorContainer).css("height", findContainerHeight(previousACreatorContainer));
				tightWrapAnnotations(previousACreatorContainer, "bottom");
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
			if (containingElement.offsetTop < coord.y) {
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
			if (coord.x + parseInt($(annotation).css("width")) > $(window).width()) {
				annotation.style.left = $(window).width() - parseInt($(annotation).css("width")) - 20 + "px";
			} else {
				annotation.style.left = coord.x + "px";
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
					jiggle(textarea, 3);
					textarea.focus();
					return false;
				} else if (!thisCategory) {
					jiggle(categories, 3);
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
						if (coord.staveNote.location.measure == annotations[i].measure
							&& coord.staveNote.location.clef == annotations[i].clef
							&& coord.staveNote.location.voice == annotations[i].voice
							&& coord.staveNote.location.index == annotations[i].index) {
							return annotations[i].list;
						}
					}
					return null;
				}

				// ^if not we better build a wrapper for the new annotation
				var buildList = function() {
					listcontainer = document.createElement("div");
					listcontainer.classList.add("listannotation");
					listcontainer.style.left = coord.x + "px";
					listcontainer.style.top = containingElement.offsetTop + "px";
					// sort
					var children = containingElement.children;
					if (children.length) {
						var inserted = false;
						for (var i = children.length - 1; i >= 0; i--) {
							if (parseInt(children[i].style.left) < coord.x) {
								containingElement.insertBefore(listcontainer, children[i].nextSibling);
								inserted = true;
								break;
							}
						}
						if (!inserted) {
							containingElement.insertBefore(listcontainer, containingElement.firstChild);
						}
					} else {
						containingElement.appendChild(listcontainer);
					}
					// $(listcontainer).appendTo(containingDiv);
					list = document.createElement("ol");
					listcontainer.appendChild(list);
					var annotationLocation = coord.staveNote.location;
					annotationLocation.list = list;
					annotations.push(annotationLocation);
				}

				var listcontainer;
				var list = existingList();
				var note = document.createElement("li");
				note.innerHTML = textarea.value;

				if (!list) buildList();

				list.appendChild(note);
				note.classList.add(thisCategory);
				if (thisCategory == "melody" ||  thisCategory == "rhythm") {
					note.classList.add("categoryhighlight");
				}
				var theseChildren = containingElement.children;
				// TODO: Make top/bottom diffentiation more versatile (generalizable across many types of clefs)
				for (var i = 0; i < theseChildren.length; i++) {
					if (coord.staveNote.clef == undefined) { // treble
						adjustAnnotationHeight(theseChildren[i], "bottom");
					} else if (coord.staveNote.clef == "bass") {
						adjustAnnotationHeight(theseChildren[i], "top");
					}
				}
				var allContainers = document.getElementsByClassName("annotationcontainer");
				// TODO: figure out what's going on here
				for (var j = 0; j < allContainers.length; j++) {
					tightWrapAnnotations(allContainers[j]);
				}
			}
		});
	}

	// "wraps" annotation wrappers around each other so they don't lie on top of each other
	function adjustAnnotationHeight(wrapper, direction) {
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
						adjustAnnotationHeight(wrapper, direction);
					}
				} else if (thisX >= childX && thisX <= childRight) {
					if ((childY < thisBottom && childY >= thisY) || (childBottom > thisY && childBottom <= thisBottom)) {
						adjustAnnotationHeight(thisContainer, direction);
					};
				} else {
					wrapper.removeAttribute("modified");
				}
			}
		}
	}

	// pushes annotation wrappers towards either the top or the bottom by a set amount
	function tightWrapAnnotations(container) {
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

	// returns 
	function findContainerHeight(thisContainer) {
		var children = thisContainer.children;
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
		return maxHeight - minHeight;
	} 

	// get the users attention by jiggling this item
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

	// find a set of svgs to highlight based on the mouse drag
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

	// finds the coordinate coorresponding to a click at (x,y)
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

	// highlights the svg note coorresponding to the passed coordinate
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

	// find an individual svg to highlight which coorresponds to the coordinate at (x,y)
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
