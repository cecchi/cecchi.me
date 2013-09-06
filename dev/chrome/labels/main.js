console.log("Main.js loaded");

chrome.extension.sendMessage({ 
  'method' : 'updateIcon'
}, function(response) {});