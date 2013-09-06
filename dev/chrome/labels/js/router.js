/* Router */
Router = (function router() {
  var Router = {
    'sender'   : null,
    'receiver' : window.location.pathname.match(/\/([^\.\/]*)\.[A-Za-z]+/)[1]
  }

  console.log('Router Initialized');

  // Main routing listener
  chrome.extension.onMessage.addListener(function(request, sender, callback) {
    if(request.target = Router.receiver) {
      _.extend(Router, {
        method : request.method,
        args   : request.args,
        sender : sender
      });

      console.log(request.method + ' routed from "' + sender.tab.title + '" (id: ' + sender.tab.id + ') to "' + request.target + '"');

      var fn = Router.method.split('.').reduce(function(o, m) {
         return o[m];
      }, window);

      fn(Router.args, callback);
    };
  });

  return Router;
})();