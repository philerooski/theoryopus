(function() {
	var mouseDrag = false;

	$(document).ready(function() {
		$("#score").mousedown(event.data, scoreDrag);
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

	$(window).click(function(e) {
		var x = e.pageX;
		var y = e.pageY;
		$(window).unbind("mousemove");
		// find corresponding SVG
		findSVG(x, y);
		// find corresponding coord
		var closest = 100;
		var closestNote;
		findCoord(x, y);
		coords.forEach(function(coordinate) {
			var ydist = Math.abs(coordinate.y - y);
			var xdist = Math.abs(coordinate.x - x);
			var marker = document.createElement("div");
			marker.style.border = "2px solid pink";
			marker.style.position = "absolute";
			marker.style.left = coordinate.x + "px";
			marker.style.top = coordinate.y + "px";
			marker.style.height = coordinate.h + "px";
			marker.style.width = coordinate.w + "px"
			$(marker).appendTo("#score");
			// TODO: implement accurate coord locating from click by examining staveNote.note_heads[i].y/x
			if (ydist + xdist < closest) {
				closest = xdist + ydist;
				closestNote = coordinate;
			};
		});
		$("#selectBox").remove();
		//console.log(closestNote);
	});

	function findCoord(x, y) {
		coords.forEach(function(coordinate) {
			if (x > coordinate.x && x < coordinate.x + coordinate.w
				&& coordinate.y < y && coordinate.y + coordinate.h > y) {
				console.log(coordinate);
				var paths = $("paths");
				paths.each(function() {
					var bb = this.getBoundingClientRect();
					var top = Math.ceil(bb.top + window.scrollY);
					var left = Math.ceil(bb.left + window.scrollX);
					var bottom = Math.floor(bb.bottom + window.scrollY);
					var right = Math.floor(bb.right + window.scrollX);
					// right - left requirements hack to select only notes
					if (left >= coordinate.x && right <= (coordinate.x + coordinate.w)
					&& top >= coordinate.y && bottom <= (coordinate.y + coordinate.h)) {
						$(this).attr("fill", "blue");
					};
				});
			};
		}); 
	}

	$(document).hover(function(e) {

	}, function() {

	});

	function findSVG(x, y) {
		var paths = $("path");
		paths.each(function() {
			var bb = this.getBoundingClientRect();
			var top = bb.top + window.scrollY;
			var left = bb.left + window.scrollX;
			var bottom = bb.bottom + window.scrollY;
			var right = bb.right + window.scrollX;
			var marker = document.createElement("div");
			marker.style.border = "1px solid blue";
			marker.style.position = "absolute";
			marker.style.left = left + "px";
			marker.style.top = top + "px";
			marker.style.height = (bottom - top) + "px";
			marker.style.width = (right - left) + "px"
			$(marker).appendTo("#score");
			// right - left requirements hack to select only notes
			if (x < right && x > left && y > top && y < bottom && (right - left < 15 && right - left > 10)) {
				$(this).attr("fill", "blue");
				console.log("left: " + left);
				console.log("right " + right);
				console.log("top: " + top);
				console.log("bottom " + bottom);
			};
		});
	}
}());
