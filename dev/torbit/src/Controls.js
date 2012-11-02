Dashboard.Controls = (function(Rickshaw) {
  Controls = {
    'stacked' : Dashboard.Elements.viewMode.value === 'stacked'
  };

  // Toggler for stacked vs. independent
  Dashboard.Elements.viewMode.addEventListener('change', function(e) {
    Controls.stacked = e.srcElement.value === 'stacked';
    Dashboard.Graph.draw();
  });

  return Controls;
})(Rickshaw);