import {
  LEFT,
  Physics,
  Scene
} from 'phaser';

const SPACECRAFT             = 'spacecraft';
const SPACECRAFT_ASSET_PATH  = 'assets/spacecraft.png';
const SPACECRAFT_ACC_X_DELTA = 3;
const SPACECRAFT_DEC_X_DELTA = 1;
const SPACECRAFT_ACC_Y_DELTA = 3;
const SPACECRAFT_DEC_Y_DELTA = 1;

enum DIRECTIONS {
  GO_RIGHT = 'GO_RIGHT',
  GO_LEFT  = 'GO_LEFT',
  GO_UP    = 'GO_UP',
  GO_DOWN  = 'GO_DOWN',
}

enum KEYS {
  UP    = 'UP',
  RIGHT = 'RIGHT',
  DOWN  = 'DOWN',
  LEFT  = 'LEFT',
}

export default class SceneOne extends Scene {
  private player?: Physics.Arcade.Sprite;
  private cursor?: Phaser.Types.Input.Keyboard.CursorKeys;
  private VelocityX = 0;
  private VelocityY = 0;
  private lastHorizontalKeyPressed: KEYS.LEFT | KEYS.RIGHT | null = null;
  private lastVerticalKeyPressed: KEYS.UP | KEYS.DOWN | null = null;
  constructor() {
    super('scene-one');
  }
  preload() {
    this.load.spritesheet(SPACECRAFT, SPACECRAFT_ASSET_PATH, {
      frameWidth: 50,
      frameHeight: 50
    });

  }
  create() {

    this.player = this.physics.add.sprite(100, 450, SPACECRAFT);
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

    this.cursor = this.input.keyboard.createCursorKeys();

  }

  update() {

    if (this.player && this.cursor) {

      // ACCELERAZIONE E ANIMAZIONE ORIZONTALE
      if (this.cursor.left?.isDown) {
        this.VelocityX -= SPACECRAFT_ACC_X_DELTA;
        this.player.anims.play(DIRECTIONS.GO_LEFT, true);
        this.lastHorizontalKeyPressed = KEYS.LEFT;
      } else if (this.cursor.right?.isDown) {
        this.VelocityX += SPACECRAFT_ACC_X_DELTA;
        this.player.anims.play(DIRECTIONS.GO_RIGHT, true);
        this.lastHorizontalKeyPressed = KEYS.RIGHT;
      }

      // ACCELERAZIONE E ANIMAZIONE VERTICALE
      if (this.cursor.up?.isDown) {
        this.VelocityY -= SPACECRAFT_ACC_Y_DELTA;
        this.player.anims.play(DIRECTIONS.GO_UP, true);
        this.lastVerticalKeyPressed = KEYS.UP;
      } else if (this.cursor.down?.isDown) {
        this.VelocityY += SPACECRAFT_ACC_Y_DELTA;
        this.player.anims.play(DIRECTIONS.GO_DOWN, true);
        this.lastVerticalKeyPressed = KEYS.DOWN;
      }

      // DECELERAZIONE ORIZONTALE
      if (this.lastHorizontalKeyPressed === KEYS.RIGHT && this.VelocityX > 0) {
        this.VelocityX -= SPACECRAFT_DEC_X_DELTA;
      }

      if (this.lastHorizontalKeyPressed === KEYS.LEFT && this.VelocityX < 0) {
        this.VelocityX += SPACECRAFT_DEC_X_DELTA;
      }

      // DECELERAZIONE VERTICALE
      if (this.lastVerticalKeyPressed === KEYS.DOWN && this.VelocityY > 0) {
        this.VelocityY -= SPACECRAFT_DEC_Y_DELTA;
      }

      if (this.lastVerticalKeyPressed === KEYS.UP && this.VelocityY < 0) {
        this.VelocityY += SPACECRAFT_DEC_Y_DELTA;
      }

      // SPOSTAMENTO SPRITE
      this.player.setVelocityX(this.VelocityX);
      this.player.setVelocityY(this.VelocityY);
    }
  }
}