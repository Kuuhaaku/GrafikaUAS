class CaraBermain extends Phaser.Scene {
	
	constructor() {
		super({key:'caraBermain'});
	}
	
	preload() {
		this.load.image('background', 'assets/sky.png');
	}
	
	create() {
		var bg = this.add.sprite(0, 0, 'background');
		bg.setOrigin(0,0);

		var teks2 = this.add.rectangle(355, 57, 150, 50, 0x696969);
		teks2.setStrokeStyle(3, 0x1a65ac);
		var text = this.add.text(300, 50, 'Cara Bermain');
		

		var teks = this.add.rectangle(350, 155, 500, 50, 0x566d78);
		teks.setStrokeStyle(3, 0x1a65ac);
		var text2 = this.add.text(150, 145, 'Player dapat menggunakan spasi untuk lompat.');

		var menuUtama = this.add.rectangle(355, 295, 200, 50, 0x566d78);
		menuUtama.setStrokeStyle(3, 0x1a65ac);
		menuUtama.setInteractive({ useHandCursor: true });
		menuUtama.on('pointerdown', () => this.clickButton());
		var text = this.add.text(310, 290, 'Menu Utama');
	}
	
	clickButton() {
		this.scene.switch('titleScene');
	}
}
export default CaraBermain;