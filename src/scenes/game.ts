import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';
import * as C from '~/constants.json';
import { Scene } from 'phaser';
import { PlayerWeapon, EnemyWeapon } from '~/scenes/weapon';
import WeaponGroup from '~/scenes/weaponGroup';
import Enemies, { Enemy } from '~/scenes/enemies';
import Player from '~/scenes/player';
import Explosions from '~/scenes/explosions';

import { KEYS, DIRECTIONS } from '~/globals';
import Timeline from '~/scenes/timeline';
import Lives from './Lives';

type VirtualJoystickPlugin = Phaser.Plugins.BasePlugin & {
  add: (Scene, any) => VirtualJoystickPlugin;
  on: (event: string, callback: Function, context: Scene) => VirtualJoystickPlugin;
  createCursorKeys: () => Phaser.Types.Input.Keyboard.CursorKeys;
}

export default class Game extends Scene {
  public player!: Player;
  public enemies!: Enemies;
  public playerWeaponsGroup!: WeaponGroup;
  public enemyWeaponsGroup!: WeaponGroup;
  public VelocityX = 0;
  public VelocityY = 0;
  private explosions!: Explosions;
  private cursor!: Phaser.Types.Input.Keyboard.CursorKeys;
  private joyStick!: VirtualJoystickPlugin;
  private joyStickKeys!: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private infoPanel;
  private missileActive = true;
  private playerActive = true;
  public colliderPlayerEnemy!: Phaser.Physics.Arcade.Collider;
  public colliderPlayerWeapons!: Phaser.Physics.Arcade.Collider;
  public colliderEnemyWeapons!: Phaser.Physics.Arcade.Collider;
  private lastHorizontalKeyPressed: KEYS.LEFT | KEYS.RIGHT | null = null;
  private lastVerticalKeyPressed: KEYS.UP | KEYS.DOWN | null = null;
  private score = 0;
  private scoreText!: Phaser.GameObjects.DynamicBitmapText;
  public ricominciamoText!: Phaser.GameObjects.DynamicBitmapText;
  public lives!: Lives;

  //public extraLifesPlayer = 3;
  private timeline!: Timeline;

  constructor() {
    super({
      key: 'game',
      active: false,
    });
  }

  preload() {
    this.load.plugin('rexVirtualJoystick', VirtualJoystickPlugin, true);

    this.load.spritesheet(C.SPACECRAFT, C.SPACECRAFT_ASSET_PATH, {
      frameWidth: 50,
      frameHeight: 22
    });
    this.load.spritesheet(C.EXPLOSION, C.EXPLOSION_ASSET_PATH, {
      frameWidth: 60,
      frameHeight: 60
    });
    this.load.image(C.MISSILE, C.MISSILE_ASSET_PATH);
    this.load.image(C.INFOPANEL_OVER, C.INFOPANEL_OVER_PATH);
    this.load.image(C.ENEMY_GREEN, C.ENEMY_GREEN_ASSET_PATH);
    this.load.bitmapFont(C.PV_FONT_NAME, C.PV_FONT_PATH, C.PV_FONT_XML_PATH);

    this.load.audio(C.AUDIO_MISSILE, C.AUDIO_MISSILE_PATH);
    this.load.audio(C.AUDIO_OVER, C.AUDIO_OVER_PATH);
  }
  create() {

    const plugin = this.plugins.get('rexVirtualJoystick') as VirtualJoystickPlugin;
    this.joyStick = plugin.add(this, {
      x: 100,
      y: 500,
      radius: 70,
      // base: this.add.circle(0, 0, 100, 0x888888),
      // thumb: this.add.circle(0, 0, 50, 0xcccccc),
      // dir: '8dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
      // forceMin: 16,
      enable: true
    });

    this.sound.add(C.AUDIO_MISSILE, {loop: false});

    this.player = new Player(this, 100, 300, C.SPACECRAFT);
    this.playerWeaponsGroup = new WeaponGroup(this, C.MISSILE, PlayerWeapon);
    this.enemyWeaponsGroup = new WeaponGroup(this, C.MISSILE, EnemyWeapon);
    this.enemies = new Enemies(this, C.ENEMY_GREEN);
    this.explosions = new Explosions(this, C.EXPLOSION);
    this.timeline = new Timeline(this);

    this.scoreText = this.add.dynamicBitmapText(16, 16, C.PV_FONT_NAME, 'Score: 0', 14 );
    
    this.lives = new Lives(this, C.SPACECRAFT);

    this.colliderPlayerEnemy = this.physics.add.collider(this.player, this.enemies, this.handlerPlayerEnemyCollisions.bind(this));
    this.colliderPlayerWeapons = this.physics.add.collider(this.player, this.enemyWeaponsGroup, this.handlerPlayerEnemyCollisions.bind(this));
    this.colliderEnemyWeapons = this.physics.add.collider (this.enemies, this.playerWeaponsGroup, this.handlerMissileEnemyCollisions.bind(this));

    // assegna comandi
    this.cursor = this.input.keyboard.createCursorKeys();
    this.joyStickKeys = this.joyStick.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

    // inizia il gioco
    this.timeline.start();

  }

  handlerPlayerEnemyCollisions(...args) {
    const player = args[0] as Player;
    const enemyOrEnemyWeapon = args[1] as Enemy | EnemyWeapon;
    const {x, y} = enemyOrEnemyWeapon;
    const {x:a, y:b} = player;
    const respawnTime = 500;
    this.explosions?.addExplosion(x, y);
    this.explosions?.addExplosion(a, b);
    enemyOrEnemyWeapon.kill();

    if (this.lives.extraLifesPlayer > 0){

      this.lives.extraLifesPlayer -= 1;
      this.lives.destroyLives();

      this.tweens.addCounter({
        from: 255,
        to: 0,
        duration: respawnTime,
        ease: Phaser.Math.Easing.Sine.InOut,
        repeat: 3,
        yoyo: true,
        onUpdate: tween => {
          const valoreFrame = tween.getValue()
          this.player.setTint(Phaser.Display.Color.GetColor(valoreFrame, valoreFrame, valoreFrame));
             },
        onStart: tween => {
          this.missileActive = false;
          this.colliderPlayerEnemy.active = false;
          this.colliderPlayerWeapons.active = false;
          this.colliderEnemyWeapons.active = false;
        },
        onComplete: tween => {
          this.missileActive = true;
          this.colliderPlayerEnemy.active = true;
          this.colliderPlayerWeapons.active = true;
          this.colliderEnemyWeapons.active = true;
        }
      });
    } else {
      player.kill();
      this.infoPanel = this.add.image(400, 300, C.INFOPANEL_OVER);
      this.sound.add(C.AUDIO_OVER, {loop: false}).play();
      this.missileActive === false;
      this.playerActive = false;
      this.ricominciamoText = this.add.dynamicBitmapText(230, 400, C.PV_FONT_NAME, 'clicca per ricominciare', 14 );
      this.input.once('pointerdown', () => {
        this.scene.restart();  
      });
    }
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

      const up = this.cursor.up?.isDown || this.joyStickKeys.up?.isDown;
      const right = this.cursor.right?.isDown || this.joyStickKeys.right?.isDown;
      const down = this.cursor.down?.isDown || this.joyStickKeys.down?.isDown;
      const left = this.cursor.left?.isDown || this.joyStickKeys.left?.isDown;

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
        this.playerWeaponsGroup.fireBullet(this.player.x, this.player.y, 'player', 1000);
      }
  }
}
