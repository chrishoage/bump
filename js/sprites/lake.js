var Lake = (function () {

  var Lake = function (game, x, y, width, height, asset, frame) {
    x = x || 0;
    y = y || 0;
    width = width || game.world.width;
    height = height || game.world.height;
    asset = asset || 'lake';

    Phaser.TileSprite.call(this, game, x, y, width, height, asset, frame);
  }

  Lake.prototype = Object.create(Phaser.TileSprite.prototype);
  Lake.prototype.constructor = Lake;

  Lake.prototype.update = function () {
    this.tilePosition.x += 0.25;
    this.tilePosition.y += 0.25;
  };

  return Lake;

}).call(this);
