/**
 * Chunked-Transfer Encoding with AJAX
 * (c) 2011, Cecchi MacNaughton
 * License: http://www.opensource.org/licenses/mit-license.php
 *
 * Comments: This function accepts three parameters. The first is the location of a script that
 *           will return chunked output. The second is the request type. The third is a callback
 *           with two parameters: the most recently returned chunk, and an array of all the chunks
 *           for convenience. Note that some browsers will ignore chunked-transfer encoded responses 
 *           until a minimum content length is reached. Sending and ignoring a long chunk of 
 *           gibberish is unfortunately the best method to ensure the first chunk is received.
 **/

function chunkedAjax(url, method, callback) {
	// Open the connection
	var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	xhr.open(method, url);
	// Listen for a state change
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 3) {
			var pos = 0;
			var len = xhr.responseText.length;
			var output = [];
			
			// Decode the response
			while((pos < len) && (hex = xhr.responseText.substr(pos, (nl = xhr.responseText.indexOf("\n", pos + 1)) - pos))) {
				pos = nl + 1;
				chunklen = parseInt(hex, 16);
				output.push(xhr.responseText.substr(pos, chunklen));
				pos = xhr.responseText.indexOf("\n", pos + chunklen) + 1;
			}
			
			callback(output[output.length-1], output);
		}
	}
	xhr.send();
	return xhr;
}

// This example uses jQuery for simplicity but the snippet itself is pure JS.
$(document).ready(function() {
	chunkedAjax('ajax/chunked-transfer.php', 'get', function(chunk, full) {
		console.log('Content returned');
		$('#chunked-transfer').append("<br />"+chunk);
	});
});