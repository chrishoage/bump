var Player = (function () {

	var Player = function(game, x, y, asset, frame) {
		x = x || game.world.centerX;
		y = y || game.world.centerY;

	  Phaser.Sprite.call(this, game, x, y, asset, frame);

	  this.playerReady = false;

		this.movementSpeed = 25;

		this.game.physics.p2.enable(this);

	}

	Player.prototype = Object.create(Phaser.Sprite.prototype);
	Player.prototype.constructor = Player;

	Player.prototype.setupConnection = function (connection) {
		var _this = this;
		this.peerConn = connection;
		this.peerConn.on('data', function (data) {
			if (data.type === 'click') {
				if (_this.playerReady) {
					// trigger player power
				} else {
					_this.playerReady = true;
				}
			} else if (data.type === 'devicemotion') {
				// device motion stuff here
				_this.movePlayer(data);
			}
		});
	};

	Player.prototype.movePlayer = function (data) {
		var aig = data.accelerationIncludingGravity;
		var delta = {
			x: data.orientation ? aig.x : aig.y,
			y: data.orientation ? aig.y : aig.x
		}


		this.body.velocity.x += (delta.x  / 10) * this.movementSpeed;
		this.body.velocity.y += (delta.y  / 10) * this.movementSpeed;

		if (this.x < -this.width/2) {
		  this.x = -this.width/2;
		}

		if (this.x > this.game.width - this.width/2) {
		  this.x = this.game.width - this.width/2;
		}

		if (this.y < -this.height/2) {
		  this.y = -this.height/2;
		}

		if (this.y > this.game.height - this.height/2) {
		  this.y = this.game.height - this.height/2;
		}

	};

	return Player;

}).call(this);
