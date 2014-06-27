var PlayerOne = (function () {

	var PlayerOne = function(game, x, y, asset, frame) {
		x = x || game.world.centerX;
		y = y || game.world.centerY;
		asset = asset || 'player1';
	  Player.call(this, game, x, y, asset, frame);
	}

	PlayerOne.prototype = Object.create(Player.prototype);
	PlayerOne.prototype.constructor = PlayerOne;

	PlayerOne.prototype.update = function () {
		if (this.playerPowerUpActive && !this.playerPowerUpCooldown) {
			console.log('power up active')
			this.body.setZeroVelocity();
		}
	};

	return PlayerOne;

}).call(this);
