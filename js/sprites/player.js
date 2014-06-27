var Player = (function () {

	var Player = function(game, x, y, asset, frame) {
		x = x || game.world.centerX;
		y = y || game.world.centerY;

	  Phaser.Sprite.call(this, game, x, y, asset, frame);

	  this.playerReady = false;

		this.movementSpeed = 50;


	}

	Player.prototype = Object.create(Phaser.Sprite.prototype);
	Player.prototype.constructor = Player;

	Player.prototype.setupConnection = function (connection) {
		var _this = this;
		this.peerConn = connection;
		this.peerConn.on('data', function (data) {
			if (data.type === 'click') {
				if (_this.playerReady) {
					_this.triggerPowerUp();
					// trigger player power
					console.log('power triggered', data)
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
		var accel = {
			x: data.orientation ? aig.x : aig.y,
			y: data.orientation ? aig.y : aig.x
		}
		var theta;

		/*this.body.velocity.x += (accel.x  / 10) * this.movementSpeed;
		this.body.velocity.y += (accel.y  / 10) * this.movementSpeed;*/

		var distance;

		//logic to calculate the tilt value of the accelerometer (0-10)
		distance = Math.sqrt(accel.x*accel.x + accel.y*accel.y);
		distance = distance * 10;
		var vel = this.body.velocity;
		var speed = Math.sqrt(vel.x*vel.x + vel.y*vel.y);

		var rotationRate = 15;
		//logic to calculate the angle from accelerometer data
		var rotating = (Math.abs(accel.x) > 5);
		if(accel.x>0 && accel.y>0) {
		  this.body.reverse(distance);
		  if(rotating) this.body.rotateRight(rotationRate)
		}else if(accel.x<0 && accel.y>0) {
		  if(rotating) this.body.rotateLeft(rotationRate)
		  this.body.reverse(distance);
		}else if(accel.x<0 && accel.y<0) {
		  if(rotating) this.body.rotateLeft(rotationRate)
		  this.body.thrust(distance)
		}else if(accel.x>0 && accel.y<0) {
		   if(rotating) this.body.rotateRight(rotationRate)
		   this.body.thrust(distance)
		}
		// if ((this.body.rotation - theta) > 0) {
		// 	this.body.rotateLeft(100)
		// } else {
		// 	this.body.rotateRight(100)
		// }
		//this.body.rotation = theta;
		//this.body.thrust(distance*10);

	};

	Player.prototype.triggerPowerUp = function () {
		// sub for Players
		this.playerPowerUp = true;
		this.game.time.events.add(Phaser.Timer.SECOND * 4, function() {

		}, this);
	};

	return Player;

}).call(this);
