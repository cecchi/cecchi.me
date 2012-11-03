Dashboard.ViewFinder = (function(Rickshaw, window) {
  ViewFinder = {
    'selected' : [],
    'dragging' : false,
    'domain'   : Dashboard.Graph.chart.dataDomain()
  };

  // (Re)draw the view finder with optional configuration changes
  ViewFinder.draw = function(config) {
    ViewFinder.domain = Dashboard.Graph.chart.dataDomain();

    ViewFinder.chart.configure(Rickshaw.extend({
      series : Dashboard.Data.raw
    }, config));

    ViewFinder.chart.renderer.unstack = !Dashboard.Controls.stacked;

    ViewFinder.chart.render();
  }

  // Keep the main graph and view finder in sync
  Dashboard.Graph.chart.onUpdate(ViewFinder.draw);

  // Draw the initial view finder
  ViewFinder.init = function() {
    // Hacky cloning implementation, Rickshaw.Graph is mutated heavily during construction
    ViewFinder.chart = new Rickshaw.Graph({
      element  : Dashboard.Elements.viewFinderChart,
      width    : Dashboard.Graph.chart.width,
      min      : Dashboard.Graph.chart.min,
      padding  : Dashboard.Graph.chart.renderer.padding,
      stroke   : Dashboard.Graph.chart.renderer.stroke,
      series   : Dashboard.Data.raw,
      renderer : 'area',
      height   : 70,
    });

    ViewFinder.chart.renderer.unstack = !Dashboard.Controls.stacked;

    ViewFinder.chart.render();
  }

  ViewFinder.updateChart = function() {
    Dashboard.Graph.chart.window.xMin = Dashboard.Elements.viewFinderGrabLeft.getAttribute('data-timestamp');
    Dashboard.Graph.chart.window.xMax = Dashboard.Elements.viewFinderGrabRight.getAttribute('data-timestamp');
    Dashboard.Graph.chart.update();
  }

  // Borrowed from http://stackoverflow.com/q/442404/1366376
  ViewFinder.getOffset = function() {
    var _x = 0, 
        _y = 0,
        el = Dashboard.Elements.viewFinder; 
    while(el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      _x += el.offsetLeft - el.scrollLeft;
      _y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: _y, left: _x };
  }

  // Calculate the percentage dragged, the corresponding timestamp, and redraw the view finder range
  ViewFinder.drag = function(e) {
    if(ViewFinder.dragging) {
      var range     = ViewFinder.domain[1] - ViewFinder.domain[0],
          width     = Dashboard.Elements.viewFinder.clientWidth,
          offset    = ViewFinder.getOffset(),
          percent   = (e.pageX - offset.left) / width,
          timestamp = Math.round(ViewFinder.domain[0] + (range * percent)),
          left      = ViewFinder.dragging === Dashboard.Elements.viewFinderGrabLeft,
          other     = left ? Dashboard.Elements.viewFinderGrabRight : Dashboard.Elements.viewFinderGrabLeft,
          split     = timestamp - (left ? ViewFinder.domain[1] : ViewFinder.domain[0]);

      console.log(left, timestamp, ViewFinder.domain[1], split);
    
      if(left && split < 0 || !left && split > 0) {

        ViewFinder.dragging.parentNode.style.width = (left ? percent : (1 - percent)) * width + 'px';
        ViewFinder.dragging.setAttribute('data-timestamp', timestamp);

        ViewFinder.updateChart();
      }
    }
  }

  Dashboard.Elements.viewFinderGrabLeft.addEventListener('mousedown', function(e) {
    ViewFinder.dragging = Dashboard.Elements.viewFinderGrabLeft;
  });

  Dashboard.Elements.viewFinderGrabRight.addEventListener('mousedown', function(e) {
    ViewFinder.dragging = Dashboard.Elements.viewFinderGrabRight;
  });

  Dashboard.Elements.viewFinder.addEventListener('mousemove', ViewFinder.drag);

  window.addEventListener('mouseup', function(e) {
    ViewFinder.dragging = false;
  });

/*
  // Start dragging on mousedown
  Dashboard.Elements.viewFinder.addEventListener('mousedown', function(e) {
    ViewFinder.dragging = true;
    var offset = ViewFinder.getOffset();
    ViewFinder.selected = [(e.pageX - offset.left) / Dashboard.Elements.viewFinder.clientWidth];
  });

  // Update view finder and graph on drag
  Dashboard.Elements.viewFinder.addEventListener('mousemove', function(e) {
    if(ViewFinder.dragging) {
      var offset = ViewFinder.getOffset();
      ViewFinder.selected[1] = ((e.pageX - offset.left) / Dashboard.Elements.viewFinder.clientWidth);
      ViewFinder.updateChart();
    }
  });

  // Stop dragging on mouseup
  window.addEventListener('mouseup', function(e) {
    ViewFinder.dragging = false;
  });
*/

  ViewFinder.init();

  return ViewFinder;
})(Rickshaw, window);