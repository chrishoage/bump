'use strict';

window.addEventListener('load', function () {
	if (Modernizr.touch) {
		require('./controller');
	} else {
		var Phaser = require('phaser');

		var BootState    = require('./states/boot_state');
		var PreloadState = require('./states/preload_state');
		var SetupState   = require('./states/setup_state');
		var GameState    = require('./states/game_state');

		var peer = require('./instance/peer');



			// wati till peer.js connects to start the game, it wont work with out it anyway
			peer.on('open', function(id) {
				var game = new Phaser.Game(1280, 720, Phaser.CANVAS, 'bump', 'bootState', false);
				game.state.add('bootState' , BootState);
				game.state.add('preloadState' , PreloadState);
				game.state.add('setupState' , SetupState);
				game.state.add('gameState' , GameState);
				console.log(game);
			});

			peer.on('error', function (err) {
				if (err.type === 'browser-incompatible') {
					alert('Sorry, but you must use a recent version of Chrome or Firefox (no iOS devices!)')
				} else {
					console.error(err);
				}
			});



	}
}, true);
