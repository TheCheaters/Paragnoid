import {
  Physics,
  Scene
} from 'phaser';

const SPACECRAFT = 'spacecraft';
const SPACECRAFT_ASSET_PATH = 'assets/spacecraft.png';

enum DIRECTIONS {
  GO_RIGHT = 'GO_RIGHT',
  GO_LEFT = 'GO_LEFT',
  GO_UP = 'GO_UP',
  GO_DOWN = 'GO_DOWN',
}

export default class SceneOne extends Scene {
  private player ? : Physics.Arcade.Sprite;
  private cursor ? : Phaser.Types.Input.Keyboard.CursorKeys;
  constructor() {
    super('scene-one')
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

      this.player.setVelocityY(-5);

      if (this.cursor.left?.isDown) {
        this.player.setVelocityX(-300);
        this.player.anims.play(DIRECTIONS.GO_LEFT, true);
      } else if (this.cursor.right?.isDown) {
        this.player.anims.play(DIRECTIONS.GO_RIGHT, true);
        this.player.setVelocityX(300);
      }

      if (this.cursor.up?.isDown) {
        this.player.setVelocityY(-300);
        this.player.anims.play(DIRECTIONS.GO_DOWN, true);
      } else if (this.cursor.down?.isDown) {
        this.player.setVelocityY(300);
        this.player.anims.play(DIRECTIONS.GO_UP, true);
      }

    }
  }
}