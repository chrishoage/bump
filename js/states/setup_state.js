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

    var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
    var smallStyle = { font: "35px Arial", fill: "#ff0044", align: "left" };

    var t = this.game.add.text(0, 0, 'Bump!', style);
    var t = this.game.add.text(0, 100, 'Use the QR Code to connect\nyour phone to use as a controller.\nRemember to lock your device orientation!', smallStyle);
qrHost = this.game.add.sprite(this.game.world.centerX-10,  this.game.world.centerY-50, 'bump-title');
       qrHost.anchor.set(0.5);      this.game.add.tween(qrHost).from({y:-600},1500,Phaser.Easing.Bounce.Out,true, 100, false, false);
        
    var qrSprite = this.game.add.sprite(this.game.world.centerX-43, 417, 'qr-code');
        qrSprite.crop(new Phaser.Rectangle(0,0,87,87));                      
        qrSprite.alpha(0);
    this.game.add.tween(qrSprite).to({alpha:1}, 1000, Phaser.Easing.Linear.None, 1600, false, false);
        
    var _this = this;
    var qrHost;
    peer.on('connection', function (conn) {
    	var player = new PlayerOne(_this.game, 256*_this.players.length, _this.game.world.centerY);
    	console.log(player);
    	player.setupConnection(conn);
    	_this.players.push(player);
    	_this.game.add.sprite(256*_this.players.length, _this.game.world.centerY, 'player');
        
        
                                    
    });

	}

	SetupState.prototype.update = function () {
		if (this.players.length && _.every(this.players, 'playerReady')) {
			this.game.state.start("gameState");
		}
	};

	return SetupState;

}).call(this);
