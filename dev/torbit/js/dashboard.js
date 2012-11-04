/*/
/* Dashboard is a dummy main class, only used for namespacing currently,
/* but this would likely house some methods in a more complex application
/*/

var Dashboard = (function() {
  var Dashboard = {};

  return Dashboard;
})();

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
    'viewFinderGrabRight' : document.querySelector('#blur-right .handle'),
    'input'               : document.getElementById('input'),
    'random'              : document.getElementById('random'),
    'inputSubmit'         : document.getElementById('submit')
  }
})(document);

Dashboard.Controls = (function(Rickshaw) {
  Controls = {
    'stacked' : Dashboard.Elements.viewMode.value === 'stacked'
  };

  // Toggler for stacked vs. independent
  Dashboard.Elements.viewMode.addEventListener('change', function(e) {
    Dashboard.Controls.stacked = Dashboard.Elements.viewMode.value === 'stacked';
    Dashboard.Graph.draw();
  });

  // Random input generator
  Dashboard.Elements.random.addEventListener('click', function(e) {
    Dashboard.Elements.input.value = JSON.stringify(Dashboard.Data.randomInput());
  });

  // Input submitter
  Dashboard.Elements.inputSubmit.addEventListener('click', function(e) {
    Dashboard.Data.setInput(JSON.parse(Dashboard.Elements.input.value));
    Dashboard.Graph.draw();
  });

  return Controls;
})(Rickshaw);

Dashboard.Data = (function(Rickshaw, d3, document) {
  var Data = {
    'series' : {
      'raw'        : [],
      'graph'      : [],
      'viewfinder' : []
    }
  };

  // Return a random integer within a range
  Data.randomInteger = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Return a lightly smoothed series of random integers
  Data.randomIntegerSeries = function(len, min, max, vRatio) {
    vRatio = typeof vRatio !== 'undefined' ? vRatio : 0.15; // 31 data points

    var volatility = Math.round(Math.abs(max - min) * vRatio);
    for(var i = 0, r = [], seed = Data.randomInteger(min, max); i < len; i++) {
      r[i] = Data.randomInteger(Math.max(min, seed - volatility), Math.min(max, seed + volatility));
      seed = r[i];
    }

    return r;
  }

  // Return random input given a number of datapoints, an initial timestamp, and an interval 
  Data.randomInput = function(length, start, interval) {
    // Defaults
    length   = typeof length   !== 'undefined' ? length   : 31; // 31 data points
    start    = typeof start    !== 'undefined' ? start    : Math.floor(new Date().getTime() / 1000) - (86400 * 31); // Starting 31 days ago
    interval = typeof interval !== 'undefined' ? interval : 86400; // 1 data point per day

    var data = { 'data' : [] },
        backend_ms  = Data.randomIntegerSeries(length, 200, 600),
        frontend_ms = Data.randomIntegerSeries(length, 800, 2400);

    for(time = start, index = 0; index < length; index++, time += interval) {
      data['data'][index] = {
        'timestamp'   : time,
        'backend_ms'  : backend_ms[index],
        'frontend_ms' : frontend_ms[index]
      };
    }

    return data;
  }

  // Create a Rickshaw-usable data series from application input
  Data.transform = function(arr, field) {
    return arr.map(function(value) {
      return {
        'x' : value['timestamp'],
        'y' : value[field]
      };
    });
  }

  // Validate user input
  Data.validate = function(json) {
    return json &&
           Object.prototype.toString.call(json.data) === '[object Array]' &&
           json.data.every(function(point) {
             return !isNaN(point.timestamp) &&
                    !isNaN(point.backend_ms) &&
                    !isNaN(point.frontend_ms);
           });
  }

  // Create a full series object for the Rickshaw.Graph constructor
  Data.palette = new Rickshaw.Color.Palette({ scheme: 'colorwheel' });
  Data.colors = [d3.rgb(Data.palette.color()), d3.rgb(Data.palette.color())];
  Data.parseInput = function(json) {
    var data = json['data'];
    return [{
      name   : 'Frontend',
      color  : 'rgba(' + Data.colors[1]['r'] + ',' + Data.colors[1]['g'] + ',' + Data.colors[1]['b'] + ',0.25)',
      stroke : 'rgba(' + Data.colors[1]['r'] + ',' + Data.colors[1]['g'] + ',' + Data.colors[1]['b'] + ',0.75)',
      data   : Data.transform(data, 'frontend_ms')
    }, {
      name   : 'Backend',
      color  : 'rgba(' + Data.colors[0]['r'] + ',' + Data.colors[0]['g'] + ',' + Data.colors[0]['b'] + ',0.25)',
      stroke : 'rgba(' + Data.colors[0]['r'] + ',' + Data.colors[0]['g'] + ',' + Data.colors[0]['b'] + ',0.75)',
      data   : Data.transform(data, 'backend_ms')
    }];
  }

  // Set new input data and redraw the graph
  Data.setInput = function(json) {
    Dashboard.Elements.input.value = JSON.stringify(json);

    Data.series.graph      = Data.parseInput(json);
    Data.series.viewfinder = Data.parseInput(json);
    return Data.series.raw = Data.parseInput(json);
  }

  // Return the data points within a given domain, given as timestamps 
  Data.filterDomain = function(start, end) {
    var min      = Math.min(start, end),
        max      = Math.max(start, end),
        filtered = [];

    Data.series.raw.forEach(function(series) {
      filtered.push({
        'data' : series.data.filter(function(point) {
          return point.x >= min && point.x <= max;
        })
      });
    })
    return filtered;
  }

  return Data;
})(Rickshaw, d3, document);

