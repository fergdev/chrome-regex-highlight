console.log('GETPAGESOURCE hello');
/*
chrome.extension.onMessage.addListener(function(request, sender){
	console.log('GETPAGE SOURCE MESSAGE ' + request.data);
	
});
*/

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log('GOT runtime message');
	}
);

