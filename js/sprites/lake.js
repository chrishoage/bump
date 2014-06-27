var Lake = (function () {

  var Lake = function(game, x, y, asset, frame) {
    x = x || game.world.centerX;
    y = y || game.world.centerY;
    asset = asset || 'lake';
  }

  Lake.prototype = Object.create(Phaser.Sprite.prototype);
  Lake.prototype.constructor = Lake;

  return Lake;

}).call(this);
