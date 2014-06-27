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
    this.game.physics.p2.defaultRestitution = 0.8;
    this.game.physics.p2.applyGravity = false;

	  this.players = this.game.state.states['setupState'].players;
		this.createPlayingField();
		this.createPlayers();
		this.createLives();
	};

	GameState.prototype.createPlayers = function () {
		var _this = this;
		console.log('existing players', this.game.state.states['setupState'].players);
		_.each(this.players, function (player) {
			console.log(player);
			this.game.physics.p2.enable(player);
			player.body.collideWorldBounds = true;
			player.body.setCircle(32);

			player.smoothed = false;
			this.game.add.existing(player);
		}, this);
	};

	GameState.prototype.createLives = function () {
		this.lives = this.game.add.group();
		_.each(this.players, function (player, p) {
			for (var i = 0; i < 3; i++) {
				var tube = this.lives.create(this.game.world.width - 100 + (30 * i) - (125 * p), 20, player.name+'-life');
			};
			console.log(player.name+'-life', tube);
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
		this.bottom_left_land.body.loadPolygon('physicsDataCorners', 'land-bottom-left');
		this.bottom_right_land.body.clearShapes();
		this.bottom_right_land.body.loadPolygon('physicsDataCorners', 'land-bottom-right');
		this.top_left_land.body.clearShapes();
		this.top_left_land.body.loadPolygon('physicsDataCorners', 'land-top-left');
		this.top_right_land.body.clearShapes();
		this.top_right_land.body.loadPolygon('physicsDataCorners', 'land-top-right');

		this.top_right_land.body.motionState = 
		this.top_left_land.body.motionState = 
		this.bottom_right_land.body.motionState = 
		this.bottom_left_land.body.motionState = Phaser.Physics.P2.Body.STATIC;

		var starting_x = 300;
		var starting_y = 100;

		// fill in top side
		var newSprite = null;
		for(var i=0; i < 4; i++) {
			var randomSide = this.game.rnd.integerInRange(1, this.game.state.states['preloadState'].numberLandSides);

			newSprite = this.game.add.sprite(starting_x, starting_y, 'land-side-' + randomSide);
			this.game.physics.p2.enable([newSprite]);
			newSprite.body.clearShapes();
			newSprite.body.loadPolygon('physicsDataSides', 'land-side-' + randomSide);
			newSprite.body.motionState = Phaser.Physics.P2.Body.STATIC;
			newSprite.body.angle = 90;

			// scoot
			starting_x += 200;
		}

		newSprite = this.game.add.sprite(starting_x-60, starting_y, 'land-filler-side-v');
		this.game.physics.p2.enable([newSprite]);
		newSprite.body.clearShapes();
		newSprite.body.loadPolygon('physicsDataSides', 'land-filler-side-v');
		newSprite.body.motionState = Phaser.Physics.P2.Body.STATIC;
		newSprite.body.angle = 90;

		starting_x = 300;
		starting_y = 620;

		// fill in bottom side
		for(var i=0; i < 4; i++) {
			var randomSide = this.game.rnd.integerInRange(1, this.game.state.states['preloadState'].numberLandSides);

			newSprite = this.game.add.sprite(starting_x, starting_y, 'land-side-' + randomSide);
			this.game.physics.p2.enable([newSprite]);
			newSprite.body.clearShapes();
			newSprite.body.loadPolygon('physicsDataSides', 'land-side-' + randomSide);
			newSprite.body.motionState = Phaser.Physics.P2.Body.STATIC;
			newSprite.body.angle = 270;

			// scoot
			starting_x += 200;
		}

		newSprite = this.game.add.sprite(starting_x-60, starting_y, 'land-filler-side-v');
		this.game.physics.p2.enable([newSprite]);
		newSprite.body.clearShapes();
		newSprite.body.loadPolygon('physicsDataSides', 'land-filler-side-v');
		newSprite.body.motionState = Phaser.Physics.P2.Body.STATIC;
		newSprite.body.angle = 270;

		starting_x = 100;
		starting_y = 300;

		// fill in left side
		for(var i=0; i < 1; i++) {
			var randomSide = this.game.rnd.integerInRange(1, this.game.state.states['preloadState'].numberLandSides);

			newSprite = this.game.add.sprite(starting_x, starting_y, 'land-side-' + randomSide);
			this.game.physics.p2.enable([newSprite]);
			newSprite.body.clearShapes();
			newSprite.body.loadPolygon('physicsDataSides', 'land-side-' + randomSide);
			newSprite.body.motionState = Phaser.Physics.P2.Body.STATIC;

			// scoot
			starting_y += 200;
		}

		newSprite = this.game.add.sprite(starting_x, starting_y-40, 'land-filler-side-h');
		this.game.physics.p2.enable([newSprite]);
		newSprite.body.clearShapes();
		newSprite.body.loadPolygon('physicsDataSides', 'land-filler-side-h');
		newSprite.body.motionState = Phaser.Physics.P2.Body.STATIC;

		starting_x = 1180;
		starting_y = 300;

		// fill in right side
		for(var i=0; i < 1; i++) {
			var randomSide = this.game.rnd.integerInRange(1, this.game.state.states['preloadState'].numberLandSides);

			newSprite = this.game.add.sprite(starting_x, starting_y, 'land-side-' + randomSide);
			this.game.physics.p2.enable([newSprite]);
			newSprite.body.clearShapes();
			newSprite.body.loadPolygon('physicsDataSides', 'land-side-' + randomSide);
			newSprite.body.motionState = Phaser.Physics.P2.Body.STATIC;
			newSprite.body.angle = 180;

			// scoot
			starting_y += 200;
		}

		newSprite = this.game.add.sprite(starting_x, starting_y-40, 'land-filler-side-h');
		this.game.physics.p2.enable([newSprite]);
		newSprite.body.clearShapes();
		newSprite.body.loadPolygon('physicsDataSides', 'land-filler-side-h');
		newSprite.body.motionState = Phaser.Physics.P2.Body.STATIC;
		newSprite.body.angle = 180;
	};

	GameState.prototype.update = function () {
		this.lake.tilePosition.x += 0.25;
  	this.lake.tilePosition.y += 0.25;
	};

	return GameState;

}).call(this);
