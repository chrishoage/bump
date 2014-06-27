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
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.defaultRestitution = 5;
    this.game.physics.p2.applyGravity = false;

	  this.players = this.game.state.states['setupState'].players;
		this.createPlayingField();
		this.createPlayers();
	};

	GameState.prototype.createPlayers = function () {
		var _this = this;
		console.log('existing players', this.game.state.states['setupState'].players);
		_.each(this.players, function (player) {
			console.log(player);
			this.game.physics.p2.enable(player, true);
			player.body.collideWorldBounds = true;
			player.body.setCircle(32);

			player.smoothed = false;
			this.game.add.existing(player);
		}, this);
	};

	GameState.prototype.createPlayingField = function () {
		this.lake = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'lake');

		this.bottom_left_land = this.game.add.sprite(100, this.game.world.height-100, 'land-bottom-left');
		this.bottom_right_land = this.game.add.sprite(this.game.world.width-100, this.game.world.height-100, 'land-bottom-right');
		this.top_left_land = this.game.add.sprite(100, 100, 'land-top-left');
		this.top_right_land = this.game.add.sprite(this.game.world.width-100, 100, 'land-top-right');

		this.game.physics.p2.enable([this.bottom_left_land, this.bottom_right_land, this.top_left_land, this.top_right_land], false);

		this.bottom_left_land.body.clearShapes();
		this.bottom_left_land.body.loadPolygon('physicsData', 'land-bottom-left');
		this.bottom_right_land.body.clearShapes();
		this.bottom_right_land.body.loadPolygon('physicsData', 'land-bottom-right');
		this.top_left_land.body.clearShapes();
		this.top_left_land.body.loadPolygon('physicsData', 'land-top-left');
		this.top_right_land.body.clearShapes();
		this.top_right_land.body.loadPolygon('physicsData', 'land-top-right');

		this.top_right_land.body.motionState =
		this.top_left_land.body.motionState =
		this.bottom_right_land.body.motionState =
		this.bottom_left_land.body.motionState =
			Phaser.Physics.P2.Body.STATIC;
	};

	GameState.prototype.update = function () {
		_.each(this.players, function (player) {
			player.body.thrust(100);
			//this.game.physics.arcade.collide(player, this.players);
		}, this);

	};

	GameState.prototype.render = function () {
		if(this.players.length > 0) {
	  	this.game.debug.spriteInfo(this.players[0], 32, 32);
		}
	};

	return GameState;

}).call(this);
