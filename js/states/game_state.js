var GameState = (function () {

	var GameState = function(game) {
	  Phaser.State.call(this, game);
	}

	GameState.prototype = Object.create(Phaser.State.prototype);
	GameState.prototype.constructor = GameState;

	GameState.prototype.preload = function () {
	};

	GameState.prototype.create = function () {
		this.createPlayers();

	};

	GameState.prototype.createPlayers = function () {
		var _this = this;
		console.log('existing players', this.game.state.states['setupState'].players);
		_.each(this.game.state.states['setupState'].players, function (player) {
			console.log(player);
			_this.game.add.existing(player);
		});
	}

	return GameState;

}).call(this);
