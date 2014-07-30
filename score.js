(function() {
	var mouseDrag = false;

	$(document).ready(function() {
		$("#score").mousedown(event.data, scoreDrag);
		$("#score").click(event.data, scoreSelect);
	});

	// TODO?: code breaks unless these are module-globals
	var downX;
	var downY;

	function scoreDrag(e) {
		if (!e.metaKey) {
			$("path").attr("fill", "black");
		};
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
				};
			};
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
		// find corresponding SVG
		findSVG(x, y);
		var coord = findCoord(x, y);
		$("#selectBox").remove();
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
			};
		});
	}

	function findCoord(x, y) {
		for (var i = 0; i < coords.length; i++) {
			var marker = document.createElement("div");
			marker.style.border = "1px solid pink";
			marker.style.position = "absolute";
			marker.style.left = coords[i].x + "px";
			marker.style.top = coords[i].y + "px";
			marker.style.height = (coords[i].h) + "px";
			marker.style.width = (coords[i].w) + "px"
			//$(marker).appendTo("#score");
			if (x >= coords[i].x && x <= coords[i].x + coords[i].w
				&& y >= coords[i].y && y <= coords[i].y + coords[i].h) {
				// console.log(coords[i]);
				return coords[i];
			};
		}; 
	}

	$(document).hover(function(e) {

	}, function() {

	});

	function findSVG(x, y) {
		var paths = $("path");
		var coordinate;
		var extraCushion = 1;
		for (var i = 0; i < paths.length; i++) {
			var bb = paths[i].getBoundingClientRect();
			var top = Math.ceil(bb.top + window.scrollY);
			var left = Math.ceil(bb.left + window.scrollX);
			var bottom = Math.floor(bb.bottom + window.scrollY);
			var right = Math.floor(bb.right + window.scrollX);
			var marker = document.createElement("div");
			marker.style.border = "1px solid blue";
			marker.style.position = "absolute";
			marker.style.left = left + "px";
			marker.style.top = top + "px";
			marker.style.height = (bottom - top) + "px";
			marker.style.width = (right - left) + "px"
			//$(marker).appendTo("#score");
			if (x <= right && x >= left && y >= top && y <= bottom && right - left > 9) {
				$(paths[i]).attr("fill", "blue");
				coordinate = findCoord(x,y);
				var startChordNote = i - 5 < 0 ? 0 : i - 5;
				for (var j = startChordNote; j < startChordNote + 10; j++) {
					var bb2 = paths[j].getBoundingClientRect();
					var top2 = Math.ceil(bb2.top + window.scrollY);
					var left2 = Math.ceil(bb2.left + window.scrollX);
					var bottom2 = Math.floor(bb2.bottom + window.scrollY);
					var right2 = Math.floor(bb2.right + window.scrollX);
					var thisCoord = findCoord((left + right)/2, (top + bottom)/2);
					// right - left requirements hack to select only notes
					if (left2 + extraCushion >= coordinate.x && right2 <= coordinate.x + coordinate.w + extraCushion
						&& top2 + extraCushion >= coordinate.y && bottom2 <= coordinate.y + coordinate.h + extraCushion
						&& thisCoord.staveNote.location.voice == coordinate.staveNote.location.voice
						&& thisCoord.staveNote.location.index == coordinate.staveNote.location.index) { 
						$(paths[j]).attr("fill", "blue");
					}
				};
				// console.log(coordinate);
				// console.log("left: " + Math.ceil(left));
				// console.log("right " + Math.floor(right));
				// console.log("top: " + Math.ceil(top));
				// console.log("bottom " + Math.floor(bottom));
			};
		};
	}
}());
