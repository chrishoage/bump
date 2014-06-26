var Player = (function () {

	var Player = function(game, x, y, asset, frame) {
	  Phaser.Sprite.call(this, game, x, y, asset, frame);
	}

	Player.prototype = Object.create(Phaser.Sprite.prototype);
	Player.prototype.constructor = Player;

	return Player;

}).call(this);
