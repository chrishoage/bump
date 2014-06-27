var Player = (function () {

	var Player = function(game, x, y, asset, frame) {
		x = x || game.world.centerX;
		y = y || game.world.centerY;

	  Phaser.Sprite.call(this, game, x, y, asset, frame);

	  this.playerReady = false;

		this.movementSpeed = 250;


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

		//logic to calculate the angle from accelerometer data
		if(accel.x>0 && accel.y>0) {
            theta = Math.atan(accel.y/accel.x);
        }else if(accel.x<0 && accel.y>0) {
            theta = 1.57079633 - Math.atan(accel.x/accel.y);
        }else if(accel.x<0 && accel.y<0) {
            theta = 3.14159266 + Math.atan(accel.y/accel.x);
        }else if(accel.x>0 && accel.y<0) {
            theta = 4.71238899 - Math.atan(accel.x/accel.y);
        }
        
		console.log(theta);
		this.body.rotation = theta;
		this.body.thrust(distance*10);
		
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

	Player.prototype.triggerPowerUp = function () {
		// sub for Players
		this.playerPowerUp = true;
		this.game.time.events.add(Phaser.Timer.SECOND * 4, function() {

		}, this);
	};

	return Player;

}).call(this);
