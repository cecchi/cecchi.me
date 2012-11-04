Dashboard.Controls = (function(Graph, Data, Elements, Rickshaw) {
  Controls = {
    'stacked' : Elements.viewMode.value === 'stacked'
  };

  // Toggler for stacked vs. independent
  Elements.viewMode.addEventListener('change', function(e) {
    Controls.stacked = Elements.viewMode.value === 'stacked';
    Graph.draw();
  });

  // Random input generator
  Elements.random.addEventListener('click', function(e) {
    Elements.input.value = JSON.stringify(Data.randomInput());
  });

  // Input submitter
  Elements.inputSubmit.addEventListener('click', function(e) {
    Data.setInput(JSON.parse(Elements.input.value));
    Graph.draw();
  });

  return Controls;
})(Dashboard.Graph, Dashboard.Data, Dashboard.Elements, Rickshaw);