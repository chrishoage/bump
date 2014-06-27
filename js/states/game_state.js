var GameState = (function () {

	var GameState = function(game) {
	  Phaser.State.call(this, game);

	}

	GameState.prototype = Object.create(Phaser.State.prototype);
	GameState.prototype.constructor = GameState;

	GameState.prototype.preload = function () {
	};

	GameState.prototype.create = function () {
    this.game.physics.p2.defaultRestitution = 0.8;
		this.game.physics.p2.checkWorldBounds = true

	  this.players = this.game.state.states['setupState'].players;

		this.createPlayers();

	};

	GameState.prototype.createPlayers = function () {
		var _this = this;
		console.log('existing players', this.game.state.states['setupState'].players);
		_.each(this.players, function (player) {
			console.log(player);
			_this.game.add.existing(player);
		});
	}

	GameState.prototype.update = function () {
		//_.each(this.players, function (player) {
		//	this.game.physics.arcade.collide(player, this.players);
		//}, this);

	};

	return GameState;

}).call(this);
