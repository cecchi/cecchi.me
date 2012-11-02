Dashboard.ViewFinder = (function(Rickshaw, window) {
  ViewFinder = {
    'selected' : [],
    'dragging' : false
  };

  ViewFinder.draw = function(config) {
    ViewFinder.chart.configure(Rickshaw.extend({
      series : Dashboard.Data.series
    }, config));

    ViewFinder.chart.renderer.unstack = !Dashboard.Controls.stacked;

    ViewFinder.chart.render();
  }

  ViewFinder.init = function() {
    // Hacky cloning implementation, Rickshaw.Graph is mutated heavily during construction
    ViewFinder.chart = new Rickshaw.Graph({
      element  : Dashboard.Elements.viewFinderChart,
      width    : Dashboard.Graph.chart.width,
      min      : Dashboard.Graph.chart.min,
      padding  : Dashboard.Graph.chart.renderer.padding,
      stroke   : Dashboard.Graph.chart.renderer.stroke,
      series   : Dashboard.Data.series,
      renderer : 'area', // Overridden after construction
      height   : 70,
    });

    // Override the renderer
    ViewFinder.chart.renderer       = Rickshaw.extend({}, Dashboard.Graph.chart.renderer);
    ViewFinder.chart.renderer.graph = ViewFinder.chart;

    ViewFinder.chart.render();
  }

  ViewFinder.updateChart = function() {
    // "Blur" the non-selected portions of the view finder
    var width = Dashboard.Elements.viewFinder.clientWidth,
        min   = Math.min.apply(null, ViewFinder.selected),
        max   = Math.max.apply(null, ViewFinder.selected);

    Dashboard.Elements.viewFinderBlurLeft.style.display  = 'block';
    Dashboard.Elements.viewFinderBlurLeft.style.width    = min * width + 'px';
    Dashboard.Elements.viewFinderBlurRight.style.display = 'block';
    Dashboard.Elements.viewFinderBlurRight.style.width   = (1 - max) * width + 'px';

    // Update the main graph
    var domain = Dashboard.Graph.chart.dataDomain(),
        range  = domain[1] - domain[0];

    Dashboard.Graph.chart.window.xMin = domain[0] + (range * min);
    Dashboard.Graph.chart.window.xMax = domain[0] + (range * max);
    Dashboard.Graph.chart.update();
  }

  // Borrowed from http://stackoverflow.com/questions/442404/dynamically-retrieve-the-position-x-y-of-an-html-element
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

  Dashboard.Elements.viewFinder.addEventListener('mousedown', function(e) {
    ViewFinder.dragging = true;
    var offset = ViewFinder.getOffset();
    ViewFinder.selected = [(e.pageX - offset.left) / Dashboard.Elements.viewFinder.clientWidth];
  });

  Dashboard.Elements.viewFinder.addEventListener('mousemove', function(e) {
    if(ViewFinder.dragging) {
      var offset = ViewFinder.getOffset();
      ViewFinder.selected[1] = ((e.pageX - offset.left) / Dashboard.Elements.viewFinder.clientWidth);
      ViewFinder.updateChart();
    }
  });

  window.addEventListener('mouseup', function(e) {
    ViewFinder.dragging = false;
  });


  Dashboard.Graph.chart.onUpdate(ViewFinder.draw);
  ViewFinder.init();

  return ViewFinder;
})(Rickshaw, window);