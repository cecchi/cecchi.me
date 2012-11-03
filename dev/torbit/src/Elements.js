Dashboard.Elements = (function(document) {
  // Element bindings
  return {
    'chart'               : document.getElementById('chart'),
    'yAxis'               : document.getElementById('y-axis'),
    'legend'              : document.getElementById('legend'),
    'viewMode'            : document.getElementById('view-mode-select'),
    'viewFinder'          : document.getElementById('view-finder'),
    'viewFinderChart'     : document.getElementById('view-finder-chart'),
    'viewFinderBlurLeft'  : document.getElementById('blur-left'),
    'viewFinderBlurRight' : document.getElementById('blur-right'),
    'viewFinderGrabLeft'  : document.querySelector('#blur-left .handle'),
    'viewFinderGrabRight' : document.querySelector('#blur-right .handle')
  }
})(document);