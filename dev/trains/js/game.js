// Tracks game state and interaction
var Game = (function() {
  var Game = {
    index  : 0,
    moving : false,
    ended  : false
  };

  Game.init = function() {
    Game.trains = [
      new Train(0,0,3,1,'x','#33F0FF'),
      new Train(5,0,1,2,'y','#00FF00'),
      new Train(4,0,1,2,'y','#FF00FF'),
      new Train(2,2,2,1,'x','#FF0000'),
      new Train(1,4,1,2,'y','#FFFF00'),
      new Train(5,5,2,2,'xy','#AA8899'),
      new Train(2,3,2,2,'xy','#443311')
    ];

    Board.draw();
  }

  Game.end = function() {
    if(!Game.ended) {
      alert('You win');
      Game.ended = true;
    }
    return true;
  }

  Config.board.addEventListener('mousedown', function(e) {
    var tile = {
      x : Board.pixelToTile(e.offsetX == undefined ? e.layerX : e.offsetX),
      y : Board.pixelToTile(e.offsetY == undefined ? e.layerY : e.offsetY)
    };

    _.each(Game.trains, function(train) {
      if(tile.x >= train.pos.x &&
         tile.x < train.pos.x + train.width &&
         tile.y >= train.pos.y &&
         tile.y < train.pos.y + train.height) {

        console.log('Moving ' + train.id);
        Game.moving = train.id;

      }
    });
  });

  window.addEventListener('mousemove', function(e) {
    if(Game.moving !== false) {
      var train = _.find(Game.trains, function(train) {
        return train.id == Game.moving;
      });

      var tile = {
        x : Board.pixelToTile(e.offsetX == undefined ? e.layerX : e.offsetX),
        y : Board.pixelToTile(e.offsetY == undefined ? e.layerY : e.offsetY)
      };

      train.move(tile.x, tile.y);
    }
  });

  window.addEventListener('mouseup', function(e) {
    Game.moving = false;
  });

  return Game;
})();

Game.init();