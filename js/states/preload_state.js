var PreloadState = (function () {
	var PreloadState = function(game, x, y, asset, frame) {
	  Phaser.State.call(this, game);
	}

	PreloadState.prototype = Object.create(Phaser.State.prototype);
	PreloadState.prototype.constructor = PreloadState;

	PreloadState.prototype.preload = function () {
		console.log("preloading assets");

    // used to randomize sides used
    this.numberLandSides = 1;

		this.loaderEmpty = this.game.add.sprite(this.game.world.centerX, 200, 'loaderEmpty');
    this.preloadBar = this.game.add.sprite(this.loaderEmpty.x - this.loaderEmpty.width/2, 200, 'loaderFull');
    this.loaderEmpty.anchor.setTo(0.5, 0);
    this.game.load.setPreloadSprite(this.preloadBar);

    // load assets
		this.game.load.image('player1', 'assets/images/player1.png');
		this.game.load.image('player2', 'assets/images/player2.png');
		this.game.load.image('player3', 'assets/images/player3.png');
		this.game.load.image('player4', 'assets/images/player4.png');
		this.game.load.image('player', 'assets/images/circle.png');
    this.game.load.image('lake', 'assets/images/water.gif');
    this.game.load.image('land-bottom-left', 'assets/images/land/bottom-left.png');
    this.game.load.image('land-bottom-right', 'assets/images/land/bottom-right.png');
    this.game.load.image('land-top-left', 'assets/images/land/top-left.png');
    this.game.load.image('land-top-right', 'assets/images/land/top-right.png');
    this.game.load.image('land-side', 'assets/images/land/side.png');

    this.game.load.image('cool-down-empty', 'assets/images/cool-down-empty.png');
    this.game.load.image('cool-down-green', 'assets/images/cool-down-green.png');
    this.game.load.image('cool-down-red', 'assets/images/cool-down-red.png');
    this.game.load.image('cool-down-yellow', 'assets/images/cool-down-yellow.png');

    this.game.load.physics('physicsData', 'assets/json/sprites.json');

		this.game.stage.setBackgroundColor("#1192bd");
	};

	PreloadState.prototype.create = function () {
		this.createTopLogo();

		// move to next state
		this.game.state.start("setupState");
	};
	PreloadState.prototype.createTopLogo = function() {
		var text = null;
		var textReflect = null;

		text = this.game.add.text(this.game.world.centerX, this.game.world.centerY/3, "BUMP");

	    //  Centers the text
	    text.anchor.set(0.5);
	    text.align = 'center';

	    //  Our font + size
	    text.font = 'Arial';
	    text.fontWeight = 'bold';
	    text.fontSize = 70;
	    text.fill = '#ffffff';

	    //  Here we create our fake reflection :)
	    //  It's just another Text object, with an alpha gradient and flipped vertically

	    textReflect = this.game.add.text(this.game.world.centerX, this.game.world.centerY/3 + 50, "BUMP");

	    //  Centers the text
	    textReflect.anchor.set(0.5);
	    textReflect.align = 'center';
	    textReflect.scale.y = -1;

	    //  Our font + size
	    textReflect.font = 'Arial';
	    textReflect.fontWeight = 'bold';
	    textReflect.fontSize = 70;

	    //  Here we create a linear gradient on the Text context.
	    //  This uses the exact same method of creating a gradient as you do on a normal Canvas context.
	    var grd = textReflect.context.createLinearGradient(0, 0, 0, text.canvas.height);

	    //  Add in 2 color stops
	    grd.addColorStop(0, 'rgba(255,255,255,0)');
	    grd.addColorStop(1, 'rgba(255,255,255,0.08)');

	    //  And apply to the Text
	    textReflect.fill = grd;
	};

	return PreloadState;

}).call(this);
