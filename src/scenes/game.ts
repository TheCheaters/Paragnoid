import { Scene } from 'phaser';
import MissileGroup from '~/scenes/missile';
import Enemies from '~/scenes/enemies';
import Player from '~/scenes/player';
import { KEYS, DIRECTIONS } from '~/globals';

export const SPACECRAFT             = 'spacecraft';
export const SPACECRAFT_ASSET_PATH  = 'assets/spacecraft.png';
export const SPACECRAFT_ACC_X_DELTA = 10;
export const SPACECRAFT_DEC_X_DELTA = 5;
export const SPACECRAFT_ACC_Y_DELTA = 10;
export const SPACECRAFT_DEC_Y_DELTA = 5;

export const MISSILE            = 'missile';
export const MISSILE_ASSET_PATH = 'assets/missile.png';
export const AUDIO_MISSILE      = 'audiomissile';
export const AUDIO_MISSILE_PATH = 'assets/missile.mp3';

export const ENEMY            = 'enemy';
export const ENEMY_ASSET_PATH = 'assets/enemy.png';

export default class Game extends Scene {
  private player?: Player;
  private enemies?: Enemies;
  private missileGroup?: MissileGroup;
  private cursor?: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  public VelocityX = 0;
  public VelocityY = 0;
  private lastHorizontalKeyPressed: KEYS.LEFT | KEYS.RIGHT | null = null;
  private lastVerticalKeyPressed: KEYS.UP | KEYS.DOWN | null = null;

  constructor() {
    super({
      key: 'game',
      active: true,
    });
  }

  preload() {
    this.load.spritesheet(SPACECRAFT, SPACECRAFT_ASSET_PATH, {
      frameWidth: 50,
      frameHeight: 50
    });
    this.load.image(MISSILE, MISSILE_ASSET_PATH);
    this.load.audio(AUDIO_MISSILE, AUDIO_MISSILE_PATH);
    this.load.spritesheet(ENEMY, ENEMY_ASSET_PATH, {
      frameWidth: 50,
      frameHeight: 50
    });
  }
  create() {
    this.player = new Player(this, 100, 450, SPACECRAFT);
    this.missileGroup = new MissileGroup(this, MISSILE);
    this.enemies = new Enemies(this, ENEMY);

    this.physics.add.collider(this.player, this.enemies, this.handlerCollisions.bind(this));


    // assegna comandi
    this.cursor = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

  }

  handlerCollisions() {
    this.physics.pause();
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

      if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && this.missileGroup) {
        this.missileGroup.fireBullet(this.player.x, this.player.y);
      }
    }
  }
}