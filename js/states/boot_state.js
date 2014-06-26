var BootState = (function () {

	var BootState = function(game, x, y, asset, frame) {
	  Phaser.State.call(this, game);
	}

	BootState.prototype = Object.create(Phaser.State.prototype);
	BootState.prototype.constructor = BootState;

	BootState.prototype.preload = function () {
		game.load.image('player', 'assets/images/circle.png');
	};

	BootState.prototype.create = function () {

	}

	return BootState;

}).call(this);
