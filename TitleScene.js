class TitleScene extends Phaser.Scene {
	
	constructor() {
		super({key:'titleScene'});
	}
	
	preload() {
		this.load.image('background', 'assets/sky.png');
		this.load.audio('backgroundMusic', 'assets/music/backgroundmusic.mp3');
	}
	
	create() {
		this.backgroundMusic = this.sound.add('backgroundMusic', {volume : 1});
		this.backgroundMusic.loop = true;
		this.backgroundMusic.play();
		var bg = this.add.sprite(0, 0, 'background');
		bg.setOrigin(0,0);

		var teks2 = this.add.rectangle(355, 57, 150, 50, 0x696969);
		teks2.setStrokeStyle(3, 0x1a65ac);
		var text = this.add.text(292, 50, 'Dodge and Run');

		var startButton = this.add.rectangle(355, 150, 200, 50, 0x566d78);
		startButton.setStrokeStyle(3, 0x1a65ac);
		startButton.setInteractive({ useHandCursor: true });
		startButton.on('pointerdown', () => this.clickButton());
		var text = this.add.text(332, 145, 'Start');

		var howToPlayButton = this.add.rectangle(355, 225, 200, 50, 0x566d78);
		howToPlayButton.setStrokeStyle(3, 0x1a65ac);
		howToPlayButton.setInteractive({ useHandCursor: true });
		howToPlayButton.on('pointerdown', () => this.clickButton2());
		var text = this.add.text(300, 220, 'Cara Bermain');

		var creditsButton = this.add.rectangle(355, 300, 200, 50, 0x566d78);
		creditsButton.setStrokeStyle(3, 0x1a65ac);
		creditsButton.setInteractive({ useHandCursor: true });
		creditsButton.on('pointerdown', () => this.clickButton3());
		var text = this.add.text(310, 295, 'Kelompok 3');
	}
	
	clickButton() {
		this.scene.switch('gameScene');
	}

	clickButton2(){
		this.scene.switch('caraBermain');
	}

	clickButton3(){
		this.scene.switch('kredit');
	}
}
export default TitleScene;