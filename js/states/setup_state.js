var SetupState = (function () {

	var SetupState = function(game, x, y, asset, frame) {
    this.players = [];

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

    this.game.add.sprite(100, 10, 'qr-code');
    var _this = this;
    peer.on('connection', function (conn) {
    	var player = new PlayerOne(_this.game, 256*window.players.length, _this.game.world.centerY);
<<<<<<< HEAD
    	player.setupConnection(conn);
    	window.players.push(player);
=======
    	player.peerConn = conn;
    	_this.players.push(player);
>>>>>>> e75a158bda0fb346b1948f8f8883bd02b3bebce7
    	_this.game.add.existing(player);
    });

	}

	return SetupState;

}).call(this);
