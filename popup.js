//console.log('Popup hello');

var g_page_source = '';
var g_regex = '';

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	console.log('Data Recieved: ');
	g_page_source = request.data;

	//var results = g_page_source.match(g_regex);

	//console.log('POST RESULTS ' + results);

});



document.addEventListener('DOMContentLoaded', function() {

	regex_tb = document.getElementById('regextb');
	regex_tb.onkeyup = function () {
		console.log('Typing ... ' + this.value);

		var regex_str = this.value		
		console.log('MADE REGEX');

		chrome.tabs.executeScript({
			code: 'document.body.style.backgroundColor="red"'
		});
		console.log('Sending message');
		//chrome.extension.sendMessage({action:'sendRegex', data:regex_str});
		//chrome.extension.sendMessage({'regex':regex_str});

		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  			chrome.tabs.sendMessage(tabs[0].id, {regex: regex_str}, function(response) {
    				console.log('RESPONSE');
  			});
		});	

		console.log('FINSIHED');
	};
	/*chrome.tabs.executeScript(null, {
			file: "getPageSource.js"
		}, function() {
		if (chrome.extension.lastError) {
			console.log('There was an error injecting script : \n' + chrome.extension.lastError.message);
		}
	});*/
});

