var PlayerThree = (function () {

	var PlayerThree = function(game, x, y, asset, frame) {
		x = x || game.world.centerX;
		y = y || game.world.centerY;
		asset = asset || 'player3';
	  Player.call(this, game, x, y, asset, frame);
	}

	PlayerThree.prototype = Object.create(Player.prototype);
	PlayerThree.prototype.constructor = PlayerThree;

	return PlayerThree;

}).call(this);
