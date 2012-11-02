Dashboard.Data = (function(Rickshaw, d3) {
  var Data = {'series' : []};

  Data.randomInteger = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  Data.randomIntegerSeries = function(len, min, max, vRatio) {
    vRatio = typeof vRatio !== 'undefined' ? vRatio : 0.15; // 31 data points

    var volatility = Math.round(Math.abs(max - min) * vRatio);
    for(var i = 0, r = [], seed = Data.randomInteger(min, max); i < len; i++) {
      r[i] = Data.randomInteger(Math.max(min, seed - volatility), Math.min(max, seed + volatility));
      seed = r[i];
    }

    return r;
  }

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

  Data.transform = function(arr, field) {
    return arr.map(function(value) {
      return {
        'x' : value['timestamp'],
        'y' : value[field]
      };
    });
  }

  Data.palette = new Rickshaw.Color.Palette({ scheme: 'colorwheel' });
  Data.colors = [d3.rgb(Data.palette.color()), d3.rgb(Data.palette.color())];
  Data.parseInput = function(json) {
    var data = json['data'];
    var r = [{
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

    return Dashboard.Controls.stacked ? r : r;
  }

  Data.setInput = function(json) {
    return Data.series = Data.parseInput(json);
  }

  return Data;
})(Rickshaw, d3);