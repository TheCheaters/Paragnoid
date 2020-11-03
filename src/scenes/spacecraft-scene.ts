import { Physics, Scene } from 'phaser';
import LaserGroup from '~/scenes/laser';
import Enemies from '~/scenes/enemies';

const SPACECRAFT             = 'spacecraft';
const SPACECRAFT_ASSET_PATH  = 'assets/spacecraft.png';
const SPACECRAFT_ACC_X_DELTA = 10;
const SPACECRAFT_DEC_X_DELTA = 5;
const SPACECRAFT_ACC_Y_DELTA = 10;
const SPACECRAFT_DEC_Y_DELTA = 5;

const LASER              = 'laser';
const LASER_ASSET_PATH   = 'assets/laser.png';
const AUDIO_MISSILE      = 'audiomissile';
const AUDIO_MISSILE_PATH = 'assets/missile.mp3';

const ENEMY            = 'enemy';
const ENEMY_ASSET_PATH = 'assets/laser.png';

enum DIRECTIONS {
  GO_RIGHT = 'GO_RIGHT',
  GO_LEFT  = 'GO_LEFT',
  GO_UP    = 'GO_UP',
  GO_DOWN  = 'GO_DOWN',
  STOP     = 'STOP',
}

enum KEYS {
  UP    = 'UP',
  RIGHT = 'RIGHT',
  DOWN  = 'DOWN',
  LEFT  = 'LEFT',
}

export default class SpacecraftScene extends Scene {
  private player?: Physics.Arcade.Sprite;
  private enemies?: Enemies;
  private cursor?: Phaser.Types.Input.Keyboard.CursorKeys;
  private space!: Phaser.Input.Keyboard.Key;
  public VelocityX = 0;
  public VelocityY = 0;
  private lastHorizontalKeyPressed: KEYS.LEFT | KEYS.RIGHT | null = null;
  private lastVerticalKeyPressed: KEYS.UP | KEYS.DOWN | null = null;
  private laserGroup?: LaserGroup;
  private missile_audio;

  constructor() {
    super({
      key: 'spacecraft-scene',
      active: true,
    });
  }
  preload() {
    this.load.spritesheet(SPACECRAFT, SPACECRAFT_ASSET_PATH, {
      frameWidth: 50,
      frameHeight: 50
    });
    this.load.image(LASER, LASER_ASSET_PATH);
    this.load.audio(AUDIO_MISSILE, AUDIO_MISSILE_PATH);
		this.load.image(ENEMY, ENEMY_ASSET_PATH);

  }
  create() {
    this.laserGroup = new LaserGroup(this);
    this.enemies = new Enemies(this);
    this.player = this.physics.add.sprite(100, 450, SPACECRAFT).setScale(2, 2);
    this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: DIRECTIONS.GO_RIGHT,
      frames: this.anims.generateFrameNumbers(SPACECRAFT, {
        start: 0,
        end: 7
      }),
      frameRate: 20
    });

    this.anims.create({
      key: DIRECTIONS.GO_LEFT,
      frames: this.anims.generateFrameNumbers(SPACECRAFT, {
        start: 0,
        end: 7
      }),
      frameRate: 20
    })
    this.anims.create({
      key: DIRECTIONS.GO_UP,
      frames: this.anims.generateFrameNumbers(SPACECRAFT, {
        start: 0,
        end: 7
      }),
      frameRate: 20
    });
    this.anims.create({
      key: DIRECTIONS.GO_DOWN,
      frames: this.anims.generateFrameNumbers(SPACECRAFT, {
        start: 0,
        end: 7
      }),
      frameRate: 20
    });
    this.anims.create({
      key: DIRECTIONS.STOP,
      frames: this.anims.generateFrameNumbers(SPACECRAFT, {
        start: 0,
        end: 7
      }),
      frameRate: 20
    });

    this.cursor = this.input.keyboard.createCursorKeys();

    // Laser
    this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    //Missile_audio
    this.missile_audio = this.sound.add(AUDIO_MISSILE, {loop: false}); //Da verificare se AUDIO_MISSILE_PATH è corretto in questo caso


    // Enemy
    this.time.addEvent({ delay: 2000, callback: this.makeEnemy, callbackScope: this, loop: true });

  }

	fireBullet() {
    if (this.player && this.laserGroup) {
      this.laserGroup.fireBullet(this.player.x, this.player.y);
      this.missile_audio.play();
    }
  }

  makeEnemy() {
    const y = Phaser.Math.Between(0, 600);
    const x = 900;
    if (this.enemies) this.enemies.makeEnemy(x, y);
  }

  update() {

    if (this.player && this.cursor) {

      const up = this.cursor.up?.isDown;
      const right = this.cursor.right?.isDown;
      const down = this.cursor.down?.isDown;
      const left = this.cursor.left?.isDown;

      // ACCELERAZIONE E ANIMAZIONE ORIZONTALE
      this.player.anims.play(DIRECTIONS.STOP, true);
      if (left) {
        this.VelocityX -= SPACECRAFT_ACC_X_DELTA;
        //this.player.anims.play(DIRECTIONS.GO_LEFT, true);
        this.lastHorizontalKeyPressed = KEYS.LEFT;
      } else if (right) {
        this.VelocityX += SPACECRAFT_ACC_X_DELTA;
        //this.player.anims.play(DIRECTIONS.GO_RIGHT, true);
        this.lastHorizontalKeyPressed = KEYS.RIGHT;
      }

      // ACCELERAZIONE E ANIMAZIONE VERTICALE
      if (up) {
        this.VelocityY -= SPACECRAFT_ACC_Y_DELTA;
        //this.player.anims.play(DIRECTIONS.GO_UP, true);
        this.lastVerticalKeyPressed = KEYS.UP;
      } else if (down) {
        this.VelocityY += SPACECRAFT_ACC_Y_DELTA;
        //this.player.anims.play(DIRECTIONS.GO_DOWN, true);
        this.lastVerticalKeyPressed = KEYS.DOWN;
      }

      // DECELERAZIONE ORIZONTALE
      if (this.lastHorizontalKeyPressed === KEYS.RIGHT && this.VelocityX > 0 && !right) {
        this.VelocityX -= SPACECRAFT_DEC_X_DELTA;
      }

      if (this.lastHorizontalKeyPressed === KEYS.LEFT && this.VelocityX < 0 && !left) {
        this.VelocityX += SPACECRAFT_DEC_X_DELTA;
      }

      // DECELERAZIONE VERTICALE
      if (this.lastVerticalKeyPressed === KEYS.DOWN && this.VelocityY > 0 && !down) {
        this.VelocityY -= SPACECRAFT_DEC_Y_DELTA;
      }

      if (this.lastVerticalKeyPressed === KEYS.UP && this.VelocityY < 0 && !up) {
        this.VelocityY += SPACECRAFT_DEC_Y_DELTA;
      }

      // SPOSTAMENTO SPRITE
      this.player.setVelocityX(this.VelocityX);
      this.player.setVelocityY(this.VelocityY);

      if (Phaser.Input.Keyboard.JustDown(this.space)) {
        this.fireBullet();
      }

    }
  }
}