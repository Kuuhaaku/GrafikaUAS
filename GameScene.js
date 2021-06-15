class GameScene extends Phaser.Scene {
	constructor() {
		super({key : 'gameScene'});
	}
	
	init(){
	}
	
	preload (){
		this.load.audio('jump', 'assets/jump.m4a');
		this.load.audio('hit', 'assets/hit.m4a');
		this.load.audio('reach', 'assets/reach.m4a');
		
		this.load.image('gamebg', 'assets/background.png');
		this.load.image('ground', 'New asset/ground.png');
		this.load.image('templerun-idle', 'assets/templerun-idle.png');
		this.load.image('templerun-hurt', 'assets/templerun-hurt.png');
		this.load.image('restart', 'assets/restart.png');
		this.load.image('game-over', 'assets/game-over.png');
		this.load.image('cloud', 'assets/cloud.png');
		
		this.load.spritesheet('star', 'assets/stars.png', {
			frameWidth: 9, frameHeight: 9
		});
		
		this.load.spritesheet('moon', 'assets/moon.png', {
			frameWidth: 20, frameHeight: 40
		});
		
		this.load.spritesheet('templerun_run', 'assets/templerun_run.png', {
			frameWidth: 88,
			frameHeight: 94
		});
		
		this.load.spritesheet('templerun_slide', 'assets/templerun_slide.png', {
			frameWidth: 88,
			frameHeight: 94
		});
		
		this.load.spritesheet('enemy-bird', 'assets/enemy-vulture.png', {
			frameWidth: 48,
			frameHeight: 48
		});

		this.load.spritesheet('obstacle-1', 'assets/Deceased_walk.png', {
			frameWidth: 96,
			frameHeight: 96
		});

		this.load.spritesheet('obstacle-2', 'assets/Hyena_walk.png', {
			frameWidth: 96,
			frameHeight: 96
		});

		this.load.spritesheet('obstacle-3', 'assets/Mummy_walk.png', {
			frameWidth: 96,
			frameHeight: 96
		});

		this.load.spritesheet('obstacle-4', 'assets/Scorpio_walk.png', {
			frameWidth: 48,
			frameHeight: 48
		});

		this.load.spritesheet('obstacle-5', 'assets/Snake_walk.png', {
			frameWidth: 48,
			frameHeight: 48
		});

		this.load.spritesheet('coin-1', 'assets/bronze_coin.png', {
			frameWidth: 48,
			frameHeight: 48
		});

		this.load.spritesheet('coin-2', 'assets/silver_coin.png', {
			frameWidth: 48,
			frameHeight: 48
		});

		this.load.spritesheet('coin-3', 'assets/gold_coin.png', {
			frameWidth: 48,
			frameHeight: 48
		});
	}
	
	create (){
		//Variable to check is space pressed yet.
		this.isGameRunning = false;
		this.isDucking = false;
		this.obstaclePlaced = false;
		this.coinPlaced = false;
		this.duckingTimer = 0;
		this.gameSpeed = 10;
		this.respawnTime = 0;
		this.score = 0;
		const { height, width } = this.game.config;
		this.jumpSound = this.sound.add('jump', {volume : 0.2});
		this.hitSound = this.sound.add('hit', {volume : 0.2});
		this.reachSound = this.sound.add('reach', {volume : 0.2});
		this.bg = this.add.sprite(0, 0, 'gamebg');
		this.bg.setOrigin(0,0);
		this.ground = this.add.tileSprite(0, height, 88, 6, 'ground').setOrigin(0, 1);
		this.dino = this.physics.add.sprite(0, height, 'templerun-idle').setCollideWorldBounds(true).setGravityY(5000).setOrigin(0, 1).setBodySize(44, 92).setDepth(1);
		//Hidden object used to start game when space is pressed.
		this.startTrigger = this.physics.add.sprite(0, 10).setOrigin(0, 1).setImmovable();
		this.scoreText = this.add.text(width, 0, '00000', {fill : '#535353', font : '900 35px Courier', resolution : 5}).setOrigin(1, 0).setAlpha(0);
		this.highscoreText = this.add.text(width, 0, '00000', {fill : '#535353', font : '900 35px Courier', resolution : 5}).setOrigin(1, 0).setAlpha(0);
		this.gameOverScreen = this.add.container(width / 2, (height / 2) - 50).setAlpha(0);
		this.gameOverText = this.add.image(0, 0, 'game-over');
		this.restart = this.add.image(0, 80, 'restart').setInteractive();
		this.environment = this.add.group();
		this.environment.addMultiple([
			this.add.image(width / 2, 170, 'cloud'),
			this.add.image(width - 88, 80, 'cloud'),
			this.add.image(width / 1.3, 100, 'cloud'),
		]);
		this.environment.setAlpha(0);
		this.gameOverScreen.add([this.gameOverText, this.restart]);
		this.obstacles = this.physics.add.group();
		this.coins = this.physics.add.group();
		this.initAnims();
		this.initColliders();
		this.initControlls();
		this.initStartTrigger();
		this.handleScore();
	}
	initColliders(){
		this.physics.add.collider(this.dino, this.obstacles, () => {
			this.highscoreText.x = this.scoreText.x - this.scoreText.width - 20;
			const highScore = this.highscoreText.text.substr(this.highscoreText.text.length - 5);
			const newScore = Number(this.scoreText.text) > Number(highScore) ? this.scoreText.text : highScore;
			this.highscoreText.setText('HI ' + newScore);
			this.highscoreText.setAlpha(1);
			this.physics.pause();
			this.isGameRunning = false;
			this.anims.pauseAll();
			this.dino.setTexture('templerun-hurt');
			this.respawnTime = 0;
			this.gameSpeed = 10;
			this.gameOverScreen.setAlpha(1);
			this.score = 0;
			this.hitSound.play();
		}, null, this);
		this.physics.add.overlap(this.dino, this.coins, this.collectCoin, null, this);
		this.physics.add.overlap(this.obstacles, this.coins, this.removeCoin, null, this);
		this.physics.add.overlap(this.coins, this.coins, this.removeExtraCoin, null, this);
	}
	initControlls(){
		this.restart.on('pointerdown', () => {
			this.dino.setVelocityY(0);
			this.dino.body.height = 92;
			this.dino.body.offset.y = 0;
			this.physics.resume();
			this.obstacles.clear(true, true);
			this.coins.clear(true, true);
			this.isGameRunning = true;
			this.isDucking = false;
			this.duckingTimer = 0;
			this.gameOverScreen.setAlpha(0);
			this.anims.resumeAll();
		});
		this.input.keyboard.on('keydown', event => {
			switch (event.code) {
				case 'ArrowDown':
               	if (!this.dino.body.onFloor() || !this.isGameRunning) { 
					return; 
				}
				this.isDucking = true;
				this.duckingTimer = 25; //5/12 second.
                break;
				case 'ArrowUp':
				if (!this.dino.body.onFloor() || this.dino.body.velocity.x > 0) { 
					return; 
				}
				this.dino.body.height = 92;
				this.dino.body.offset.y = 0;
				this.duckingTimer = 0;
				this.isDucking = false;
				this.jumpSound.play();
				this.dino.setVelocityY(-1600);
				this.dino.setTexture('templerun-idle', 0);
                break;
			}
		});
	}
	initAnims(){
		this.anims.create({
			key: 'templerun_run',
			frames: this.anims.generateFrameNumbers('templerun_run', {start: 0, end: 9}),
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({
			key: 'templerun-slide-anim',
			frames: this.anims.generateFrameNumbers('templerun_slide', {start: 0, end: 8}),
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({
			key: 'enemy-bird-fly',
			frames: this.anims.generateFrameNumbers('enemy-bird', {start: 0, end: 3}),
			frameRate: 6,
			repeat: -1
		});
		this.anims.create({
			key: 'obstacle-anim-1',
			frames: this.anims.generateFrameNumbers('obstacle-1', {start: 0, end: 5}),
			frameRate: 6,
			repeat: -1
		});
		this.anims.create({
			key: 'obstacle-anim-2',
			frames: this.anims.generateFrameNumbers('obstacle-2', {start: 0, end: 5}),
			frameRate: 6,
			repeat: -1
		});
		this.anims.create({
			key: 'obstacle-anim-3',
			frames: this.anims.generateFrameNumbers('obstacle-3', {start: 0, end: 5}),
			frameRate: 6,
			repeat: -1
		});
		this.anims.create({
			key: 'obstacle-anim-4',
			frames: this.anims.generateFrameNumbers('obstacle-4', {start: 0, end: 3}),
			frameRate: 6,
			repeat: -1
		});
		this.anims.create({
			key: 'obstacle-anim-5',
			frames: this.anims.generateFrameNumbers('obstacle-5', {start: 0, end: 3}),
			frameRate: 6,
			repeat: -1
		});
		this.anims.create({
			key: 'coin-anim-1',
			frames: this.anims.generateFrameNumbers('coin-1', {start: 0, end: 9}),
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({
			key: 'coin-anim-2',
			frames: this.anims.generateFrameNumbers('coin-2', {start: 0, end: 9}),
			frameRate: 10,
			repeat: -1
		});
		this.anims.create({
			key: 'coin-anim-3',
			frames: this.anims.generateFrameNumbers('coin-3', {start: 0, end: 9}),
			frameRate: 10,
			repeat: -1
		});
	}
	placeObstacle(){
		const{width, height} = this.game.config;
		const obstacleNum = Math.floor(Math.random() * 6) + 1;
		const distance = Phaser.Math.Between(600, 900);
		let obstacle;
		if(obstacleNum > 5){
			const enemyHeight = [40,80,120,160];
			var birdHeight = height - enemyHeight[Math.floor(Math.random() * 4)];
			obstacle = this.obstacles.create(width + distance, birdHeight, 'enemy-bird');
			obstacle.play('enemy-bird-fly', 1);
			obstacle.body.height = obstacle.body.height / 1.5;
		}
		else{
			var obstacleName = "obstacle-" + obstacleNum;
			var obstacleAnimName = "obstacle-anim-" + obstacleNum;
			obstacle = this.obstacles.create(width + distance, height - 10, obstacleName);
			obstacle.play(obstacleAnimName, 1);
			obstacle.body.offset.y = 10;
		}
		obstacle.setOrigin(0, 1).setImmovable();
	}
	placeCoin(){
		const{width, height} = this.game.config;
		const coinNum = Math.floor(Math.random() * 3) + 1;
		const distance = Phaser.Math.Between(600, 900);
		const coinHeight = [40,80,120,160];
		var coinFinalHeight = height - coinHeight[Math.floor(Math.random() * 4)];
		let coin;
		if(coinNum == 1){
			coin = this.coins.create(width + distance, coinFinalHeight, 'coin-1');
			coin.play('coin-anim-1', 1);
			coin.value = 10;
		}
		else if(coinNum == 2){
			coin = this.coins.create(width + distance, coinFinalHeight, 'coin-2');
			coin.play('coin-anim-2', 1);
			coin.value = 20;
		}
		else{
			coin = this.coins.create(width + distance, coinFinalHeight, 'coin-3');
			coin.play('coin-anim-3', 1);
			coin.value = 30;
		}
		coin.body.height = coin.body.height / 1.5;
		coin.setOrigin(0, 1).setImmovable();
	}
	initStartTrigger(){
		const {width, height} = this.game.config;
		this.physics.add.overlap(this.startTrigger, this.dino, () => {
			if(this.startTrigger.y === 10){
				this.startTrigger.body.reset(0, height);
				return;
			}
			this.startTrigger.disableBody(true, true);
			const startEvent = this.time.addEvent({
				delay: 1000/60,
				loop: true,
				callbackScope: this,
				callback: () => {
					this.dino.setVelocityX(80);
					this.dino.play('templerun_run', 1);
					if(this.ground.width < width){
						this.ground.width += 17 * 2;
					}
					if(this.ground.width >= width){
						this.ground.width = width;
						this.isGameRunning = true;
						this.dino.setVelocity(0);
						this.scoreText.setAlpha(1);
						this.environment.setAlpha(1);
						startEvent.remove();
					}
				}
			});
		}, null, this);
	}
	handleScore(){
		this.time.addEvent({
			delay : 1000/10,
			loop : true,
			callbackScope : this,
			callback : () => {
				if(!this.isGameRunning){
					return;
				}
				else{
					this.score++;
					this.gameSpeed += 0.01;
					if(this.score % 100 === 0){
						this.reachSound.play();
						this.tweens.add({
							targets : this.scoreText,
							duration : 100,
							repeat : 3,
							alpha : 0,
							yoyo : true
						});
					}
					const score = Array.from(String(this.score), Number);
					for(let i = 0; i < 5 - String(this.score).length; i++){
						score.unshift(0);
					}
					this.scoreText.setText(score.join(''));
				}
			}
		});
	}
	collectCoin(dino, coin){
		coin.disableBody(true, true);
		this.score += coin.value;
	}
	removeCoin(obstacle, coin){
		coin.disableBody(true, true);
	}
	removeExtraCoin(coin1, coin2){
		coin1.disableBody(true, true);
	}
	update (time, delta){
		if(!this.isGameRunning){
			return;
		}
		if(this.isDucking == true){
			if(this.dino.body.height != 58 && this.dino.body.offset.y != 34){
				this.dino.body.height = 58;
				this.dino.body.offset.y = 34;
			}
			this.duckingTimer--;
		}
		else{
			if(this.dino.body.height != 92 && this.dino.body.offset.y != 0){
				this.dino.body.height = 92;
				this.dino.body.offset.y = 0;
			}
		}
		if(this.duckingTimer == 0 && this.isDucking == true){
			this.isDucking = false;
		}
		this.ground.tilePositionX += this.gameSpeed;
		Phaser.Actions.IncX(this.obstacles.getChildren(), -this.gameSpeed);
		Phaser.Actions.IncX(this.coins.getChildren(), -this.gameSpeed);
		Phaser.Actions.IncX(this.environment.getChildren(), -0.5);
		this.respawnTime += delta * this.gameSpeed * 0.08;
		if(this.respawnTime >= 1150 && this.coinPlaced == false){
			this.placeCoin();
			this.coinPlaced = true;
		}
		if(this.respawnTime >= 1500 && this.obstaclePlaced == false){
			this.placeObstacle();
			this.obstaclePlaced = true;
		}
		else if(this.respawnTime >= 1850){
			this.placeCoin();
			this.obstaclePlaced = false;
			this.coinPlaced = false;
			this.respawnTime = 0;
		}
		this.obstacles.getChildren().forEach(obstacle => {
			if(obstacle.getBounds().right < 0){
				obstacle.destroy();
			}
		});
		this.coins.getChildren().forEach(coin => {
			if(coin.getBounds().right < 0){
				coin.destroy();
			}
		});
		this.environment.getChildren().forEach(env => {
			if(env.getBounds().right < 0){
				env.x = this.game.config.width + 30;
			}
		});
		if (this.dino.body.deltaAbsY() > 0) {
			this.dino.anims.stop();
			this.dino.setTexture('templerun-idle', 0);
		} 
		else {
			if(this.dino.body.height <= 58){
				this.dino.play('templerun-slide-anim', true)
			}
			else{
				this.dino.play('templerun_run', true);
			}
		}
	}
}
export default GameScene;