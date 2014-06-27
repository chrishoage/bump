var PlayerTwo = (function () {

	var PlayerTwo = function(game, x, y, asset, frame) {
		x = x || game.world.centerX;
		y = y || game.world.centerY;
		asset = asset || 'player2';
	  Player.call(this, game, x, y, asset, frame);
	}

	PlayerTwo.prototype = Object.create(Player.prototype);
	PlayerTwo.prototype.constructor = PlayerTwo;

	return PlayerTwo;

}).call(this);
