Dashboard.ViewFinder = (function(Rickshaw) {
  ViewFinder = {
    'selected' : [],
    'dragging' : false
  };

  ViewFinder.draw = function() {
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
    ViewFinder.chart.renderer = Rickshaw.extend(
      Dashboard.Graph.chart.renderer, {
        graph : ViewFinder.chart
      }
    );

    ViewFinder.chart.render();
  }

  ViewFinder.drawBlur = function() {
    var width = Dashboard.Elements.viewFinder.clientWidth,
        min   = Math.min.apply(null, ViewFinder.selected),
        max   = Math.max.apply(null, ViewFinder.selected);

    console.log(ViewFinder.selected);

    Dashboard.Elements.viewFinderBlurLeft.style.display  = 'block';
    Dashboard.Elements.viewFinderBlurLeft.style.width    = min * width + 'px';
    Dashboard.Elements.viewFinderBlurRight.style.display = 'block';
    Dashboard.Elements.viewFinderBlurRight.style.width   = (1 - max) * width + 'px';
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

  Dashboard.Elements.viewFinder.addEventListener('mouseup', function(e) {
    ViewFinder.dragging = false;
    var offset = ViewFinder.getOffset();
    ViewFinder.selected[1] = ((e.pageX - offset.left) / Dashboard.Elements.viewFinder.clientWidth);
    ViewFinder.drawBlur();
  });

  Dashboard.Elements.viewFinder.addEventListener('mousemove', function(e) {
    if(ViewFinder.dragging) {
      console.log('dragging');
      var offset = ViewFinder.getOffset();
      ViewFinder.selected[1] = ((e.pageX - offset.left) / Dashboard.Elements.viewFinder.clientWidth);
      ViewFinder.drawBlur();
    }
    //var
  });

  ViewFinder.draw();

  return ViewFinder;
})(Rickshaw);