console.log('Popup hello');


document.addEventListener('DOMContentLoaded', function() {
	console.log('DOM LOADED');
	/*Inject highlight script*/
	chrome.tabs.executeScript(null, {file: "content.js"});
	console.log('EXECUTED content');
	/*Listen to changes in textbox*/
	$("#regextb").keyup(function (e) {
		console.log('Typing ... ' + this.value);

		var regex_str = this.value;
		
		if (regex_str == ''){
			$('#regexDisplay').text('Modified regex goes here ...');
		}else{
			var regexModified = regex_str.replace(/^[^\w]+|[^\w]+$/g, "").replace(/[^\w'\-]+/g, "|");
			regexModified = "(" + regexModified + ")";
			$('#regexDisplay').text(regexModified);

			if (e.which == 13 || event.keyCode == 13){
				console.log('Sending message');

				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  					chrome.tabs.sendMessage(tabs[0].id, {regex: regex_str}, function(response) {
    						console.log('RESPONSE');
  					});
				});	
			}
		}
		console.log('FINSIHED');
	});

	/*Setup hide/show for the cheat sheet.*/
	$('#showCheatDiv').click(function(){
		$('#cheatDiv').toggle();
	});
	$('#cheatDiv').hide();	
});





