console.log("Loaded tab.js");

/* API for interacting with the page action */
var Api = (function() {
  var Api = {};

  console.log('Api initialized');

  Api.request = function(target, method, args, callback) {
    chrome.extension.sendMessage({
      'target'   : target,
      'method'   : method,
      'args'     : args
    }, callback);
  }

  return Api;
})();

Api.request('background', 'Icon.show', {}, function() {});