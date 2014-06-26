var BootState = (function () {
	var BootState = function(game, x, y, asset, frame) {
	  Phaser.State.call(this, game);
	}

	BootState.prototype = Object.create(Phaser.State.prototype);
	BootState.prototype.constructor = BootState;

	BootState.prototype.preload = function () {
		this.game.load.image('player', 'assets/images/circle.png');
		this.game.stage.backgroundColor = "#1192bd";
	};

	BootState.prototype.create = function () {
		this.game.state.start("setupState");

        // game.stage.setBackgroundColor(0x1192bd);
	}

	return BootState;

}).call(this);
