var peer = require('./instance/peer');
var _    = require('lodash');
var Hammer = require('hammerjs');
var orentationLock = require('./utils/orentationLock');
// I want this to fire before everything else loads
var $controller   = document.getElementById('controller');
var $players      = document.querySelectorAll('#player-setup .player-box');
var $resetPlayer  = document.querySelector('#player-setup .reset-btn');
var $playerReady  = document.querySelector('#player-setup .ready-btn');
var $startGame    = document.getElementById('start-game');
var $startGameBtn = document.querySelector('#start-game .start-btn');
var $setup        = document.getElementById('player-setup');
var $rotateLeft   = new Hammer(document.getElementById('rotate-left'));
var $rotateRight  = new Hammer(document.getElementById('rotate-right'));
var $powerUp      = new Hammer(document.getElementById('power-up'));
var rotateLeftInterval, rotateRightInterval;

$rotateLeft.get('press').set({
	time: 100
});
$rotateRight.get('press').set({
	time: 100
});

var conn;
var selectedPlayer = null;
var setSize = function () {
	$controller.style.width = window.innerWidth+'px';
	$controller.style.height = window.innerHeight+'px';
	//$setup.style.width = window.innerHeight+'px';
	//$setup.style.height = window.innerWidth+'px';
}

document.querySelector('form').addEventListener('submit', function (event) {
	event.preventDefault();
}, true);

console.log('hello from controller.js');

function getUserName () {
	return document.getElementById('username').value;
}

function isDocumentInFullScreenMode() {
  // Note that the browser fullscreen (triggered by short keys) might
  // be considered different from content fullscreen when expecting a boolean
  return ((document.fullscreenElement && document.fullscreenElement !== null) ||    // alternative standard methods
      document.mozFullScreen || document.webkitIsFullScreen);                   // current working methods
}


var $body = document.body;
//setSize();

var orientation = function () {
	var o = 0;

	if (window.orientation) {
		o = window.orientation;
	} else if (screen.mozOrientation) {
		switch (screen.mozOrientation) {
			case 'landscape-primary':
			case 'landscape-secondary':
			case 'landscape':
				o = 90;
				break;
			default:
				o = 0;
				break;
		}
	}

	return o;
};
//		document.querySelector('.reset-btn').
var handlers = {
	'reset-player': function (event) {
		event.preventDefault();
		conn.send({
			type: 'unpick-player',
			player: selectedPlayer
		});
		selectedPlayer = null;
	},
	'pick-player': function () {
		if (selectedPlayer) return;
		var player = this.id;
		console.log('clicked player', player);
		selectedPlayer = player;
		conn.send({
			type: 'pick-player',
			player: player,
			userName: getUserName()
		})
	},
	'player-ready': function (event) {
		var startTheGame = function() {
			console.log('sucess');
			$setup.style.display = 'none';
			$startGame.style.display = 'block';
			$startGameBtn.addEventListener('click', handlers['start-game']);
		};
		$startGameBtn.removeEventListener('click', handlers['start-game']);
		if (!isDocumentInFullScreenMode()) {
			var el = document.documentElement,
			rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen;
			rfs.call(el);
			setTimeout(function() {
				orentationLock('landscape-primary').then(startTheGame, function () {
					alert('Orientation Lock Failed. Please Lock Orientation in settings');
				})
			}, 0);
		} else {
			startTheGame();
		}
	},
	'start-game': function (event) {
		event.preventDefault();
		conn.send({
			type: 'start',
			timeStamp: event.timeStamp
		});
	}
}

var states = {
	'player-setup': function (data) {
		if (rotateLeftInterval || rotateRightInterval) {
			clearInterval(rotateLeftInterval);
			clearInterval(rotateRightInterval);
		}
		$startGame.style.display = 'none';
		$controller.style.display = 'none';
		$setup.style.display = 'block';
		_.each($players, function (player) {
			console.log('player', player, data.playingPlayers);
			$resetPlayer.removeEventListener('click', handlers['reset-player']);
			$playerReady.removeEventListener('click', handlers['player-ready']);
			player.removeEventListener('click', handlers['pick-player']);
			if (_.indexOf(data.playingPlayers, player.id) === -1) {
				player.classList.remove('selected');
			} else {
				player.classList.add('selected');
			}
			$resetPlayer.addEventListener('click', handlers['reset-player']);
			$playerReady.addEventListener('click', handlers['player-ready']);
			player.addEventListener('click', handlers['pick-player']);
		});
	},
	'game-start': function (data) {

			$startGame.style.display = 'none';
			$controller.style.display = 'block';
			$controller.style.backgroundColor = data.color;
			document.getElementById('displayName').textContent = data.userName;


			$rotateLeft.on('press', function(event) {
				event.preventDefault();
				rotateLeftInterval = setInterval(function() {
					console.log('rotateleft')
					conn.send({
						type: 'rotate-left'
					});
				}, 100)

			});
			$rotateLeft.on('pressup', function (event) {
				event.preventDefault();
				console.log('rotateleft stop')
				clearInterval(rotateLeftInterval);
			});

			$rotateRight.on('press', function(event) {
				event.preventDefault();
				rotateRightInterval = setInterval(function() {
					console.log('rotateright')
					conn.send({
						type: 'rotate-right'
					});
				}, 100);
			});

			$rotateRight.on('pressup', function (event) {
				event.preventDefault();
				console.log('rotateright stop')
				clearInterval(rotateRightInterval);
			});

			$powerUp.on('swipeup', function(event) {
				console.log('powerUp')
				conn.send({
					type: 'powerup',
				});
			});

			window.addEventListener('devicemotion', function(event) {
				event.preventDefault();
				var xyz = function (o) {
					return _.pick(o, ['x', 'y', 'z']);
				};

				conn.send({
					type: 'devicemotion',
					acceleration: xyz(event.acceleration),
					accelerationIncludingGravity: xyz(event.accelerationIncludingGravity),
					rotationRate: _.pick(event.rotationRate, ['alpha', 'beta', 'gamma']),
					interval: event.interval,
					orientation: orientation(),
					timeStamp: event.timeStamp
				});
			}, true);


	}
}

peer.on('open', function(id) {
	var connectTo = null;
	var started = false;
	if (location.hash) connectTo = location.hash.slice(1);
	if (!connectTo) return alert('Error: No Connection Code Supplied');
	conn = peer.connect(connectTo);
	if (!conn) return alert('Error: There was an error connecting to the game');
	conn.on('open', function () {
		conn.on('data', function (data) {
			console.log('client recieved data', data);
			states[data.type](data);
		});
	});
});

peer.on('error', function (err) {
	if (err.type === 'browser-incompatible') {
		alert('Sorry, but you must use a recent version of Chrome or Firefox (no iOS devices!)')
	} else {
		console.error(err);
	}
});
