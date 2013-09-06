/* Router */
Router = (function router() {
  var Router = {
    'sender' : null
  }

  console.log('Router Initialized');

  // Main routing listener
  chrome.extension.onMessage.addListener(function(request, sender, callback) {
    if(request.target = 'background') {
      _.extend(Router, {
        method : request.method,
        args   : request.args,
        sender : sender
      });

      console.log('Message Received', Router);

      var fn = Router.method.split('.').reduce(function(o, m) {
         return o[m];
      }, window);

      fn(Router.args, callback);
    });

    return Router;
  }
})();

/* API */
Labels = (function api() {
  var Labels = {};

  Labels.updateIcon = function(args, callback) {

    console.log('API Call: Update Icon', args);

    chrome.pageAction.setIcon({
      tabId     : Router.sender.tab.id,
      imageData : Icon.getImageData()
    });

    chrome.pageAction.show(Router.sender.tab.id);

    console.log("Icon set for tab: ", Router.sender.tab.id, Icon.getImageData());
  }

  return Labels;
})();

/* Icon */
Icon = (function icon() {
  var Icon = {};

  var canvas  = document.getElementById('icon'),
      context = canvas.getContext('2d'),
      width   = canvas.width,
      height  = canvas.height;


  Icon.update = function(args, callback) {
    context.fillStyle = 'rgb(255,0,0)';
    context.fillRect(0, 0, width, height);

    chrome.pageAction.setIcon({
      tabId     : Router.sender.tab.id,
      imageData : Icon.getImageData()
    });
  }

  Icon.getImageData = function(args, callback) {
    return context.getImageData(0, 0, width, height);
  }

  Icon.show = function(args, callback) {
    console.log("Icon.show");
    Icon.update();
    chrome.pageAction.show(Router.sender.tab.id);
  }

  Icon.click = function(args, callback) {
    //chrome.pageAction.show(Router.sender.tab.id);
    //Popup.show();
    callback();
  }

  return Icon;
})();

/* Popup */
Popup = (function popup() {
  var Popup = {}

  return Popup;
})();