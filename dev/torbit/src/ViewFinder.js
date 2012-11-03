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
      series : Dashboard.Data.series.viewfinder
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
      series   : Dashboard.Data.series.viewfinder,
      renderer : 'area',
      height   : 70,
    });

    ViewFinder.chart.renderer.unstack = !Dashboard.Controls.stacked;

    ViewFinder.chart.render();
  }

  // Redraw the main graph after a view finder change
  ViewFinder.updateChart = function() {
    Dashboard.Graph.chart.window.xMin = Dashboard.Elements.viewFinderGrabLeft.getAttribute('data-timestamp');
    Dashboard.Graph.chart.window.xMax = Dashboard.Elements.viewFinderGrabRight.getAttribute('data-timestamp');
    Dashboard.Graph.chart.update();
  }

  // Borrowed from http://stackoverflow.com/q/442404/1366376
  ViewFinder.getOffset = function(el) {
    var _x = 0, 
        _y = 0,
        el = el || Dashboard.Elements.viewFinder; 
    while(el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      _x += el.offsetLeft - el.scrollLeft;
      _y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: _y, left: _x };
  }

  // Calculate a timestamp 
  ViewFinder.getTimestampFromOffset = function(x) {
      var range     = ViewFinder.domain[1] - ViewFinder.domain[0],
          width     = Dashboard.Elements.viewFinder.clientWidth,
          percent   = (x - ViewFinder.getOffset().left) / width;

      return Math.round(ViewFinder.domain[0] + (range * percent));
  }

  // Calculate the timestamp of a handle
  ViewFinder.getTimestamp = function(handle) {
      return ViewFinder.getTimestampFromOffset(ViewFinder.getOffset(handle).left);
  }

  // Redraw the view finder as a handle is dragged
  ViewFinder.drag = function(e) {
    if(ViewFinder.dragging) {
      ViewFinder.preventHighlight(e);
      var left      = ViewFinder.dragging === Dashboard.Elements.viewFinderGrabLeft,
          other     = left ? Dashboard.Elements.viewFinderGrabRight : Dashboard.Elements.viewFinderGrabLeft,
          timestamp = ViewFinder.getTimestampFromOffset(e.pageX),
          domain    = Dashboard.Data.filterDomain(timestamp, ViewFinder.getTimestamp(other));
          count     = domain.reduce(function(last, current) {
                        return Math.min(last.data.length, current.data.length);
                      });

          console.log(count);

      // Do not allow zooming if there aren't enough data points to draw a graph
      if(count > 2) {
        var width     = Dashboard.Elements.viewFinder.clientWidth,
            offset    = ViewFinder.getOffset(),
            percent   = (e.pageX - offset.left) / width;

        ViewFinder.dragging.parentNode.style.width = (left ? percent : (1 - percent)) * width + 'px';
        ViewFinder.dragging.setAttribute('data-timestamp', timestamp);

        ViewFinder.updateChart();
      }
    }
  }

  // Prevent event propagation to prevent stray highlighting
  ViewFinder.preventHighlight = function(e){
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    e.cancelBubble=true;
    e.returnValue=false;
    return false;
  }

  // Start dragging on mousedown
  Dashboard.Elements.viewFinderGrabLeft.addEventListener('mousedown', function(e) {
    ViewFinder.dragging = Dashboard.Elements.viewFinderGrabLeft;
    ViewFinder.preventHighlight(e);
  });
  Dashboard.Elements.viewFinderGrabRight.addEventListener('mousedown', function(e) {
    ViewFinder.dragging = Dashboard.Elements.viewFinderGrabRight;
    ViewFinder.preventHighlight(e);
  });

  // Drag on mousemove
  Dashboard.Elements.viewFinder.addEventListener('mousemove', ViewFinder.drag);

  // Stop dragging on mouseup
  window.addEventListener('mouseup', function(e) {
    ViewFinder.dragging = false;
  });

  ViewFinder.init();

  return ViewFinder;
})(Rickshaw, window);