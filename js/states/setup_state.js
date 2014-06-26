var SetupState = (function () {

	var SetupState = function(game, x, y, asset, frame) {
	  Phaser.State.call(this, game);
	}

	SetupState.prototype = Object.create(Phaser.State.prototype);
	SetupState.prototype.constructor = SetupState;

	SetupState.prototype.preload = function () {

	};

	SetupState.prototype.create = function () {

	}

	return SetupState;

}).call(this);
