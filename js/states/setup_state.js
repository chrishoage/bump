var SetupState = (function () {

	var SetupState = function(game, x, y, asset, frame) {
    this.players = [];

	  Phaser.State.call(this, game);
	}

	SetupState.prototype = Object.create(Phaser.State.prototype);
	SetupState.prototype.constructor = SetupState;

	SetupState.prototype.preload = function () {
			var dataURI = qr.toDataURL({
			     value:'http://' + location.host + '/controller.html#' + peer.id,
			      size:100
			    });
			var data = new Image();
			data.src = dataURI;
			this.game.cache.addImage('qr-code', dataURI, data);
			this.game.load.image('bump-title', 'assets/images/qr_image_host.png');
	};

	SetupState.prototype.create = function () {

		var playerImages = ['player1', 'player2', 'player3', 'player4'];
		var playerObjects = [PlayerOne, PlayerTwo, PlayerThree, PlayerFour];

    var style = { font: "65px Arial", fill: "#cf2127", align: "center" };
    var smallStyle = { font: "20px Arial", fill: "#fff", align: "center" };

    var t = this.game.add.text(180, this.game.world.height-50, 'Use the QR Code to connect your phone to use as a controller, remember to lock your device orientation!', smallStyle);
        t.alpha = 0;
        this.game.add.tween(t).to({alpha:1},1500, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE, true);

		var qrHost = this.game.add.sprite(this.game.world.centerX-10,  this.game.world.centerY-50, 'bump-title');
    qrHost.anchor.set(0.5);

    this.game.add.tween(qrHost).from({y:-600},1000,Phaser.Easing.Bounce.Out,true, 100, false, false);
    var qrSpritePosX, qrSpritePosY, qrSpriteWidth, qrSpriteHeight;
    if (this.game.device.windows) {
    	qrSpritePosX = this.game.world.centerX - 43;
    	qrSpritePosY = 417;
    	qrSpriteWidth = 87;
    	qrSpriteHeight = 87;

    } else {
    	qrSpritePosX = this.game.world.centerX - 50;
    	qrSpritePosY = 412;
    	qrSpriteWidth = 100;
    	qrSpriteHeight = 100;
    }
    var qrSprite = this.game.add.sprite(qrSpritePosX, qrSpritePosY, 'qr-code');
    qrSprite.crop(new Phaser.Rectangle(0,0,qrSpriteWidth,qrSpriteHeight));
    qrSprite.alpha=0;
    this.game.add.tween(qrSprite).to({alpha:1}, 2000, Phaser.Easing.Linear.None,true, 1800, false, false);

    var _this = this;
    peer.on('connection', function (conn) {
    	var PlayerObject = playerObjects.shift();
    	var player = new PlayerObject(_this.game, 256*_this.players.length, _this.game.world.centerY);
    	console.log(player);
    	player.setupConnection(conn);
    	_this.players.push(player);
    	_this.game.add.sprite(50, 120+120*_this.players.length, playerImages.shift());



    });

	}

	SetupState.prototype.update = function () {
		if (this.players.length && _.every(this.players, 'playerReady')) {
			this.game.state.start("gameState");
		}
	};

	return SetupState;

}).call(this);
