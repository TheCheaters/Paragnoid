import * as C from '~/constants.json';
import { Scene } from 'phaser';
import { PlayerWeapon, EnemyWeapon } from '~/scenes/weapons';
import WeaponGroup from '~/scenes/weaponGroup';
import Enemies, { Enemy } from '~/scenes/enemies';
import Player from '~/scenes/player';
import Explosions from '~/scenes/explosions';

import { KEYS, DIRECTIONS } from '~/globals';
import Timeline from '~/scenes/timeline';

export default class Game extends Scene {
  public player!: Player;
  public enemies?: Enemies;
  public playerWeaponsGroup!: WeaponGroup;
  public enemyWeaponsGroup!: WeaponGroup;
  private explosions?: Explosions;
  private cursor?: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private infoPanel;
  private missileActive = true;
  private playerActive = true;
  public VelocityX = 0;
  public VelocityY = 0;
  private lastHorizontalKeyPressed: KEYS.LEFT | KEYS.RIGHT | null = null;
  private lastVerticalKeyPressed: KEYS.UP | KEYS.DOWN | null = null;
  private score = 0;
  private scoreText!: Phaser.GameObjects.DynamicBitmapText;
  private timeline!: Timeline;

  constructor() {
    super({
      key: 'game',
      active: false,
    });
  }

  preload() {
    this.load.spritesheet(C.SPACECRAFT, C.SPACECRAFT_ASSET_PATH, {
      frameWidth: 50,
      frameHeight: 22
    });
    this.load.image(C.MISSILE, C.MISSILE_ASSET_PATH);
    this.load.image(C.INFOPANEL_OVER, C.INFOPANEL_OVER_PATH);
    this.load.audio(C.AUDIO_MISSILE, C.AUDIO_MISSILE_PATH);
    this.load.audio(C.AUDIO_OVER, C.AUDIO_OVER_PATH);
    this.load.spritesheet(C.ENEMY, C.ENEMY_ASSET_PATH, {
      frameWidth: 34,
      frameHeight: 28
    });
    this.load.spritesheet(C.EXPLOSION, C.EXPLOSION_ASSET_PATH, {
      frameWidth: 60,
      frameHeight: 60
    });
    this.load.bitmapFont(C.PV_FONT_NAME, C.PV_FONT_PATH, C.PV_FONT_XML_PATH);

  }
  create() {
    this.sound.add(C.AUDIO_MISSILE, {loop: false});

    this.player = new Player(this, 100, 450, C.SPACECRAFT);
    this.playerWeaponsGroup = new WeaponGroup(this, C.MISSILE, PlayerWeapon);
    this.enemyWeaponsGroup = new WeaponGroup(this, C.MISSILE, EnemyWeapon);
    this.enemies = new Enemies(this, C.ENEMY);
    this.explosions = new Explosions(this, C.EXPLOSION);
    this.timeline = new Timeline(this);

    this.scoreText = this.add.dynamicBitmapText(16, 16, C.PV_FONT_NAME, 'Score: 0', 14 );

    this.physics.add.collider(this.player, this.enemies, this.handlerPlayerEnemyCollisions.bind(this));
    this.physics.add.collider(this.player, this.enemyWeaponsGroup, this.handlerPlayerEnemyCollisions.bind(this));
    this.physics.add.collider (this.enemies, this.playerWeaponsGroup, this.handlerMissileEnemyCollisions.bind(this));

    // assegna comandi
    this.cursor = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

    this.timeline.start();

  }

  handlerPlayerEnemyCollisions(...args) {
    // this.physics.pause();
    const player = args[0] as Player;
    const enemyOrEnemyWeapon = args[1] as Enemy | EnemyWeapon;
    const {x, y} = enemyOrEnemyWeapon;
    const {x:a,y:b} = player;
    this.explosions?.addExplosion(x, y);
    this.explosions?.addExplosion(a, b);
    enemyOrEnemyWeapon.kill();
    player.kill();
    this.missileActive = false;
    this.playerActive = false;
    this.infoPanel = this.add.image(400, 300, C.INFOPANEL_OVER);
    this.sound.add(C.AUDIO_OVER, {loop: false}).play();
  }

  handlerMissileEnemyCollisions(...args) {
    const enemy = args[0] as Enemy;
    const missile = args[1] as PlayerWeapon;
    const {x, y} = enemy;
    enemy.energy = enemy.energy - missile.energy;
    missile.kill();
    if (enemy.energy <= 0) {
      this.score += enemy.getData('score');
      this.scoreText.setText(`Score: ${this.score}`);
      this.explosions?.addExplosion(x, y);
      enemy.kill();
    }
  }

  update() {

    if (this.player && this.cursor) {

      const up = this.cursor.up?.isDown;
      const right = this.cursor.right?.isDown;
      const down = this.cursor.down?.isDown;
      const left = this.cursor.left?.isDown;

      // ACCELERAZIONE E ANIMAZIONE ORIZONTALE
      if (left && this.playerActive) {
        this.VelocityX -= C.SPACECRAFT_ACC_X_DELTA;
        this.player.anims.play(DIRECTIONS.GO_LEFT, true);
        this.lastHorizontalKeyPressed = KEYS.LEFT;
      } else if (right && this.playerActive) {
        this.VelocityX += C.SPACECRAFT_ACC_X_DELTA;
        this.player.anims.play(DIRECTIONS.GO_RIGHT, true);
        this.lastHorizontalKeyPressed = KEYS.RIGHT;
      }

      // ACCELERAZIONE E ANIMAZIONE VERTICALE
      if (up && this.playerActive) {
        this.VelocityY -= C.SPACECRAFT_ACC_Y_DELTA;
        this.player.anims.play(DIRECTIONS.GO_UP, true);
        this.lastVerticalKeyPressed = KEYS.UP;
      } else if (down && this.playerActive) {
        this.VelocityY += C.SPACECRAFT_ACC_Y_DELTA;
        this.player.anims.play(DIRECTIONS.GO_DOWN, true);
        this.lastVerticalKeyPressed = KEYS.DOWN;
      }

      if (!up && !down && !left && !right) {
        this.player.anims.play(DIRECTIONS.STOP, true);
      }

      // DECELERAZIONE ORIZONTALE
      if (this.lastHorizontalKeyPressed === KEYS.RIGHT && this.VelocityX > 0 && !right) {
        this.VelocityX -= C.SPACECRAFT_DEC_X_DELTA;
      }

      if (this.lastHorizontalKeyPressed === KEYS.LEFT && this.VelocityX < 0 && !left) {
        this.VelocityX += C.SPACECRAFT_DEC_X_DELTA;
      }

      // DECELERAZIONE VERTICALE
      if (this.lastVerticalKeyPressed === KEYS.DOWN && this.VelocityY > 0 && !down) {
        this.VelocityY -= C.SPACECRAFT_DEC_Y_DELTA;
      }

      if (this.lastVerticalKeyPressed === KEYS.UP && this.VelocityY < 0 && !up) {
        this.VelocityY += C.SPACECRAFT_DEC_Y_DELTA;
      }

      // SPOSTAMENTO SPRITE
      this.player.setVelocityX(this.VelocityX);
      this.player.setVelocityY(this.VelocityY);

      if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && this.playerWeaponsGroup && this.playerActive) {
        this.playerWeaponsGroup.fireBullet(this.player.x, this.player.y, 'player');
      }
    }
  }
}