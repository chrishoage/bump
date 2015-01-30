'use strict';

var Phaser = require('phaser');
var _      = require('lodash');
var Lake = require('../sprites/lake');

function GameState (game) {
	// describes the safe zone for teleportion and respawning
	this.safeRectangle = new Phaser.Rectangle(160, 160, 960, 390);

	this.bottom_left_land = null;
	this.bottom_right_land = null;
	this.top_left_land = null;
	this.top_right_land = null;
	this.landElements = [];

	this.gameOver = false;

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

  this.players = _.clone(this.game.state.states['setupState'].players);
	this.createPlayingField();
	this.createPlayers();
	this.establishCollisionGroup();
};

GameState.prototype.createPlayers = function () {
	var _this = this;
	//console.log('existing players', this.players, this.game.state.states['setupState'].players, this.game, this.players[0].game, this.game.state.states['setupState'].players[0].game);
	console.log('existing player', this.players);
	_.each(this.players, function (player, i) {
		console.log(player, player.game);
		this.game.physics.p2.enable(player);
		player.body.collideWorldBounds = true;
		player.body.setCircle(32);
		player.smoothed = false;
		player.createLives();
		player.createCooldownBar();
		this.game.add.existing(player);
	}, this);
};


GameState.prototype.createPlayingField = function () {
	this.game.add.existing(new Lake(this.game));


	this.bottom_left_land = this.game.add.sprite(100, this.game.world.height-100, 'land-bottom-left');
	this.landElements.push(this.bottom_left_land);
	this.bottom_right_land = this.game.add.sprite(this.game.world.width-100, this.game.world.height-100, 'land-bottom-right');
	this.landElements.push(this.bottom_right_land);
	this.top_left_land = this.game.add.sprite(100, 100, 'land-top-left');
	this.landElements.push(this.top_left_land);
	this.top_right_land = this.game.add.sprite(this.game.world.width-100, 100, 'land-top-right');
	this.landElements.push(this.top_right_land);

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
		this.landElements.push(newSprite);

		// scoot
		starting_x += 200;
	}

	newSprite = this.game.add.sprite(starting_x-60, starting_y, 'land-filler-side-v');
	this.game.physics.p2.enable([newSprite]);
	newSprite.body.clearShapes();
	newSprite.body.loadPolygon('physicsDataSides', 'land-filler-side-v');
	newSprite.body.motionState = Phaser.Physics.P2.Body.STATIC;
	newSprite.body.angle = 90;
	this.landElements.push(newSprite);

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
		this.landElements.push(newSprite);

		// scoot
		starting_x += 200;
	}

	newSprite = this.game.add.sprite(starting_x-60, starting_y, 'land-filler-side-v');
	this.game.physics.p2.enable([newSprite]);
	newSprite.body.clearShapes();
	newSprite.body.loadPolygon('physicsDataSides', 'land-filler-side-v');
	newSprite.body.motionState = Phaser.Physics.P2.Body.STATIC;
	newSprite.body.angle = 270;
	this.landElements.push(newSprite);

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
		this.landElements.push(newSprite);

		// scoot
		starting_y += 200;
	}

	newSprite = this.game.add.sprite(starting_x, starting_y-40, 'land-filler-side-h');
	this.game.physics.p2.enable([newSprite]);
	newSprite.body.clearShapes();
	newSprite.body.loadPolygon('physicsDataSides', 'land-filler-side-h');
	newSprite.body.motionState = Phaser.Physics.P2.Body.STATIC;
	this.landElements.push(newSprite);

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
		this.landElements.push(newSprite);

		// scoot
		starting_y += 200;
	}

	newSprite = this.game.add.sprite(starting_x, starting_y-40, 'land-filler-side-h');
	this.game.physics.p2.enable([newSprite]);
	newSprite.body.clearShapes();
	newSprite.body.loadPolygon('physicsDataSides', 'land-filler-side-h');
	newSprite.body.motionState = Phaser.Physics.P2.Body.STATIC;
	newSprite.body.angle = 180;
	this.landElements.push(newSprite);
};

GameState.prototype.establishCollisionGroup = function () {
	var _this = this;

	_.each(this.landElements, function(landElement) {
		_.each(_this.players, function(player) {
			player.body.createBodyCallback(landElement, _this.playerHitsLand);
		});
	});

	this.game.physics.p2.setImpactEvents(true);
};

GameState.prototype.playerHitsLand = function (player, land) {
	console.log("player hit land", player);
	var _this = player.game.state.states['gameState'];
	if (player.sprite.isDead || _this.gameOver) return;
	player.sprite.loseLife(function () {
		// determine if game over
		var winner = _.where(_this.players, {'isDead': false});
		if (winner.length <= 1) {
	  	_this.gameOver = true;
			console.log('gameover');
			var gameover = player.game.add.sprite(player.game.world.centerX-10,  player.game.world.centerY-10, 'game-over');
  	  gameover.anchor.set(0.5);
  	  if(winner.length == 1) {
  	  	_this.game.add.tween(winner[0].scale).to({ x: 2, y: 2}, 500, Phaser.Easing.Back.Out, true, 0, false, false)
  	  	_this.game.world.bringToTop(winner[0]);
  	  	setTimeout(function() {
  	  		_.each(_this.players, function (player, i) {
  	  			player.playerReady = false;

  	  		});
  	  		_this.gameOver = false;
  	  		console.log('restart game');
  	  		_this.game.state.start("setupState", false, false);
  	  	}, 3000)
  	  }

  	  player.game.add.tween(gameover).from({y:-600},1000,Phaser.Easing.Bounce.Out,true, 100, false, false);

		}
	});

};


module.exports = GameState;
