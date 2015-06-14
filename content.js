console.log('Content hello');


// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = DOMtoString(document);

chrome.runtime.onMessage.addListener(function(request,sender,response){
	console.log('CONTENT.JS received message ' + request.regex);
});


