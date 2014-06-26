var GameState = (function () {

	var GameState = function(game, x, y, asset, frame) {
	  Phaser.State.call(this, game);
	}

	GameState.prototype = Object.create(Phaser.State.prototype);
	GameState.prototype.constructor = GameState;

	GameState.prototype.preload = function () {
		game.load.image('player', 'assets/images/circle.png');
	};

	GameState.prototype.create = function () {
		var player = new Player(this.game, 256, 256, 'player');
		game.add.existing(player);
		console.log(player);
		peer.on('connection', function (conn) {
			console.log('connection', conn);
			player.x = (game.width / 2) - (player.width / 2);
			player.y = (game.height / 2) - (player.height / 2);
			$('#qr-modal').modal('hide');
			conn.on('data', function (data) {
				var movementSpeed = 5;
				var aig = data.accelerationIncludingGravity;
				var delta = {
					x: data.orientation ? aig.x : aig.y,
					y: data.orientation ? aig.y : aig.x
				}

				player.x += (delta.x  / 10) * movementSpeed;
				player.y += (delta.y  / 10) * movementSpeed;

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

				console.log(data);
			});
		});

	}

	return GameState;

}).call(this);
