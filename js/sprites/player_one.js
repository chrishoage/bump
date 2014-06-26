var PlayerOne = (function () {

	var PlayerOne = function(game, x, y, asset, frame) {
		x = x || game.world.centerX;
		y = y || game.world.centerY;
		asset = asset || 'player';
	  Player.call(this, game, x, y, asset, frame);
	}

	PlayerOne.prototype = Object.create(Player.prototype);
	PlayerOne.prototype.constructor = PlayerOne;

	return PlayerOne;

}).call(this);
