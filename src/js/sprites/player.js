'use strict';

var Phaser = require('phaser');

function Player (game, x, y, asset, frame) {
	x = x || game.world.centerX;
	y = y || game.world.centerY;
  Phaser.Sprite.call(this, game, x, y, asset+'-sprite', frame);
	this.name = asset;
	console.log('Player Constructor Called', this.name, game)
  this.animations.add('kick',[0,1,2],6,true);
  this.play('kick')
  this.playerReady = false;

	this.movementSpeed = 10;
	this.rotationRate = 15;

	this.cooldownTimeLeft = 15;
	this.lives = 3;
	this.isDead = false;

	this.playerPowerUpActive = false;
	this.playerPowerUpCooldown = false;
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.setupConnection = function (connection) {
	var _this = this;
	this.peerConn = connection;
	this.peerConn.player = this;
	this.peerConn.on('data', function (data) {

		if (data.type === 'powerup') {
			if (_this.playerReady) {
				_this.triggerPowerUp();
				// trigger player power
			}
		} else if (data.type === 'start') {
				_this.playerReady = true;
		} else {
			// device motion stuff here
			_this.movePlayer(data);
		}
	});
};

Player.prototype.movePlayer = function (data) {
	if (!this.body) return;

	if (data.type === 'rotate-left') {
		this.body.rotateLeft(this.rotationRate);
	} else if (data.type === 'rotate-right') {
		this.body.rotateRight(this.rotationRate);
	} else if (data.type === 'devicemotion') {
		//logic to calculate the tilt value of the accelerometer (0-10)
		var aig = data.accelerationIncludingGravity;
		var distance = Math.sqrt(aig.x*aig.x + aig.y*aig.y) * this.movementSpeed;
		if (aig.x > 0) {
			this.body.reverse(distance);
		} else {
			this.body.thrust(distance);
		}
	}

	//console.log('movePlayer', aig);

};

Player.prototype.triggerPowerUp = function () {
	// sub for Players
	if (this.playerPowerUpCooldown) return;
	this.playerPowerUpActive = true;
	console.log('power up triggered')
	this.game.time.events.add(Phaser.Timer.SECOND * 4, function() {
		console.log('power up over')
		this.playerPowerUpActive = false;
		this.playerPowerUpCooldown = true;
		console.log('cool down started')
		var s = 10;
		this.game.time.events.repeat(Phaser.Timer.SECOND, 15, function () {
			this.cooldownTimeLeft--;
		}, this);
		this.game.time.events.add(Phaser.Timer.SECOND * 15, function() {
			this.playerPowerUpActive = false;
			this.playerPowerUpCooldown = false;
			this.cooldownTimeLeft = 15;
			console.log('cool down over');
		}, this);
	}, this);

};

Player.prototype.createCooldownBar = function (size) {
	var posX = this.game.world.width - 100 - (125 * this.playerIndex);
	size = size || 80;
	this.bar = this.game.add.graphics(0,0);
	this.bar.beginFill(this.barColor, 1);
	this.bar.lineStyle(1, 0x000000, 1);
	this.bar.drawRect(posX, 50, size, 10)
	this.game.world.bringToTop(this.bar);
}

Player.prototype.createLives = function () {
	this.livesGroup = this.game.add.group();
	for (var i = 0; i < 3; i++) {
		console.log(this.playerIndex);
		var tube = this.livesGroup.create(this.game.world.width - 100 + (30 * i) - (125 * this.playerIndex), 20, this.name+'-life');
	};
	console.log(this.livesGroup);
};

Player.prototype.update = function () {
	this.bar.clear();
	if (this.lives > 0) {
		var size = 80 * (this.cooldownTimeLeft / 15);
		this.createCooldownBar(size);
	}
}

Player.prototype.loseLife = function (cb) {
	this.livesGroup.children[--this.lives].destroy();
	this.isDead = true;

	if(this.lives <= 0) {
		this.kill();
		if (cb) cb();
	} else {
		this.body.rotateRight(500);
		var scaleDown = this.game.add.tween(this.scale).to({x: 0, y: 0}, 500, Phaser.Easing.Back.Out, true, 0, false, false)
		scaleDown.onComplete.add(function () {
			// respawn
			this.scale.x = this.scale.y = 1;
			this.respawn();
			if (cb) cb();
		}, this);
	}
};

Player.prototype.respawn = function () {
	this.isDead = false;
	this.body.setZeroRotation();
	this.body.setZeroVelocity();
	var saferect = this.game.state.states["gameState"].safeRectangle;
	this.body.x = this.game.rnd.integerInRange(saferect.left, saferect.right);
	this.body.y = this.game.rnd.integerInRange(saferect.top, saferect.bottom);
};

module.exports = Player;
