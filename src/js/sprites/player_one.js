'use strict';

var Phaser = require('phaser');

var Player = require('./player');

function PlayerOne (game, x, y, asset, frame) {
	x = x || game.world.centerX;
	y = y || game.world.centerY;
	asset = asset || 'player1';
  Player.call(this, game, x, y, asset, frame);
  this.barColor = 0xFBB03B;
}

PlayerOne.prototype = Object.create(Player.prototype);
PlayerOne.prototype.constructor = PlayerOne;

PlayerOne.prototype.update = function () {
	Player.prototype.update.call(this);
	if (this.playerPowerUpActive && !this.playerPowerUpCooldown) {
		console.log('power up active')
		this.body.setZeroVelocity();
	}
};

module.exports = PlayerOne;
