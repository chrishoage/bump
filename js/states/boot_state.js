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
    var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
    var t = game.add.text(game.world.centerX-300, 0, 'hello world', style);

	}

	return BootState;

}).call(this);
