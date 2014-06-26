(function () {

	this.peer = new Peer({key: 'h35ea8mmmurw9udi'});
	this.players = [];
	document.addEventListener('load', function () {

		// wati till peer.js connects to start the game, it wont work with out it anyway
		peer.on('open', function(id) {
			var game = new Phaser.Game(1280, 720, Phaser.CANVAS, 'bump', 'bootState', false);
			game.state.add('bootState' , BootState);
			game.state.add('preloadState' , PreloadState);
			game.state.add('setupState' , SetupState);
			game.state.add('gameState' , GameState);
			console.log(game);
		});

	}, true);

}).call(this);