Dashboard.Graph = (function(Rickshaw) {
  var Graph = {};

  // (Re)draw the graph with optional configuration changes
  Graph.draw = function(config) {
    Dashboard.Data.series.graph.forEach(function(series, i) {
      Graph.chart.series[i].data = series.data;
    });

    if(config) {
      Graph.chart.configure(config);
    }

    Graph.chart.renderer.unstack = !Dashboard.Controls.stacked;

    Graph.chart.render();
  }
  
  // Draw the initial graph
  Graph.init = function() {
    var input  = Dashboard.Data.randomInput();
    var series = Dashboard.Data.setInput(input);

    Graph.chart = new Rickshaw.Graph({
      element  : Dashboard.Elements.chart,
      width    : 770,
      height   : 320,
      padding  : {
        'top'    : 0.1,
        'bottom' : 0.1
      },
      renderer : 'area',
      min      : 0,
      series   : series,
      stroke   : true
    });

    // Determine stacked vs. independent
    Graph.chart.renderer.unstack = !Dashboard.Controls.stacked;

    // Add axes, legend, & tooltips
    Graph.extras = {
      axes : {
        x : new Rickshaw.Graph.Axis.Time({ graph: Graph.chart }),
        y : new Rickshaw.Graph.Axis.Y({
          graph       : Graph.chart,
          orientation : 'left',
          tickFormat  : Rickshaw.Fixtures.Number.formatKMBT,
          element     : Dashboard.Elements.yAxis
        })
      },
      
      legend : new Rickshaw.Graph.Legend({
        element : Dashboard.Elements.legend,
        graph   : Graph.chart
      }),

      hover : new Rickshaw.Graph.HoverDetail({
        graph      : Graph.chart,
        yFormatter : function(y) { return Math.round(y); } 
      })
    }

    Graph.extras.toggle = new Rickshaw.Graph.Behavior.Series.Toggle({
      graph: Graph.chart,
      legend: Graph.extras.legend
    });

    Graph.draw();
  }

  Graph.init();

  return Graph;
})(Rickshaw);

Dashboard.ViewFinder = (function(Rickshaw, window) {
  ViewFinder = {
    'selected' : [],
    'dragging' : false,
    'domain'   : Dashboard.Graph.chart.dataDomain()
  };

  // (Re)draw the view finder with optional configuration changes
  ViewFinder.draw = function(config) {
    ViewFinder.domain = Dashboard.Graph.chart.dataDomain();

    Dashboard.Data.series.viewfinder.forEach(function(series, i) {
      ViewFinder.chart.series[i].data = series.data;
    });

    if(config) {
      ViewFinder.chart.configure(config);
    }

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

  // Get the offset of an element relative to the top left corner of the document
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
  // Borrowed from http://stackoverflow.com/q/5429827/1366376 
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