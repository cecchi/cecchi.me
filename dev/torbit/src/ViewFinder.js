Dashboard.ViewFinder = (function(Graph, Data, Controls, Elements, Rickshaw, window) {
  ViewFinder = {
    'selected' : [],
    'dragging' : false,
    'domain'   : Graph.chart.dataDomain()
  };

  // (Re)draw the view finder with optional configuration changes
  ViewFinder.draw = function(config) {
    ViewFinder.domain = Graph.chart.dataDomain();

    Data.series.viewfinder.forEach(function(series, i) {
      ViewFinder.chart.series[i].data = series.data;
    });

    if(config) {
      ViewFinder.chart.configure(config);
    }

    ViewFinder.chart.renderer.unstack = !Controls.stacked;

    ViewFinder.chart.render();
  }

  // Keep the main graph and view finder in sync
  Graph.chart.onUpdate(ViewFinder.draw);

  // Draw the initial view finder
  ViewFinder.init = function() {
    // Hacky cloning implementation, Rickshaw.Graph is mutated heavily during construction
    ViewFinder.chart = new Rickshaw.Graph({
      element  : Elements.viewFinderChart,
      width    : Graph.chart.width,
      min      : Graph.chart.min,
      padding  : Graph.chart.renderer.padding,
      stroke   : Graph.chart.renderer.stroke,
      series   : Data.series.viewfinder,
      renderer : 'area',
      height   : 70,
    });

    ViewFinder.chart.renderer.unstack = !Controls.stacked;  

    ViewFinder.chart.render();
  }

  // Redraw the main graph after a view finder change
  ViewFinder.updateChart = function() {
    Graph.chart.window.xMin = Elements.viewFinderGrabLeft.getAttribute('data-timestamp');
    Graph.chart.window.xMax = Elements.viewFinderGrabRight.getAttribute('data-timestamp');
    Graph.chart.update();
  }

  // Get the offset of an element relative to the top left corner of the document
  // Borrowed from http://stackoverflow.com/q/442404/1366376
  ViewFinder.getOffset = function(el) {
    var _x = 0, 
        _y = 0,
        el = el || Elements.viewFinder; 
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
          width     = Elements.viewFinder.clientWidth,
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
      var left      = ViewFinder.dragging === Elements.viewFinderGrabLeft,
          other     = left ? Elements.viewFinderGrabRight : Elements.viewFinderGrabLeft,
          timestamp = ViewFinder.getTimestampFromOffset(e.pageX),
          domain    = Data.filterDomain(timestamp, ViewFinder.getTimestamp(other));
          count     = domain.reduce(function(last, current) {
                        return Math.min(last.data.length, current.data.length);
                      });

          console.log(count);

      // Do not allow zooming if there aren't enough data points to draw a graph
      if(count > 2) {
        var width     = Elements.viewFinder.clientWidth,
            offset    = ViewFinder.getOffset(),
            percent   = (e.pageX - offset.left) / width;

        ViewFinder.dragging.parentNode.style.width = (left ? percent : (1 - percent)) * width + 'px';
        ViewFinder.dragging.setAttribute('data-timestamp', timestamp);

        ViewFinder.updateChart();
      }
    }
  }

  // Prevent event propagation to prevent stray highlighting
  // Borrowed from http://stackoverflow.com/q/5429827/1366376 
  ViewFinder.preventHighlight = function(e){
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    e.cancelBubble=true;
    e.returnValue=false;
    return false;
  }

  // Start dragging on mousedown
  Elements.viewFinderGrabLeft.addEventListener('mousedown', function(e) {
    ViewFinder.dragging = Elements.viewFinderGrabLeft;
    ViewFinder.preventHighlight(e);
  });
  Elements.viewFinderGrabRight.addEventListener('mousedown', function(e) {
    ViewFinder.dragging = Elements.viewFinderGrabRight;
    ViewFinder.preventHighlight(e);
  });

  // Drag on mousemove
  Elements.viewFinder.addEventListener('mousemove', ViewFinder.drag);

  // Stop dragging on mouseup
  window.addEventListener('mouseup', function(e) {
    ViewFinder.dragging = false;
  });

  ViewFinder.init();

  return ViewFinder;
})(Dashboard.Graph, Dashboard.Data, Dashboard.Controls, Dashboard.Elements, Rickshaw, window);