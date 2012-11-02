Dashboard.Controls = (function(Rickshaw) {
  Controls = {
    'stacked' : Dashboard.Elements.viewMode.value === 'stacked'
  };

  Dashboard.Elements.viewMode.addEventListener('change', function(e) {
    Controls.stacked = e.srcElement.value === 'stacked';
    Dashboard.Graph.draw();
  });

  return Controls;
})(Rickshaw);