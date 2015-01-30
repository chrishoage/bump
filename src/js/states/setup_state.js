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


var playerConnections = [];

function SetupState (game, x, y, asset, frame) {
  this.lake = null;
  this.players = this.players || [];

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

SetupState.prototype.sendToPlayers = function (payload) {
	var b = typeof payload === 'function';
	_.each(playerConnections, function (conn) {
		conn.send(b ? payload(conn.player) : payload);
	});
}

SetupState.prototype.playingPlayers = function() {
	return _.map(this.players, function(player) { return player.name});
};

SetupState.prototype.create = function () {
  this.game.add.existing(new Lake(this.game));

	this.playerSprites = {};
	this.playerObjects = {
		player1: PlayerOne,
		player2: PlayerTwo,
		player3: PlayerThree,
		player4: PlayerFour
	}

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

   if (this.players) {
   	this.sendToPlayers({
   		type: 'player-setup',
   	  playingPlayers: _this.playingPlayers()
   	});
   	_.each(this.players, function (player, i) {
   		this.playerSprites[player.name] = this.game.add.sprite(50, 120+120*i, player.name);
   	}, this);
   }

   peer.on('connection', function (conn) {
		conn.on('open', function () {
			playerConnections.push(conn);
			conn.send({
				type: 'player-setup',
		    playingPlayers: _this.playingPlayers()
			});
		});
		conn.on('data', function (data) {
			if (data.type === 'pick-player') {
				var PlayerObject = _this.playerObjects[data.player];
				var saferect = _this.game.state.states["gameState"].safeRectangle;
				console.log('PlayerObject', _this.game);
				var player = new PlayerObject(_this.game, _this.game.rnd.integerInRange(saferect.left, saferect.right), _this.game.world.centerY);
				player.playerIndex = _this.players.length;
				player.setupConnection(conn);
				player.userName = data.userName;
				_this.players.push(player);
				_this.playerSprites[player.name] = _this.game.add.sprite(50, 120+120*_this.players.length, data.player);
				_this.sendToPlayers({
					type: 'player-setup',
				  playingPlayers: _this.playingPlayers()
				});

			}

			if (data.type === 'unpick-player') {
				_this.playerSprites[data.player].destroy();
				delete _this.playerSprites[data.player];
				console.log('unpick-player', data);
				_this.sendToPlayers({
					type: 'player-setup',
				  playingPlayers: _.without(_this.playingPlayers(), data.player)
				});
				_.remove(_this.players, {name: data.player});
			}

		});

		conn.on('close', function () {
			var p = _.remove(_this.players, {peerConn: conn})[0];
			console.log('conn close', p, _this.playerSprites);
			_this.playerSprites[p.name].destroy();
			delete _this.playerSprites[p.name];
			_.remove(playerConnections, conn);
		});

   });

   // full screen on click
   this.game.input.onDown.add(function() {
     this.game.scale.startFullScreen();
   }, this);
}

SetupState.prototype.update = function () {
	if (this.players.length && _.every(this.players, 'playerReady')) {
		this.sendToPlayers(function (player) {
			return {
				type: 'game-start',
				playerName: player.name,
				userName: player.userName,
				color: player.color
			}
		});
		_.each(this.playerSprites, function (sprite) {
			sprite.destroy();
		});
		this.game.state.start("gameState");
	}
};

module.exports = SetupState;
