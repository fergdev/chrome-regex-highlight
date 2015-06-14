console.log('Popup hello');


document.addEventListener('DOMContentLoaded', function() {

	regex_tb = document.getElementById('regextb');
	regex_tb.onkeyup = function (e) {
		console.log('Typing ... ' + this.value);

		var regex_str = this.value		
		if (e.which == 13 || event.keyCode == 13){
			console.log('Sending message');

			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  				chrome.tabs.sendMessage(tabs[0].id, {regex: regex_str}, function(response) {
    					console.log('RESPONSE');
  				});
			});	
		}
		console.log('FINSIHED');
	};
});

