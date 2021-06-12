import TitleScene from './TitleScene.js';
import GameScene from './GameScene.js';
import CaraBermain from './CaraBermain.js';
import Kredit from './Kredit.js';

// Our game scene
var gameScene = new GameScene();
var titleScene = new TitleScene();
var caraBermain = new CaraBermain();
var kredit = new Kredit();

//* Game scene */
var config = {
    type: Phaser.AUTO,
    width: 1000,
	height: 340,
	pixelArt: true,
	transparent: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
		}
	}
};

var game = new Phaser.Game(config);

// load scenes
game.scene.add('titleScene', titleScene);
game.scene.add("gameScene", gameScene);
game.scene.add("caraBermain", caraBermain);
game.scene.add("kredit", kredit);

// start title
game.scene.start('titleScene');