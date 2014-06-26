var GameState = (function () {

	var GameState = function(game, x, y, asset, frame) {
	  Phaser.State.call(this, game);
	}

	GameState.prototype = Object.create(Phaser.State.prototype);
	GameState.prototype.constructor = GameState;

	GameState.prototype.preload = function () {
	};

	GameState.prototype.create = function () {
		var player = new PlayerOne(this.game);

		this.game.physics.enable(player, Phaser.Physics.ARCADE);
		player.body.maxVelocity.setTo(100, 100); // x, y


		game.add.existing(player);
		console.log(player);
		peer.on('connection', function (conn) {
			console.log('connection', conn);
			player.x = (game.width / 2) - (player.width / 2);
			player.y = (game.height / 2) - (player.height / 2);
			//player.body.acceleration.x = 0;
			//player.body.acceleration.y = 0;
			$('#qr-modal').modal('hide');
			conn.on('data', function (data) {
				var movementSpeed = 25;
				var aig = data.accelerationIncludingGravity;
				var delta = {
					x: data.orientation ? aig.x : aig.y,
					y: data.orientation ? aig.y : aig.x
				}

				player.body.velocity.x += (delta.x  / 10) * movementSpeed;
				player.body.velocity.y += (delta.y  / 10) * movementSpeed;

				//player.body.acceleration.x = Math.abs(delta.x) > 0 ? 25 : 0;
				//player.body.acceleration.y = Math.abs(delta.y) > 0 ? 25 : 0;

				if (player.x < -player.width/2) {
				  player.x = -player.width/2;
				}

				if (player.x > game.width - player.width/2) {
				  player.x = game.width - player.width/2;
				}

				if (player.y < -player.height/2) {
				  player.y = -player.height/2;
				}

				if (player.y > game.height - player.height/2) {
				  player.y = game.height - player.height/2;
				}
			});
		});

	}

	return GameState;

}).call(this);
