var Player = (function () {

	var Player = function(game, x, y, asset, frame) {
		x = x || game.world.centerX;
		y = y || game.world.centerY;

	  Phaser.Sprite.call(this, game, x, y, asset+'-sprite', frame);

	  this.animations.add('kick',[0,1,2],6,true);
	  this.play('kick')
	  this.playerReady = false;

		this.movementSpeed = 10;
		this.rotationRate = 15;

		this.playerPowerUpActive = false;
		this.playerPowerUpCooldown = false;
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
				}
			} else if (data.type === 'start') {
					_this.playerReady = true;
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
		/*this.body.velocity.x += (accel.x  / 10) * this.movementSpeed;
		this.body.velocity.y += (accel.y  / 10) * this.movementSpeed;*/

		//logic to calculate the tilt value of the accelerometer (0-10)
		var distance = Math.sqrt(accel.x*accel.x + accel.y*accel.y) * this.movementSpeed;


		var vel = this.body.velocity;
		var speed = Math.sqrt(vel.x*vel.x + vel.y*vel.y);

		//logic to calculate the angle from accelerometer data
		var rotating = (Math.abs(accel.x) > 5);
		if(accel.x>0 && accel.y>0) {
		  this.body.reverse(distance);
		  if(rotating) this.body.rotateRight(this.rotationRate)
		}else if(accel.x<0 && accel.y>0) {
		  if(rotating) this.body.rotateLeft(this.rotationRate)
		  this.body.reverse(distance);
		}else if(accel.x<0 && accel.y<0) {
		  if(rotating) this.body.rotateLeft(this.rotationRate)
		  this.body.thrust(distance)
		}else if(accel.x>0 && accel.y<0) {
		   if(rotating) this.body.rotateRight(this.rotationRate)
		   this.body.thrust(distance)
		}

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
			this.game.time.events.add(Phaser.Timer.SECOND * 15, function() {
				this.playerPowerUpActive = false;
				this.playerPowerUpCooldown = false;
				console.log('cool down over');
			}, this);
		}, this);

	};

	return Player;

}).call(this);
