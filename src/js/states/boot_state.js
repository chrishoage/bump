'use strict';

var Phaser = require('phaser');

function BootState (game, x, y, asset, frame) {
  Phaser.State.call(this, game);
}

BootState.prototype = Object.create(Phaser.State.prototype);
BootState.prototype.constructor = BootState;

BootState.prototype.loaderFull = Phaser.Sprite;
BootState.prototype.loaderEmpty = Phaser.Spirte;

BootState.prototype.preload = function () {
	console.log("preloading loader assets");

	this.game.load.image('loaderEmpty', 'assets/images/loader_empty.png');
	this.game.load.image('loaderFull', 'assets/images/loader_full.png');

	// setup random game options
	this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
	this.game.stage.disableVisibilityChange = true;
};

BootState.prototype.create = function () {
	this.game.state.start("preloadState");
}

module.exports = BootState;
