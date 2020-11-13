import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';
import * as C from '~/constants.json';
import { Scene } from 'phaser';
import { PlayerWeapon, EnemyWeapon } from '~/scenes/weapon';
import WeaponGroup from '~/scenes/weaponGroup';
import Enemies, { Enemy } from '~/scenes/enemies';
import Player from '~/scenes/player';
import Explosions from '~/scenes/explosions';

import Timeline from '~/scenes/timeline';
import Lives from './Lives';


export default class Game extends Scene {
  public player!: Player;
  public enemies!: Enemies;
  public playerWeaponsGroup!: WeaponGroup;
  public enemyWeaponsGroup!: WeaponGroup;
  private explosions!: Explosions;
  private infoPanel;
  private missileActive = true;
  public playerActive = true;
  public colliderPlayerEnemy!: Phaser.Physics.Arcade.Collider;
  public colliderPlayerWeapons!: Phaser.Physics.Arcade.Collider;
  public colliderEnemyWeapons!: Phaser.Physics.Arcade.Collider;
  private score = 0;
  private scoreText!: Phaser.GameObjects.DynamicBitmapText;
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

    this.sound.add(C.AUDIO_MISSILE, {loop: false});

    this.player = new Player(this, 100, this.scale.height / 2, C.SPACECRAFT);
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
        onStart: () => {
          this.missileActive = true;
          this.colliderPlayerEnemy.active = false;
          this.colliderPlayerWeapons.active = false;
          this.colliderEnemyWeapons.active = true;
        },
        onComplete: () => {
          this.missileActive = true;
          this.colliderPlayerEnemy.active = true;
          this.colliderPlayerWeapons.active = true;
          this.colliderEnemyWeapons.active = true;
        }
      });
    } else {
      player.kill();
      this.infoPanel = this.add.image(this.scale.width / 2, this.scale.height / 2, C.INFOPANEL_OVER);
      this.sound.add(C.AUDIO_OVER, {loop: false}).play();
      this.missileActive === false;
      this.playerActive = false;
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

}
