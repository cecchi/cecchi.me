// Drawing and visual logic
var Board = (function() {
  var Board = {}

  var canvas  = Config.board,
      context = canvas.getContext('2d');

  Board.getTileSize = function(unit) {
    return (canvas.width - (Config.border * 2)) / Config.size;
  }

  Board.tileToPixel = function(tile) {
    return Math.floor(tile * Board.getTileSize() + Config.border);
  }

  Board.pixelToTile = function(pixel) {
    return Math.floor((pixel - Config.border) / Board.getTileSize());
  }

  Board.draw = function() {
    // Clear
    context.fillStyle = '#777777';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.clearRect(
      Config.border,
      Config.border,
      canvas.width - (Config.border * 2),
      canvas.height - (Config.border * 2)
    );

    // Draw tiles
    for(x = 0; x < Config.size; x++) {
      for(y = 0; y < Config.size; y++) {
        context.fillStyle = (x + y) % 2 ? '#DDDDDD' : '#AAAAAA';
        context.fillRect(
          Board.tileToPixel(x) + Config.padding,
          Board.tileToPixel(y) + Config.padding,
          Board.getTileSize() - (Config.padding * 2),
          Board.getTileSize() - (Config.padding * 2)
        );
      }
    }

    // Draw gate
    context.fillStyle = '#FFFFFF';
    context.fillRect(
      Board.tileToPixel(Config.size),
      Board.tileToPixel(Config.gate),
      Config.border,
      Board.getTileSize()
    );

    // Draw trains
    _.each(Game.trains, function(train) {
      var imageData = train.draw();
      context.putImageData(imageData, Board.tileToPixel(train.pos.x), Board.tileToPixel(train.pos.y));
    });
  }

  return Board;
})();