var PlayerThree = (function () {

	var PlayerThree = function(game, x, y, asset, frame) {
		x = x || game.world.centerX;
		y = y || game.world.centerY;
		asset = asset || 'player3';
	  Player.call(this, game, x, y, asset, frame);
	  this.teleported = false;
	}

	PlayerThree.prototype = Object.create(Player.prototype);
	PlayerThree.prototype.constructor = PlayerThree;

	PlayerThree.prototype.update = function () {
		if (this.playerPowerUpActive && !this.playerPowerUpCooldown) {
			console.log('power up active')
			this.body.setZeroVelocity();
			if (!this.teleported) {
				this.teleported = true;
				
				this.game.state.states["gameState"].safeRectangle

				this.body.x = this.game.world.randomX;
				this.body.y = this.game.world.randomY;
			}
		} else {
			this.teleported = false;
		}
	};


	return PlayerThree;

}).call(this);
