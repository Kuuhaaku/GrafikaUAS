class Kredit extends Phaser.Scene {
	
	constructor() {
		super({key:'kredit'});
	}
	
	preload() {
		this.load.image('background', 'assets/sky.png');
	}
	
	create() {
		var bg = this.add.sprite(0, 0, 'background');
		bg.setOrigin(0,0);

		var teks2 = this.add.rectangle(355, 57, 150, 50, 0x696969);
		teks2.setStrokeStyle(3, 0x1a65ac);
		var text = this.add.text(310, 50, 'Kelompok 3');
		

		var teks = this.add.rectangle(350, 183, 500, 100, 0x566d78);
		teks.setStrokeStyle(3, 0x1a65ac);
		var text2 = this.add.text(300, 135, 'Bobbi Setiawan');
		var text3 = this.add.text(275, 155, 'Kevin Tanusa Devara');
		var text4 = this.add.text(290, 175, 'Renaldi Fernando');
		var text5 = this.add.text(330, 195, 'Yordan');
		var text6 = this.add.text(290, 215, 'Informatika 2018');

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
export default Kredit;