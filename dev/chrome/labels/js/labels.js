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