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