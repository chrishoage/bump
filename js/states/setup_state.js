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
    var smallStyle = { font: "35px Arial", fill: "#ff0044", align: "left" };

    var t = this.game.add.text(0, 0, 'Bump!', style);
    var t = this.game.add.text(0, 100, 'Use the QR Code to connect\nyour phone to use as a controller.\nRemember to lock your device orentation!', smallStyle);

    this.game.add.sprite(this.game.world.width-100, 10, 'qr-code');
    var _this = this;
    peer.on('connection', function (conn) {
    	var player = new PlayerOne(_this.game, 256*window.players.length, _this.game.world.centerY);
    	player.peerConn = conn;
    	window.players.push(player);
    	_this.game.add.existing(player);

    });

	}

	return SetupState;

}).call(this);
