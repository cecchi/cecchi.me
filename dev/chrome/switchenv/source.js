/**
 * Chrome Extension for Environment Switching
 * (c) 2011, Cecchi MacNaughton
 * License: http://www.opensource.org/licenses/mit-license.php
 *
 * Comments: The actual extension consistes of many files, for convenience I have 
 *           combined them into one for viewing the source. jQuery is also loaded 
 *           locally. All the files are packaged into a .crx for installation.
 **/


/****************************************
 * File: manifest.json 
 * This defines the structure and metadata for the extension.
 **/
{
  "name"              : "SwitchEnv",
  "version"           : "1.1",
  "description"     : "Displays an icon to allow switching between local and production environments",
  "icons"            : {
    "16"  : "images/remote.png",
    "48"  : "images/48x48.png",
    "128"  : "images/128x128.png"
  },
  "background_page" : "background.html",
  "page_action"      : {
    "default_icon"  : "images/remote.png",
    "default_title"  : ""
  },
  "content_scripts" : [
    {
      "matches" : [
        "http://*/*"
      ],
      "js" : [
        "jquery.js",
        "contentscript.js"
      ],
      "run_at" : "document_end",
      "all_frames" : false
    }
  ],
  "permissions"      : [
    "tabs"
  ],
  "update_url": "http://www.cecchi.me/dev/chrome/switchenv/updates.xml"
}


/****************************************
 * File: map.json 
 * This defines how to map the local sites to production sites, and vice versa.
 **/
{
  "cecchi.dev"        : "cecchi.me",
  "debug.finale.dev"  : "debug.finale.fm",
  "finale.dev"        : "finale.fm",
  "bscript.dev"       : "bscript.com",
  "adirondack.dev"    : "adirondackcamp.com"
}


/****************************************
 * File: contentscript.json 
 * This loads map.json and operates as JavaScript on the active tab. The
 * requests communicate with background.html, a long-lived controller script.
 **/
var map = {}
$.getJSON('http://cecchi.dev/dev/chrome/switchenv/map.json', function(data) {
  map = data;
});
console.log(map);

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
        url = l.protocol+"//"+l.hostname.replace(remote, local).replace(/www./, '')+l.pathname;
      }
    });
  }
  if(url) {
    // Change the URL
    location.href = url;
    chrome.extension.sendRequest({target : 'popup'});
  }
});


/****************************************
 * File: background.html
 * This acts as a long-lived controlling script and controls interaction 
 * with the browser (icon)
 **/
 
<!DOCTYPE html>
<html>
  <head>
    <script type="text/javascript">
      /**
       * Listen for message from contentscript.js and show appropriate icon
       * Status = { -1 : local, 0 : neither, 1 : remote }
       **/
      var status = 0;
      function contains(object, needle) {
        for(value in object) {
          if(object[value] == needle.substr(object[value].length*-1)) {
            return true;
          }
        };
        return false;
      }
      chrome.extension.onRequest.addListener(function(data, sender, respond) {
        if(data.target != 'background') {
          return false;
        }
        status = (data.location.host.substr(-4) == '.dev' ? -1 : (contains(data.map, data.location.host) ? 1 : 0));
        chrome.pageAction.setTitle({
          tabId : sender.tab.id,
          title : (status == -1 ? 'In development environment' : 'In production environment')
        })
        chrome.pageAction.setIcon({
          tabId : sender.tab.id,
          path   : (status == -1 ? 'images/local.png' : 'images/remote.png')
        });
        if(status != 0) {
          chrome.pageAction.show(sender.tab.id);
        } else {
          chrome.pageAction.hide(sender.tab.id);
        }
        respond({});
      });
      
      /**
       * Toggle local/remote URL
       **/
      chrome.pageAction.onClicked.addListener(function(tab) {
        chrome.tabs.sendRequest(tab.id, {status : status}, function(response) {
          console.log(response);
        });
      });
    </script>
  </head>
</html>