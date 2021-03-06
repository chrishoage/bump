'use strict';

var Phaser = require('phaser');

var Player = require('./player');

function PlayerTwo (game, x, y, asset, frame) {
	x = x || game.world.centerX;
	y = y || game.world.centerY;
	asset = asset || 'player2';
  Player.call(this, game, x, y, asset, frame);
  this.thrusted = false
  this.barColor = 0x65BF85;
  this.color = '#65BF85';
}

PlayerTwo.prototype = Object.create(Player.prototype);
PlayerTwo.prototype.constructor = PlayerTwo;

PlayerTwo.prototype.update = function () {
	Player.prototype.update.call(this);
	if (this.playerPowerUpActive && !this.playerPowerUpCooldown) {
		if (!this.thrusted) {
			console.log('power up active')
			this.thrusted = true;
			this.body.thrust(50000);
		}
	} else {
		this.thrusted = false;
	}
};

module.exports = PlayerTwo;
