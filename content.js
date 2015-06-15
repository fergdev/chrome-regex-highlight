console.log('Content hello');

var globalRegex;
var globalSkipTags = new RegExp("^(?:SCRIPT|FORM|INPUT|TEXTAREA|IFRAME|VIDEO|AUDIO|REGHI)$");
  
chrome.runtime.onMessage.addListener(function(request,sender,response){
	console.log('CONTENT.JS received message ' + request.regex);
	console.log('GOT REGEXP');
	applyHighlight(request.regex);	
});

function applyHighlight(input){
	removeHighlight();	
	input = input.replace(/^[^\w]+|[^\w]+$/g, "").replace(/[^\w'\-]+/g, "|");
	var re = "(" + input + ")";
	//if(!openLeft) re = "\\b" + re;
	//if(!openRight) re = re + "\\b";
	globalRegex = new RegExp(re, "i");

	highlight(document.body);
}


/*
* Recursive highlight function
*/
function highlight(node){

	//console.log('Highlight node ... ');
	if(!node)
      		return;
    	//console.log(node.nodeName);
	if(globalSkipTags.test(node.nodeName))
       		return;
	var i;
    	if(node.hasChildNodes()) {
      		for(i = 0; i < node.childNodes.length; i++) {
        		highlight(node.childNodes[i]);
      		}
    	
	}
	if(node.nodeType === 3) { // NODE_TEXT
		//console.log('Got text node');
		// Test if node value
		var nv = node.nodeValue;
		if(nv != null){
			//console.log('"'+nv+'"');
			var regs = globalRegex.exec(nv);
			//console.log(regs);
			if(regs) {
        			console.log('WE GOT A MATCH');
          			var match = document.createElement('reghi');
          			match.appendChild(document.createTextNode(regs[0]));
          			match.className = "reghi";
          			match.style.backgroundColor = '#52FFD8';//wordColor[regs[0].toLowerCase()];
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
        // store the reference to the parent of the hilite tag as that node itself, 
        // and all its links, is invalidated in the next .replaceChild() call:
        var parentNode = el.parentNode;
        if (!parentNode) {
          i++;      
          // this entry would otherwise crash in the code below; we can however improve 
          // on the total run-time costs by cutting back on the number of times we trigger
          // the outer loop (which serves as a recovery mechanism anyway) by continuing
          // with this querySelectorAll()'s results, but at it's higher indexes, which
          // are very probably still valid/okay. This saves a number of outer loops and 
          // thus a number of querySelectorAll calls.
          continue;
        }
        // Note that this stuff can crash (due to the parentNode being nuked) when multiple
        // snippets in the same text node sibling series are merged. That's what the
        // parentNode check is for. Ugly. Even while the .querySelectorAll() 'array' is updated
        // automatically, which would imply that this never occurs, yet: it does. :-(
        parentNode.replaceChild(el.firstChild, el);
        // and merge the text snippets back together again.
        parentNode.normalize();
      }
    } while (arr.length > 0);
  };



/*
function Hilitor(id, tag, options)
{
  var targetNode = document.getElementById(id) || document.body;
  var hiliteTag = tag || "EM";
  var skipTags = new RegExp("^(?:SCRIPT|FORM|INPUT|TEXTAREA|IFRAME|VIDEO|AUDIO)$");
  var colors = ["#ff6", "#a0ffff", "#9f9", "#f99", "#f6f"];
  var wordColor = [];
  var colorIdx = 0;
  var matchRegex = "";
  var openLeft = true;
  var openRight = true;
  options = options || {};
    this.setMatchType = function(type)
  {
    switch(type)
    {
    case "left":
      openLeft = false;
      openRight = true;
      break;
    case "right":
      openLeft = true;
      openRight = false;
      break;
    default:
    case "open":
      openLeft = openRight = true;
      break;
    case "complete":
      openLeft = openRight = false;
      break;
    }
  };

  this.setRegex = function (input)
  {
    input = input.replace(/^[^\w]+|[^\w]+$/g, "").replace(/[^\w'\-]+/g, "|");
    var re = "(" + input + ")";
    if(!openLeft) re = "\\b" + re;
    if(!openRight) re = re + "\\b";
    matchRegex = new RegExp(re, "i");
  };

  this.getRegex = function ()
  {
    var retval = matchRegex.toString();
    retval = retval.replace(/^\/(\\b)?|(\\b)?\/i$/g, "");
    retval = retval.replace(/\|/g, " ");
    return retval;
  };

  // recursively apply word highlighting
  this.hiliteWords = function (node)
  {
    var i;

    if(!node)
      return;
    if(!matchRegex)
      return;
    if(skipTags.test(node.nodeName))
       return;
    if(node.nodeName === hiliteTag && node.className === "hilitor")
      return;

    if(node.hasChildNodes()) {
      for(i = 0; i < node.childNodes.length; i++) {
        this.hiliteWords(node.childNodes[i]);
      }
    }
    if(node.nodeType === 3) { // NODE_TEXT
      if((nv = node.nodeValue) && (regs = matchRegex.exec(nv))) {
        if (false !== options.onDoOne.call(this, node)) {
          if(!wordColor[regs[0].toLowerCase()]) {
            wordColor[regs[0].toLowerCase()] = colors[colorIdx++ % colors.length];
          }

          var match = document.createElement(hiliteTag);
          match.appendChild(document.createTextNode(regs[0]));
          match.className = "hilitor";
          match.style.backgroundColor = wordColor[regs[0].toLowerCase()];
          match.style.fontStyle = "inherit";
          match.style.color = "#000";

          var after = node.splitText(regs.index);
          after.nodeValue = after.nodeValue.substring(regs[0].length);
          node.parentNode.insertBefore(match, after);
        }
      }
    }
  };

  // remove highlighting
  this.remove = function ()
  {
    var arr, i;
    do {
      arr = document.querySelectorAll(hiliteTag + ".hilitor");
      i = 0;
      while (i < arr.length && (el = arr[i])) {
        // store the reference to the parent of the hilite tag as that node itself, 
        // and all its links, is invalidated in the next .replaceChild() call:
        var parentNode = el.parentNode;
        if (!parentNode) {
          i++;      
          // this entry would otherwise crash in the code below; we can however improve 
          // on the total run-time costs by cutting back on the number of times we trigger
          // the outer loop (which serves as a recovery mechanism anyway) by continuing
          // with this querySelectorAll()'s results, but at it's higher indexes, which
          // are very probably still valid/okay. This saves a number of outer loops and 
          // thus a number of querySelectorAll calls.
          continue;
        }
        // Note that this stuff can crash (due to the parentNode being nuked) when multiple
        // snippets in the same text node sibling series are merged. That's what the
        // parentNode check is for. Ugly. Even while the .querySelectorAll() 'array' is updated
        // automatically, which would imply that this never occurs, yet: it does. :-(
        parentNode.replaceChild(el.firstChild, el);
        // and merge the text snippets back together again.
        parentNode.normalize();
      }
    } while (arr.length > 0);
  };

  // start highlighting at target node
  this.apply = function (input)
  {
    console.log('APPLY');
    // always remove all highlight markers which have been done previously
    this.remove();
    if(!input) {
      return false;
    }
    this.setRegex(input);
    var rv = options.onStart.call(this);
    if (rv === false) {
      return rv;
    }
    // ensure all text node series are merged, etc. so that we don't have to bother with fragmented texts in the search/scan.
    targetNode.normalize();
    this.hiliteWords(targetNode);
    return options.onFinish.call(this);
  };
}


  //return Hilitor;
}));

*/
