import { Scene } from 'phaser';
import MissileGroup, { Missile } from '~/scenes/missile';
import Enemies, { Enemy } from '~/scenes/enemies';
import Player from '~/scenes/player';
import Explosions from '~/scenes/explosions';

import { KEYS, DIRECTIONS } from '~/globals';

export const SPACECRAFT             = 'spacecraft';
export const SPACECRAFT_ASSET_PATH  = 'assets/spacecraft.png';
export const SPACECRAFT_ACC_X_DELTA = 10;
export const SPACECRAFT_DEC_X_DELTA = 5;
export const SPACECRAFT_ACC_Y_DELTA = 15;
export const SPACECRAFT_DEC_Y_DELTA = 15;

export const MISSILE            = 'missile';
export const MISSILE_ASSET_PATH = 'assets/missile.png';
export const AUDIO_MISSILE      = 'audiomissile';
export const AUDIO_MISSILE_PATH = 'assets/missile.mp3';

export const ENEMY            = 'enemy';
export const ENEMY_ASSET_PATH = 'assets/enemy.png';

export const EXPLOSION            = 'explosion'
export const EXPLOSION_ASSET_PATH = 'assets/explosion.png'

export const INFOPANEL_OVER       = 'infopanel'
export const INFOPANEL_OVER_PATH  = 'assets/infopanel.png'

export default class Game extends Scene {
  private player?: Player;
  private enemies?: Enemies;
  private missileGroup?: MissileGroup;
  private explosions?: Explosions;
  private cursor?: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private infoPanel;
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
      frameHeight: 22
    });
    this.load.image(MISSILE, MISSILE_ASSET_PATH);
    this.load.image(INFOPANEL_OVER, INFOPANEL_OVER_PATH);
    this.load.audio(AUDIO_MISSILE, AUDIO_MISSILE_PATH);
    this.load.spritesheet(ENEMY, ENEMY_ASSET_PATH, {
      frameWidth: 34,
      frameHeight: 28
    });
    this.load.spritesheet(EXPLOSION, EXPLOSION_ASSET_PATH, {
      frameWidth: 60,
      frameHeight: 60
    });
  }
  create() {
    this.player = new Player(this, 100, 450, SPACECRAFT);
    this.missileGroup = new MissileGroup(this, MISSILE);
    this.enemies = new Enemies(this, ENEMY);
    this.explosions = new Explosions(this, EXPLOSION);
    

    this.physics.add.collider(this.player, this.enemies, this.handlerPlayerEnemyCollisions.bind(this));
    this.physics.add.collider (this.missileGroup, this.enemies, this.handlerMissileEnemyCollisions.bind(this));

    // assegna comandi
    this.cursor = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

  }

  handlerPlayerEnemyCollisions() {
    // this.physics.pause();
    this.infoPanel = this.add.image(400, 384, INFOPANEL_OVER);
    this.infoPanel= this.add.text(300, 384, 'mortaccivostraedestocazzodePhaser');
  }

  handlerMissileEnemyCollisions(...args) {
    const enemy = args[1] as Enemy;
    const missile = args[0] as Missile;
    const {x, y} = enemy;
    this.explosions?.addExplosion(x, y);
    enemy.kill();
    missile.kill();
  }

  update() {

    if (this.player && this.cursor) {

      const up = this.cursor.up?.isDown;
      const right = this.cursor.right?.isDown;
      const down = this.cursor.down?.isDown;
      const left = this.cursor.left?.isDown;

      // ACCELERAZIONE E ANIMAZIONE ORIZONTALE
      if (left) {
        this.VelocityX -= SPACECRAFT_ACC_X_DELTA;
        this.player.anims.play(DIRECTIONS.GO_LEFT, true);
        this.lastHorizontalKeyPressed = KEYS.LEFT;
      } else if (right) {
        this.VelocityX += SPACECRAFT_ACC_X_DELTA;
        this.player.anims.play(DIRECTIONS.GO_RIGHT, true);
        this.lastHorizontalKeyPressed = KEYS.RIGHT;
      }

      // ACCELERAZIONE E ANIMAZIONE VERTICALE
      if (up) {
        this.VelocityY -= SPACECRAFT_ACC_Y_DELTA;
        this.player.anims.play(DIRECTIONS.GO_UP, true);
        this.lastVerticalKeyPressed = KEYS.UP;
      } else if (down) {
        this.VelocityY += SPACECRAFT_ACC_Y_DELTA;
        this.player.anims.play(DIRECTIONS.GO_DOWN, true);
        this.lastVerticalKeyPressed = KEYS.DOWN;
      }

      if (!up && !down && !left && !right) {
        this.player.anims.play(DIRECTIONS.STOP, true);
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