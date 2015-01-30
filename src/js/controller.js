var peer = require('./instance/peer');
var _    = require('lodash');
var orentationLock = require('./utils/orentationLock');
// I want this to fire before everything else loads
var $controller = document.getElementById('controller');
var $setup = document.getElementById('player-setup');

var setSize = function () {
	$controller.style.width = window.innerWidth+'px';
	$controller.style.height = window.innerHeight+'px';
	//$setup.style.width = window.innerHeight+'px';
	//$setup.style.height = window.innerWidth+'px';
}

console.log('hello from controller.js');



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

var states = {
	'player-setup': function (data) {
		$setup.style.display = 'block';
	}
}

peer.on('open', function(id) {
	var connectTo = null;
	var started = false;
	if (location.hash) connectTo = location.hash.slice(1);
	if (!connectTo) return alert('Error: No Connection Code Supplied');
	var conn = peer.connect(connectTo);
	if (!conn) return alert('Error: There was an error connecting to the game');
	conn.on('open', function () {
		conn.on('data', function (data) {

		});
		var setupController = function (event) {

			$controller.removeEventListener('click', setupController, false);
			var el = document.documentElement,
					rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen;
			rfs.call(el);
			var setOrentation = function () {
				orentationLock('landscape-primary').then(function() {
					console.log('sucess');
				}, function() {
					console.log('fail');
				});
			};
			document.addEventListener("fullscreenchange", setOrentation);
			document.addEventListener("mozfullscreenchange", setOrentation);
			document.addEventListener("webkitfullscreenchange", setOrentation);
			document.addEventListener("msfullscreenchange", setOrentation);
			conn.send({
				type: 'start',
				timeStamp: event.timeStamp
			});
			window.addEventListener('click', function (event) {
					conn.send({
						type: 'click',
						timeStamp: event.timeStamp
					});
			}, true);
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
		$controller.addEventListener('click', setupController, false);
	});
});

peer.on('error', function (err) {
	if (err.type === 'browser-incompatible') {
		alert('Sorry, but you must use a recent version of Chrome or Firefox (no iOS devices!)')
	} else {
		console.error(err);
	}
});
