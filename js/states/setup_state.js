var SetupState = (function () {

	var SetupState = function(game, x, y, asset, frame) {
	  Phaser.State.call(this, game);
	}

	SetupState.prototype = Object.create(Phaser.State.prototype);
	SetupState.prototype.constructor = SetupState;

	SetupState.prototype.preload = function () {
		   var dataURI = qr.toDataURL('http://' + location.host + '/controller.html#' + peer.id);
		   var data = new Image();
        data.src = dataURI;
        this.game.cache.addImage('qr-code', dataURI, data);
	};

	SetupState.prototype.create = function () {
    var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
    var t = this.game.add.text(this.game.world.centerX-300, 0, 'Bump!', style);
    this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'qr-code');
    var _this = this;
    peer.on('connection', function (conn) {
    	var player = new PlayerOne(_this.game, _this.game.world.centerX, 256*window.players.length);
    	player.peerConn = conn;
    	window.players.push(player);
    	_this.game.add.existing(player);

    });

	}

	return SetupState;

}).call(this);
