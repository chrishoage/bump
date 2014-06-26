var Player = (function () {

	var Player = function(game, x, y, asset, frame) {
		x = x || game.world.centerX;
		y = y || game.world.centerY;
	  Phaser.Sprite.call(this, game, x, y, asset, frame);

	  this.playerReady = false;
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
			}
		});
	});

	return Player;

}).call(this);
