var app = (function(Rickshaw) {
  var app = {};

  app.generateData = function(length, start, interval) {
    // Defaults
    length   = typeof length   !== 'undefined' ? length   : 31; // 31 data points
    start    = typeof start    !== 'undefined' ? start    : Math.floor(new Date().getTime() / 1000) - (86400 * 31); // Starting 31 days ago
    interval = typeof interval !== 'undefined' ? interval : 86400; // 1 data point per day

    function randomInteger(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    function randomIntegerSeries(len, min, max, vRatio) {
      vRatio = typeof vRatio !== 'undefined' ? vRatio : 0.2; // 31 data points

      var volatility = Math.round(Math.abs(max - min) * vRatio);
      for(var i = 0, r = [], seed = randomInteger(min, max); i < len; i++) {
        r[i] = randomInteger(Math.max(min, seed - volatility), Math.min(max, seed + volatility));
        seed = r[i];
      }
      return r;
    }

    var data = { 'data' : [] },
        backend_ms  = randomIntegerSeries(length, 200, 600),
        frontend_ms = randomIntegerSeries(length, 800, 4000);

    for(time = start, index = 0; index < length; index++, time += interval) {
      data['data'][index] = {
        'timestamp'   : time,
        'backend_ms'  : backend_ms[index],
        'frontend_ms' : frontend_ms[index]
      };
    }

    return data;
  }

  app.graph = function(data) {
    var data = data['data'];
    function transform(arr, field) {
      return arr.map(function(value) {
        return {
          'x' : value['timestamp'],
          'y' : value[field]
        };
      });
    }

    var chart = new Rickshaw.Graph({
      element  : document.getElementById('chart'),
      width    : 500,
      height   : 340,
      renderer : 'line',
      series   : [{
        name  : 'Backend',
        color : 'steelblue',
        data  : transform(data, 'backend_ms', 'x')
      }, {
        name  : 'Frontend',
        color : 'red',
        data  : transform(data, 'frontend_ms', 'x')
      }]
    });

    var axes = {
      x : new Rickshaw.Graph.Axis.Time({ graph: chart }),
      y : new Rickshaw.Graph.Axis.Y({
        graph       : chart,
        orientation : 'left',
        tickFormat  : Rickshaw.Fixtures.Number.formatKMBT,
        element     : document.getElementById('y_axis'),
      })
    }
    var legend = new Rickshaw.Graph.Legend({
      element : document.getElementById('legend'),
      graph   : chart
    });

    chart.render();
  }

  var initialData = app.generateData();
  app.graph(initialData);

  return app;
})(Rickshaw);