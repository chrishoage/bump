'use strict';

var Phaser = require('phaser');

var Player = require('./player');

function PlayerFour (game, x, y, asset, frame) {
	x = x || game.world.centerX;
	y = y || game.world.centerY;
	asset = asset || 'player4';
  Player.call(this, game, x, y, asset, frame);

  this.mushroomed = false;
  this.barColor = 0xD91919;
  this.color = '#D91919';

}

PlayerFour.prototype = Object.create(Player.prototype);
PlayerFour.prototype.constructor = PlayerFour;

PlayerFour.prototype.update = function () {
	Player.prototype.update.call(this);
	if (this.playerPowerUpActive && !this.playerPowerUpCooldown) {
		console.log('power up active')
		if (!this.mushroomed) {
			this.mushroomed = true;
			this.body.setCircle(64);
			var scaleUP = this.game.add.tween(this.scale).to({ x: 2, y: 2}, 500, Phaser.Easing.Back.Out, true, 0, false, false)
			scaleUP.onComplete.add(function () {
				var scaleDown = this.game.add.tween(this.scale).to({ x: 1, y: 1}, 500, Phaser.Easing.Back.In, true, 3500, false, false)
				scaleDown.onComplete.add(function() {
					this.body.setCircle(32);
				}, this)
			}, this);
		}
	} else {
		this.mushroomed = false;
	}
};

module.exports = PlayerFour;
