'use strict';

var Phaser = require('phaser');
var peer = require('../instance/peer');
var _    = require('lodash');
var qr = require('qr-js');

var Lake = require('../sprites/lake');

var PlayerOne   = require('../sprites/player_one'),
		PlayerTwo   = require('../sprites/player_two'),
		PlayerThree = require('../sprites/player_three'),
		PlayerFour  = require('../sprites/player_four');

function SetupState (game, x, y, asset, frame) {
   this.lake = null;
   this.players = [];

  Phaser.State.call(this, game);
}

SetupState.prototype = Object.create(Phaser.State.prototype);
SetupState.prototype.constructor = SetupState;

SetupState.prototype.preload = function () {
		var dataURI = qr.toDataURL({
		     value:'http://' + location.host + location.pathname + '#' + peer.id,
		      size:100
		    });
		var data = new Image();
		data.src = dataURI;
		this.game.cache.addImage('qr-code', dataURI, data);
};

SetupState.prototype.create = function () {
   this.game.add.existing(new Lake(this.game));

  var playerSprites = [];
  var playingPlayers = [];
	var playerImages = ['player1', 'player2', 'player3', 'player4'];
	var playerObjects = [PlayerOne, PlayerTwo, PlayerThree, PlayerFour];

   var style = { font: "65px Arial", fill: "#cf2127", align: "center" };
   var smallStyle = { font: "20px Arial", fill: "#fff", align: "center" };

   var t = this.game.add.text(180, this.game.world.height-50, 'Use the QR Code to connect your phone to use as a controller, remember to lock your device orientation!', smallStyle);
       t.alpha = 0;
       this.game.add.tween(t).to({alpha:1}, 1500, Phaser.Easing.Linear.None);

	var qrHost = this.game.add.sprite(this.game.world.centerX-10,  this.game.world.centerY-50, 'bump-title');
   qrHost.anchor.set(0.5);

   this.game.add.tween(qrHost).from({y:-600}, 1000,Phaser.Easing.Bounce.Out, true);
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
   this.game.add.tween(qrSprite).to({alpha:1}, 2000, Phaser.Easing.Linear.None, 1800);

   var _this = this;
   peer.on('connection', function (conn) {
		conn.on('open', function () {
			conn.send({
				type: 'player-setup',
		    playingPlayers: playingPlayers
			});
		});
		conn.on('data', function (data) {
			console.log(data);
			if (data.type === 'pick-player') {
				var playerIndex = _.indexOf(playerImages, data.player);
				playingPlayers.push(playerImages[playerIndex]);
				var PlayerObject = playerObjects[playerIndex];
				var saferect = _this.game.state.states["gameState"].safeRectangle;
				console.log(PlayerObject, playerIndex, playerObjects, playerObjects[playerIndex]);
				var player = new PlayerObject(_this.game, _this.game.rnd.integerInRange(saferect.left, saferect.right), _this.game.world.centerY);
				player.playerIndex = _this.players.length;
				player.setupConnection(conn);
				player.playerName = data.player;
				player.userName = data.userName;
				_this.players.push(player);
				playerSprites.push(_this.game.add.sprite(50, 120+120*_this.players.length, playerImages[playerIndex]));
				_.each(_this.players, function (player) {
					player.peerConn.send({
						type: 'player-setup',
					  playingPlayers: playingPlayers
					});
				});

			}

			if (data.type === 'unpick-player') {
				var playerIndex = _.indexOf(playingPlayers, data.player);
				_.pullAt(playingPlayers, playerIndex);
				var sprite = _.pullAt(playerSprites, playerIndex);
				console.log('unpick-player', playerIndex, sprite);
				sprite[0].destroy();
				_.each(_this.players, function (player) {
					player.peerConn.send({
						type: 'player-setup',
					  playingPlayers: playingPlayers
					});
				});
				_.pullAt(_this.players, playerIndex);
			}

		});
   });
   // peer.on('connection', function (conn) {
   // 	var PlayerObject = playerObjects.shift();
   // 	var saferect = _this.game.state.states["gameState"].safeRectangle;
   // 	var player = new PlayerObject(_this.game, _this.game.rnd.integerInRange(saferect.left, saferect.right), _this.game.world.centerY);
   // 	console.log(player);
   // 	player.playerIndex = _this.players.length;
   // 	player.setupConnection(conn);
   // 	_this.players.push(player);
   // 	_this.game.add.sprite(50, 120+120*_this.players.length, playerImages.shift());
   // 	conn.on('open', function () {
   // 		conn.send({
   //       playerName: player.name,
   // 			color: '#'+player.barColor.toString(16)
   // 		})
   // 	})
   // });

   // full screen on click
   this.game.input.onDown.add(function() {
     this.game.scale.startFullScreen();
   }, this);
}

SetupState.prototype.update = function () {
	if (this.players.length && _.every(this.players, 'playerReady')) {
		this.game.state.start("gameState");
	}
};

module.exports = SetupState;
