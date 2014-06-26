(function () {

	this.peer = new Peer({key: 'h35ea8mmmurw9udi'});

	$(function () {

		var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'bump', 'bootState', true);
		game.state.add('bootState' , BootState);
		game.state.add('gameState' , GameState);
		//game.state.start('Boot');

		window.game = game;

		peer.on('open', function(id) {
			//$('#qr-code').qrcode('http://' + location.host + '/controller.html#' + id);
			//$('#qr-modal').modal('toggle');
		});

	});

}).call(this);
