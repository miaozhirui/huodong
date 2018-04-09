window.onload = function () {
	var url = window.location.search;
	window.parent.postMessage(url,'*');
}