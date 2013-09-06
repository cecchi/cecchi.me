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