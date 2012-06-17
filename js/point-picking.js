/**
 * Polygon Triangulation and Point Picking
 * (c) 2011, Cecchi MacNaughton
 * License: http://www.opensource.org/licenses/mit-license.php
 *
 * Comments: This is simply a demo script and is more a proof-of-concept than anything else.
 *           As such, it is not overly optimized and the code is somewhat drawn-out for easier readability.
 *           You'll probably notice an apparently over-use of closures, this is just the only way I could
 *           maintain code readability while displaying the algorithm step by step.
 **/

var ctx;
var polygon = {
  editable  : true,
  original  : [],
  vertex    : [],
  reflex    : [],
  convex    : [],
  dead      : [],
  ears      : [],
  triangles : [],
  points    : [],
  area      : 0,
  settings  : {
    count   : 600,
    tspeed  : 1000,
    pspeed  : 8
  },
  draw      : function(original) {
    original = original == undefined ? false : original;
    // Clear the canvas
    ctx.clearRect(0, 0, $('#canvas').width(), $('#canvas').height());
    // Stroke and fill the path from vertex to vertex
    if(polygon.size((original ? 'original' : 'vertex')) >= 3) {
      ctx.beginPath();
      this.each((original ? 'original' : 'vertex'), function(i, p) {
        (i == 0) ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.strokeStyle = "#003399";
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.stroke();
    }
    // Draw triangles
    if(polygon.size('triangles')) {
      ctx.strokeStyle = "#009900";
      ctx.fillStyle = "#DDFFDD";
      this.each('triangles', function(i, t) {
        ctx.beginPath();
        $.each(t.vertex, function(c, p) {
          (c == 0) ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });
    }
    // Draw points
    if(polygon.size('points')) {
      this.each('points', function(i, p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, 2 * Math.PI, false);
        ctx.closePath();
        ctx.fillStyle = "#990000";
        ctx.fill();
      });
    }
    return this;
  },
  add      : function(val, set) {
    set = set == undefined ? 'vertex' : set;
    if(set == 'vertex') {
      val.id = this.size('vertex');
    }
    this[set].push(val);
    return this;
  },
  get      : function(i, set) {
    set = set == undefined ? 'vertex' : set;
    return this[set][i];
  },
  indexOf  : function(i, set) {
    set = set == undefined ? 'vertex' : set;
    return this[set].indexOf(i);
  },
  set      : function(i, val, set) {
    set = set == undefined ? 'vertex' : set;
    this[set][i] = val;
    return this;
  },
  remove  : function(i, set) {
    set = set == undefined ? 'vertex' : set;
    var dead = this[set].splice(i, 1)[0];
    if(set == 'vertex' && dead != undefined) {
      this.add(dead, 'dead');
    }
    return this;
  },
  empty    : function(set) {
    set = set == undefined ? 'vertex' : set;
    this[set] = [];
    return this;
  },
  size    : function(set) {
    set = set == undefined ? 'vertex' : set;
    return this[set].length;
  },
  each    : function(set, f) {
    if(Array.isArray(set)) {
      var out = [];
      $.each(set, function(i, a) {
        out = out.concat(polygon[a]);
      });
      set = out;
    } else {
      set = set == undefined ? this['vertex'] : this[set];
    }
    $.each(set, f);
    return this;
  }
}
$(document).ready(function() {
  ctx = document.getElementById('canvas').getContext('2d');
  $('#canvas').click(function(e) {
    if(!polygon.editable) {
      return false;
    }
    p = {
      x : e.pageX-$('#canvas').offset().left, 
      y : e.pageY-$('#canvas').offset().top
    };
    if(polygon.size() && Math.abs(p.x-polygon.get(0).x) < 6 && Math.abs(p.y-polygon.get(0).y) < 6) {
      $('#populate').click();
    } else {
      polygon.add(p);
      if(polygon.size()) {
        ctx.clearRect(0, 0, $('#canvas').width(), $('#canvas').height());
        ctx.beginPath();
        var l = {};
        polygon.each('vertex', function(i, p) {
          (i == 0) ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
          l = p;
        });
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#003399";
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(l.x, l.y);
        ctx.strokeStyle = "#990000";
        ctx.lineTo(polygon.get(0).x, polygon.get(0).y);
        ctx.stroke();
      }
    }
  });
  $('#canvas').mousemove(function(e) {
    if(polygon.editable) {
      return false;
    }
    mouse = {
      x : e.pageX-$('#canvas').offset().left, 
      y : e.pageY-$('#canvas').offset().top
    };
    hover = false;
    polygon.each(['vertex', 'dead'], function(i, p) {
      if(Math.abs(mouse.x-p.x) < 6 && Math.abs(mouse.y-p.y) < 6) {
        hover = true;
        html = 'Vertex '+p.id+': '+(polygon.clockwise ? '' : 'counter-')+'clockwise polygon';
        html += '<br />Coordinates: ('+p.x+', '+p.y+')';
        html += '<br />Type: '+(p.convex ? 'convex' : 'reflex');
        html += '<br />xProduct: '+p.crossproduct;
        html += '<br />Degrees: '+p.degrees;
        html += '<br />Radians: '+p.radians;
        $('#tooltip').css({
          'left'  : $('#canvas').offset().left-$('#content').offset().left+e.offsetX,
          'top'   : $('#canvas').offset().top-$('#content').offset().top+e.offsetY
        }).html(html).show();
        return false;
      }
    });
    if(!hover) {
      $('#tooltip').hide();
    }
  });
	$('#reset').click(function() {
		polygon.empty('original').empty('vertex').empty('reflex').empty('convex').empty('dead').empty('ears').empty('triangles').empty('points').area = 0;
		polygon.editable = true;
		polygon.draw();
	});
  $('#populate').click(function() {
    if(polygon.size() < 3) {
      alert("Please add at least 3 vertices first")
      return false;
    }
    // Close the polygon
    polygon.each('vertex', function(i, v) {
      polygon.add(v, 'original');
    });
    polygon.editable = false;
    polygon.draw();
    
    // Clockwise or counter-clockwise polygon?
    var area = 0;
    l = polygon.get(polygon.size()-1);
    polygon.each('vertex', function(i, p) {
      n = polygon.get((i+1)%polygon.size());
      area += p.x*n.y-p.y*n.x;
    });
    polygon.clockwise = (area > 0);
    
    // Calculate cross products
    l = polygon.get(polygon.size()-1);
    polygon.each('vertex', function(i, p) {
      n = polygon.get((i+1)%polygon.size());
      // Get cross product between adjacent edges to determine if angles are convex/concave
      p.crossproduct = (p.x-l.x)*(n.y-p.y)-(p.y-l.y)*(n.x-p.x);
      p.convex = polygon.clockwise ? p.crossproduct > 0 : p.crossproduct < 0;
      // Calculate interior angles in radians and degrees
      var ab = Math.sqrt(Math.pow(p.x-l.x, 2)+Math.pow(p.y-l.y, 2)); 
      var ac = Math.sqrt(Math.pow(p.x-n.x, 2)+Math.pow(p.y-n.y, 2));
      var bc = Math.sqrt(Math.pow(n.x-l.x, 2)+Math.pow(n.y-l.y, 2));
      p.radians = Math.acos((ac*ac+ab*ab-bc*bc)/(2*ac*ab));
      p.radians = p.convex ? p.radians : (2*Math.PI)-p.radians;
      p.degrees = p.radians*(180/Math.PI);
      // Maintain arrays of convex & reflex angles
      p.convex ? polygon.add(i, 'convex') : polygon.add(i, 'reflex');
      l = p;
    });
    
    (function clip() {
      polygon.empty('convex').empty('reflex').empty('ears');
      // Calculate cross products
      l = polygon.get(polygon.size()-1);
      polygon.each('vertex', function(i, p) {
        n = polygon.get((i+1)%polygon.size());
        // Get cross product between adjacent edges to determine if angles are convex/concave
        p.crossproduct = (p.x-l.x)*(n.y-p.y)-(p.y-l.y)*(n.x-p.x);
        p.convex = polygon.clockwise ? p.crossproduct > 0 : p.crossproduct < 0;
        // Calculate interior angles in radians and degrees
        var ab = Math.sqrt(Math.pow(p.x-l.x, 2)+Math.pow(p.y-l.y, 2)); 
        var ac = Math.sqrt(Math.pow(p.x-n.x, 2)+Math.pow(p.y-n.y, 2));
        var bc = Math.sqrt(Math.pow(n.x-l.x, 2)+Math.pow(n.y-l.y, 2));
        p.radians = Math.acos((ac*ac+ab*ab-bc*bc)/(2*ac*ab));
        p.radians = p.convex ? p.radians : (2*Math.PI)-p.radians;
        p.degrees = p.radians*(180/Math.PI);
        // Maintain arrays of convex & reflex angles
        p.convex ? polygon.add(i, 'convex') : polygon.add(i, 'reflex');
        l = p;
      });
      
      // Get "ears" by iterating over all reflex vertices
      polygon.each('convex', function(d, i) {
        var l = polygon.get((((i-1)%polygon.size())+polygon.size())%polygon.size());
        var p = polygon.get(i);
        var n = polygon.get((i+1)%polygon.size());
        
        var ear = true;
        // Check if any of the reflex vertices are inside this triangle
        polygon.each('reflex', function(c, r) {
          v = polygon.get(r);
          // Take the cross product of vertex v against each edge of triangle LPN
          var lp = (v.y-l.y)*(p.x-l.x) - (v.x-l.x)*(p.y-l.y);
          var pn = (v.y-p.y)*(n.x-p.x) - (v.x-p.x)*(n.y-p.y);
          var nl = (v.y-n.y)*(l.x-n.x) - (v.x-n.x)*(l.y-n.y);
          return ear = !((lp*pn > 0) && (pn*nl > 0));
        });
        if(ear) {
          polygon.add(i, 'ears');
        }
      });
      
      // Clip an ear, rinse, repeat
      var i = polygon.get(0, 'ears');
      var l = polygon.get((((i-1)%polygon.size())+polygon.size())%polygon.size());
      var p = polygon.get(i);
      var n = polygon.get((i+1)%polygon.size());
      var area = Math.abs((p.x-l.x)*(n.y-l.y)-(n.x-l.x)*(p.y-l.y))/2;
      polygon.add({
        area    : area,
        vertex  : [
          {'x' : l.x, 'y' : l.y},
          {'x' : p.x, 'y' : p.y},
          {'x' : n.x, 'y' : n.y}
        ]
      }, 'triangles');
      polygon.area += area;
      polygon.remove(i);
      polygon.draw();
      
      setTimeout(function() {
        if(polygon.size() >= 3) {
          clip();
        } else {
          // Calculate triangle weights and pick points
          sum = 0;
          max = {i : 0, area : 0};
          var ii = 0;
          (function nexttriangle(i) {
            i = i == undefined ? ii : i;
            var t = polygon.get(i, 'triangles');
            t.weight = t.area/polygon.area;
            t.count = Math.round(t.weight*polygon.settings.count);
            // Account for rounding errors
            max = t.area > max.area ? {i : i, area : t.area} : max;
            sum += t.count;
            if((i+1) == polygon.size('triangles') && sum != polygon.settings.count) {
              polygon.get(max.i, 'triangles').count += polygon.settings.count-sum;
            }
            var ki = 0;
            (function nextpoint(k) {
              k = k == undefined ? ki : k;
              // Generate 3 random numbers on the interval [0,1] who sum to 1
              var a = Math.random();
              var b = Math.random();
              if((a+b) > 1) {
                a = 1-a;
                b = 1-b;
              }
              var c = 1-a-b;
              var point = {x : 0, y : 0};
              // Map to barycentric coordinates
              $.each([a, b, c], function(d, j) {
                v = t.vertex[d];
                point.x += j*v.x;
                point.y += j*v.y;
              });
              polygon.add(point, 'points');
              polygon.draw();
              setTimeout(function() {
                k+1 < t.count ? nextpoint(k+1) : (i+1 < polygon.size('triangles') ? nexttriangle(i+1) : (function finish() {
                  polygon.empty('triangles');
                  polygon.draw(true);
                })());
              }, polygon.settings.pspeed);
            })();
          })();
        }
      }, polygon.settings.tspeed);
    })()
  });
});