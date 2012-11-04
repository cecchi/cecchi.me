Dashboard.Graph = (function(Data, Elements, Controls, Rickshaw) {
  var Graph = {};

  // (Re)draw the graph with optional configuration changes
  Graph.draw = function(config) {
    console.log('Redrawing', Data.series.graph);

    Data.series.graph.forEach(function(series, i) {
      Graph.chart.series[i].data = series.data;
    });

    if(config) {
      Graph.chart.configure(config);
    }

    Graph.chart.renderer.unstack = !Controls.stacked;

    Graph.chart.render();
  }
  
  // Draw the initial graph
  Graph.init = function() {
    var input  = Data.randomInput();
    var series = Data.setInput(input);

    Graph.chart = new Rickshaw.Graph({
      element  : Elements.chart,
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
    Graph.chart.renderer.unstack = !Controls.stacked;

    // Add axes, legend, & tooltips
    Graph.extras = {
      axes : {
        x : new Rickshaw.Graph.Axis.Time({ graph: Graph.chart }),
        y : new Rickshaw.Graph.Axis.Y({
          graph       : Graph.chart,
          orientation : 'left',
          tickFormat  : Rickshaw.Fixtures.Number.formatKMBT,
          element     : Elements.yAxis
        })
      },
      
      legend : new Rickshaw.Graph.Legend({
        element : Elements.legend,
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
})(Dashboard.Data, Dashboard.Elements, Dashboard.Controls, Rickshaw);