// Represents a single train car.
Train = function(x, y, width, height, dir, color) {
  var Train = {};

  // Attributes
  Train.id  = ++Game.index;
  Train.pos = {
    x : x,
    y : y
  };
  Train.width  = width;
  Train.height = height;
  Train.dir    = dir;

  // int, int -> void
  Train.move = function(x, y) {
    // Delta
    var dx = x - Train.pos.x;
    var dy = y - Train.pos.y;
    x = Train.pos.x + (dx > 0 ? 1 : (dx < 0 ? -1 : 0));
    y = Train.pos.y + (dy > 0 ? 1 : (dy < 0 ? -1 : 0));

    // New position
    var to = {};
    to.x = Train.dir.indexOf('x') == -1 ? Train.pos.x : x;
    to.y = Train.dir.indexOf('y') == -1 || to.x !== Train.pos.x ? Train.pos.y : y;

    console.log('Move from (' + Train.pos.x + ',' + Train.pos.y + ') to (' + to.x + ',' + to.y + ')');

    // In bounds and non-colliding
    if(Train.isWinning(to.x, to.y) || Train.isInBounds(to.x, to.y) && _.every(Game.trains, function(train) {
      return !Train.collides(train, to.x, to.y);
    })) {
      Train.pos = to;
      Board.draw();
    }
  }

  // Is the train leaving the gate at (x, y)
  Train.isWinning = function(x, y) {
    return (
      x + Train.width > Config.size &&
      y == Config.gate &&
      Train.height == 1
    ) && Game.end();
  }

  // Is the train in bounds if at (x, y)
  Train.isInBounds = function(x, y) {
    return (
      x >= 0 &&
      x + Train.width <= Config.size &&
      y >= 0 &&
      y + Train.height <= Config.size
    );
  }

  // Is the train colliding with another train if at (x, y)
  Train.collides = function(other, x, y) {
    if(Train.id == other.id) {
      return false;
    } else {
      return (
        x < (other.pos.x + other.width) &&
        other.pos.x < (x + Train.width) &&
        y < (other.pos.y + other.height) &&
        other.pos.y < (y + Train.height)
      );
    }
  }

  // int, int -> imageData
  Train.draw = function(width, height) {
    var px = {
      'width'  : Board.getTileSize() * Train.width,
      'height' : Board.getTileSize() * Train.height
    }

    var canvas = document.createElement('canvas');
        canvas.setAttribute('width', px.width);
        canvas.setAttribute('height', px.height);
        canvas.setAttribute('class', 'virtual');
        canvas.setAttribute('id', 'train-' + Train.id);

    document.body.appendChild(canvas);

    var ctx = canvas.getContext('2d');
        ctx.fillStyle   = color;
        ctx.strokeStyle = '#000000';

    ctx.fillRect(
      Config.padding, 
      Config.padding, 
      px.width - (Config.padding * 2),
      px.height - (Config.padding * 2)
    );
    ctx.strokeRect(
      Config.padding, 
      Config.padding, 
      px.width - (Config.padding * 2),
      px.height - (Config.padding * 2)
    );

    var imageData = ctx.getImageData(0, 0, px.width, px.height);

    canvas.parentNode.removeChild(canvas);

    return imageData;
  }

  return Train;
}