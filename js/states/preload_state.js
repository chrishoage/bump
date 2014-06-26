var PreloadState = (function () {
	var PreloadState = function(game, x, y, asset, frame) {
	  Phaser.State.call(this, game);
	}

	PreloadState.prototype = Object.create(Phaser.State.prototype);
	PreloadState.prototype.constructor = PreloadState;

	PreloadState.prototype.loaderFull = Phaser.Sprite;
	PreloadState.prototype.loaderEmpty = Phaser.Spirte;

	PreloadState.prototype.preload = function () {
		console.log("preloading assets");

		this.loaderEmpty = this.game.add.sprite(this.game.world.centerX, 200, 'loaderEmpty');
        this.preloadBar = this.game.add.sprite(this.loaderEmpty.x - this.loaderEmpty.width/2, 200, 'loaderFull');
        this.loaderEmpty.anchor.setTo(0.5, 0);
        this.game.load.setPreloadSprite(this.preloadBar);

        // load assets
		this.game.load.image('player', 'assets/images/circle.png');
		
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
