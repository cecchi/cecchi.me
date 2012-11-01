var Dashboard = (function(Rickshaw) {
  var Dashboard = {};

  Dashboard.generateData = function(length, start, interval) {
    // Defaults
    length   = typeof length   !== 'undefined' ? length   : 31; // 31 data points
    start    = typeof start    !== 'undefined' ? start    : Math.floor(new Date().getTime() / 1000) - (86400 * 31); // Starting 31 days ago
    interval = typeof interval !== 'undefined' ? interval : 86400; // 1 data point per day

    this.randomInteger = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    this.randomIntegerSeries = function(len, min, max, vRatio) {
      vRatio = typeof vRatio !== 'undefined' ? vRatio : 0.15; // 31 data points

      var volatility = Math.round(Math.abs(max - min) * vRatio);
      for(var i = 0, r = [], seed = this.randomInteger(min, max); i < len; i++) {
        r[i] = this.randomInteger(Math.max(min, seed - volatility), Math.min(max, seed + volatility));
        seed = r[i];
      }
      return r;
    }

    var data = { 'data' : [] },
        backend_ms  = this.randomIntegerSeries(length, 200, 600),
        frontend_ms = this.randomIntegerSeries(length, 800, 2400);

    for(time = start, index = 0; index < length; index++, time += interval) {
      data['data'][index] = {
        'timestamp'   : time,
        'backend_ms'  : backend_ms[index],
        'frontend_ms' : frontend_ms[index]
      };
    }

    return data;
  }

  Dashboard.graph = function(data) {
    var data    = data['data'],
        palette = new Rickshaw.Color.Palette({ scheme: 'colorwheel' });;

    this.transform = function(arr, field) {
      return arr.map(function(value) {
        return {
          'x' : value['timestamp'],
          'y' : value[field]
        };
      });
    }

    var chart = new Rickshaw.Graph({
      element  : document.getElementById('chart'),
      width    : 690,
      height   : 290,
      padding  : {
        'top'    : 0.1,
        'bottom' : 0.1
      },
      renderer : 'line',
      min      : 'auto',
      series   : [{
        name  : 'Backend',
        color : palette.color(),
        data  : this.transform(data, 'backend_ms', 'x')
      }, {
        name  : 'Frontend',
        color : palette.color(),
        data  : this.transform(data, 'frontend_ms', 'x')
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

    var toggle = new Rickshaw.Graph.Behavior.Series.Toggle({
      graph: chart,
      legend: legend
    });

    var hover = new Rickshaw.Graph.HoverDetail({
      graph: chart
    });

    chart.render();
  }

  var initialData = Dashboard.generateData();
  Dashboard.graph(initialData);

  return Dashboard;
})(Rickshaw);