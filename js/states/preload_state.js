var PreloadState = (function () {
	var PreloadState = function(game, x, y, asset, frame) {
	  Phaser.State.call(this, game);
	}

	PreloadState.prototype = Object.create(Phaser.State.prototype);
	PreloadState.prototype.constructor = PreloadState;

	PreloadState.prototype.preload = function () {
		console.log("preloading assets");

    // used to randomize sides used
    this.numberLandSides = 8;

		this.loaderEmpty = this.game.add.sprite(this.game.world.centerX, 200, 'loaderEmpty');
    this.preloadBar = this.game.add.sprite(this.loaderEmpty.x - this.loaderEmpty.width/2, 200, 'loaderFull');
    this.loaderEmpty.anchor.setTo(0.5, 0);
    this.game.load.setPreloadSprite(this.preloadBar);

    // load assets
    this.game.load.image('bump-title', 'assets/images/qr_image_host.png');
    this.game.load.image('game-over', 'assets/images/game-over.png');
		this.game.load.image('player1', 'assets/images/player1.png');
		this.game.load.image('player2', 'assets/images/player2.png');
		this.game.load.image('player3', 'assets/images/player3.png');
		this.game.load.image('player4', 'assets/images/player4.png');
		this.game.load.spritesheet('player1-sprite', 'assets/images/sprite-player1.png', 80, 65, 3);
		this.game.load.spritesheet('player2-sprite', 'assets/images/sprite-player2.png', 80, 65, 3);
		this.game.load.spritesheet('player3-sprite', 'assets/images/sprite-player3.png', 80, 65, 3);
		this.game.load.spritesheet('player4-sprite', 'assets/images/sprite-player4.png', 80, 65, 3);
		this.game.load.image('player1-life', 'assets/images/life-player1.png');
		this.game.load.image('player2-life', 'assets/images/life-player2.png');
		this.game.load.image('player3-life', 'assets/images/life-player3.png');
		this.game.load.image('player4-life', 'assets/images/life-player4.png');
		this.game.load.image('bg-cooldown', 'assets/images/cooldown-empty.png');
		this.game.load.image('player1-cooldown', 'assets/images/cooldown-player1.png');
		this.game.load.image('player2-cooldown', 'assets/images/cooldown-player2.png');
		this.game.load.image('player3-cooldown', 'assets/images/cooldown-player3.png');
		this.game.load.image('player4-cooldown', 'assets/images/cooldown-player4.png');
    this.game.load.image('lake', 'assets/images/water.gif');
    this.game.load.image('land-bottom-left', 'assets/images/land/bottom-left.png');
    this.game.load.image('land-bottom-right', 'assets/images/land/bottom-right.png');
    this.game.load.image('land-top-left', 'assets/images/land/top-left.png');
    this.game.load.image('land-top-right', 'assets/images/land/top-right.png');
    this.game.load.image('land-filler-side-v', 'assets/images/land/filler-side-v.png');
    this.game.load.image('land-filler-side-h', 'assets/images/land/filler-side-h.png');

    for (var i = 1; i <= this.numberLandSides; i++) {
      this.game.load.image('land-side-'+ i, 'assets/images/land/side-' + i + '.png');
    }

    this.game.load.physics('physicsDataSides', 'assets/json/sides.json');
    this.game.load.physics('physicsDataCorners', 'assets/json/corners.json');


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
