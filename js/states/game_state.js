var GameState = (function () {

	var GameState = function(game) {
		this.lake = null;
		this.bottom_left_land = null;
		this.bottom_right_land = null;
		this.top_left_land = null;
		this.top_right_land = null;

	  Phaser.State.call(this, game);
	}

	GameState.prototype = Object.create(Phaser.State.prototype);
	GameState.prototype.constructor = GameState;

	GameState.prototype.preload = function () {
	};

	GameState.prototype.create = function () {
		this.createPlayers();
		this.createPlayingField();
	};

	GameState.prototype.createPlayers = function () {
		var _this = this;
		console.log('existing players', this.game.state.states['setupState'].players);
		_.each(this.game.state.states['setupState'].players, function (player) {
			console.log(player);
			_this.game.add.existing(player);
		});
	};

	GameState.prototype.createPlayingField = function () {
		this.lake = this.game.add.tileSprite(25, 25, this.game.world.width-50, this.game.world.height-50, 'lake');
		this.bottom_left_land = this.game.add.sprite(0, this.game.world.height-200, 'land-bottom-left');
		this.bottom_right_land = this.game.add.sprite(this.game.world.width-200, this.game.world.height-200, 'land-bottom-right');
		this.top_left_land = this.game.add.sprite(0, 0, 'land-top-left');
		this.top_right_land = this.game.add.sprite(this.game.world.width-200, 0, 'land-top-right');
		
	};

	return GameState;

}).call(this);
