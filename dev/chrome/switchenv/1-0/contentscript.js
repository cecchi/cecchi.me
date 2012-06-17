// Map local and remote locations
var map = {
	'cecchi.dev'				: 'cecchi.me',
	'debug.finale.dev'	: 'debug.finale.fm',
	'finale.dev'				: 'finale.fm',
	'bscript.dev'				: 'bscript.com',
	'adirondack.dev'		: 'adirondackcamp.com'
}

// Initialize contact, show the icon if local
chrome.extension.sendRequest({ location : location, map : map, target : 'background'}, function(response) {});

// Toggle between local and remote versions
chrome.extension.onRequest.addListener(function(data, sender, respond) {
	if(data.status == 0) {
		return false;
	}
	var l = window.location;
	var url = false;
	if(data.status == -1) {
		url = l.protocol+"//"+(map[l.hostname] == undefined ? l.hostname.replace('.dev', '.com') : map[l.hostname])+l.pathname;
	} else {
		$.each(map, function(local, remote) {
			if(remote == l.hostname.substr(remote.length*-1)) {
				console.log("Local: "+local);
				console.log("Remote: "+remote);
				console.log("Hostname: "+l.hostname);
				console.log("Replaced: "+l.hostname.replace(remote, local).replace(/www./, ''));
				url = l.protocol+"//"+l.hostname.replace(remote, local).replace(/www./, '')+l.pathname;
				console.log("URL: "+url);
			}
		});
	}
	if(url) {
		location.href = url;
		respond("Moved to: "+url);
		chrome.extension.sendRequest({target : 'popup'});
	} else {
		respond("No movement");
	}
});