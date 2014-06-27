var PlayerThree = (function () {

	var PlayerThree = function(game, x, y, asset, frame) {
		x = x || game.world.centerX;
		y = y || game.world.centerY;
		asset = asset || 'player3';
	  Player.call(this, game, x, y, asset, frame);
	  this.teleported = false;
	  this.barColor = 0x000000;

	}

	PlayerThree.prototype = Object.create(Player.prototype);
	PlayerThree.prototype.constructor = PlayerThree;

	PlayerThree.prototype.update = function () {
		Player.prototype.update.call(this);
		if (this.playerPowerUpActive && !this.playerPowerUpCooldown) {
			console.log('power up active')
			this.body.setZeroVelocity();
			if (!this.teleported) {
				this.teleported = true;
				
				var saferect = this.game.state.states["gameState"].safeRectangle;

				this.body.x = this.game.rnd.integerInRange(saferect.left, saferect.right);
				this.body.y = this.game.rnd.integerInRange(saferect.top, saferect.bottom);
			}
		} else {
			this.teleported = false;
		}
	};


	return PlayerThree;

}).call(this);
