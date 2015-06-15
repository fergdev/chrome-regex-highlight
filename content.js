var globalRegex;
var globalSkipTags = new RegExp("^(?:SCRIPT|FORM|INPUT|TEXTAREA|IFRAME|VIDEO|AUDIO|REGHI)$");
  
chrome.runtime.onMessage.addListener(function(request,sender,response){
	applyHighlight(request.regex);	
});

function applyHighlight(input){
	removeHighlight();	
	input = input.replace(/^[^\w]+|[^\w]+$/g, "").replace(/[^\w'\-]+/g, "|");
	var re = "(" + input + ")";
	globalRegex = new RegExp(re, "i");
	highlight(document.body);
}

/*
* Recursive highlight function
*/
function highlight(node){
	if(!node)
      		return;
	if(globalSkipTags.test(node.nodeName))
       		return;
	var i;
    	if(node.hasChildNodes()) {
      		for(i = 0; i < node.childNodes.length; i++) {
        		highlight(node.childNodes[i]);
      		}
	}
	if(node.nodeType === 3) { // NODE_TEXT
		var nv = node.nodeValue;
		if(nv != null){
			var regs = globalRegex.exec(nv);
			if(regs) {
          			var match = document.createElement('reghi');
          			match.appendChild(document.createTextNode(regs[0]));
          			match.className = "reghi";
          			match.style.backgroundColor = '#52FFD8';
				match.style.fontStyle = "inherit";
          			match.style.color = "#000";

          			var after = node.splitText(regs.index);
          			after.nodeValue = after.nodeValue.substring(regs[0].length);
          			node.parentNode.insertBefore(match, after);
			}
		}
	}
}

// remove highlighting
function removeHighlight(){
    var arr, i;
    do {
      arr = document.querySelectorAll('reghi');
      i = 0;
      while (i < arr.length && (el = arr[i])) {
       var parentNode = el.parentNode;
        if (!parentNode) {
          i++;      
         continue;
        }
       parentNode.replaceChild(el.firstChild, el);
       parentNode.normalize();
      }
    } while (arr.length > 0);
  };



