var PlayerFour = (function () {

	var PlayerFour = function(game, x, y, asset, frame) {
		x = x || game.world.centerX;
		y = y || game.world.centerY;
		asset = asset || 'player4';
	  Player.call(this, game, x, y, asset, frame);
	}

	PlayerFour.prototype = Object.create(Player.prototype);
	PlayerFour.prototype.constructor = PlayerFour;

	return PlayerFour;

}).call(this);
