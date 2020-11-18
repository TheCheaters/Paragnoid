import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';
import * as C from '~/constants.json';
import { Scene } from 'phaser';
import { PlayerWeapon, EnemyWeapon } from '~/sprites_and_groups/weapon';
import WeaponGroup from '~/sprites_and_groups/weaponGroup';
import Enemies from '~/sprites_and_groups/enemies';
import Player from '~/sprites_and_groups/player';
import Explosions from '~/sprites_and_groups/explosions';
import Powerups from '~/sprites_and_groups/powerups';
import playerEnemyCollision from '~/colliders/handlerPlayerEnemyCollisions';
import missileEnemyCollision from '~/colliders/handlerMissileEnemyCollisions';
import playerPowerupCollision from '~/colliders/handlerPlayerPowerupCollisions';
import Timeline from '~/game_timeline/timeline';
import Lives from '../sprites_and_groups/Lives';
import ENEMY_TYPES from '~/sprites_and_groups/enemy_types.json';
import WEAPON_TYPES from '~/sprites_and_groups/weapons_types.json';
import { POWERUP, POWERUP_ASSET_PATH } from '~/constants.json';

type EnemyType = keyof typeof ENEMY_TYPES;
type WeaponType = keyof typeof WEAPON_TYPES;

export default class Game extends Scene {
  public player!: Player;
  public enemies!: Enemies;
  public playerWeaponsGroup!: WeaponGroup;
  public enemyWeaponsGroup!: WeaponGroup;
  public explosions!: Explosions;
  public powerups!: Powerups;
  public colliderPlayerEnemy!: Phaser.Physics.Arcade.Collider;
  public colliderPlayerWeapons!: Phaser.Physics.Arcade.Collider;
  public colliderPlayerPowerups!: Phaser.Physics.Arcade.Collider;
  public colliderEnemyWeapons!: Phaser.Physics.Arcade.Collider;
  public score = 0;
  public scoreText!: Phaser.GameObjects.DynamicBitmapText;
  public lives!: Lives;
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

    this.load.spritesheet(POWERUP, POWERUP_ASSET_PATH, {
      frameWidth: 60,
      frameHeight: 60
    });

    // Carica tutti gli sprite di Enemies
    Object.keys(ENEMY_TYPES).forEach((E) => {
      const ENEMY = E as EnemyType;
      this.load.image(ENEMY_TYPES[ENEMY].TEXTURE_NAME, ENEMY_TYPES[ENEMY].SPRITE_ASSET_PATH);
    });

    // Carica tutti gli sprite e i suoni di Weapons
    Object.keys(WEAPON_TYPES).forEach((W) => {
      const WEAPON = W as WeaponType;
      this.load.image(WEAPON_TYPES[WEAPON].TEXTURE_NAME, WEAPON_TYPES[WEAPON].SPRITE_ASSET_PATH);
      this.load.audio(WEAPON_TYPES[WEAPON].AUDIO_NAME, WEAPON_TYPES[WEAPON].AUDIO_ASSET_PATH);
    });
    
    this.load.audio(C.HIT_ENEMY, C.HIT_ENEMY_ASSET_PATH);
    this.load.audio(C.AUDIO_EXPLOSION, C.AUDIO_EXPLOSION_ASSET_PATH);

    this.load.bitmapFont(C.PV_FONT_NAME, C.PV_FONT_PATH, C.PV_FONT_XML_PATH);
  }

  create() {

    this.player = new Player(this, 100, this.scale.height / 2, C.SPACECRAFT);
    this.playerWeaponsGroup = new WeaponGroup(this, PlayerWeapon);
    this.enemyWeaponsGroup = new WeaponGroup(this, EnemyWeapon);
    this.enemies = new Enemies(this);
    this.powerups = new Powerups(this);
    this.explosions = new Explosions(this, C.EXPLOSION);
    this.timeline = new Timeline(this);

    this.scoreText = this.add.dynamicBitmapText(16, 16, C.PV_FONT_NAME, 'Score: 0', 14 );

    this.lives = new Lives(this, C.SPACECRAFT);

    Object.keys(WEAPON_TYPES).forEach((W) => {
      const WEAPON = W as WeaponType;
      this.sound.add(WEAPON_TYPES[WEAPON].AUDIO_NAME, {loop: false});
    });

    const handlerPlayerEnemyCollisions = playerEnemyCollision(this) as ArcadePhysicsCallback;
    const handlerMissileEnemyCollisions = missileEnemyCollision(this) as ArcadePhysicsCallback;
    const handlerPlayerPowerupCollisions = playerPowerupCollision(this) as ArcadePhysicsCallback;

    this.colliderPlayerEnemy = this.physics.add.collider(this.player, this.enemies, handlerPlayerEnemyCollisions.bind(this));
    this.colliderPlayerWeapons = this.physics.add.collider(this.player, this.enemyWeaponsGroup, handlerPlayerEnemyCollisions.bind(this));
    this.colliderPlayerPowerups = this.physics.add.collider(this.player, this.powerups, handlerPlayerPowerupCollisions.bind(this));
    this.colliderEnemyWeapons = this.physics.add.collider (this.enemies, this.playerWeaponsGroup, handlerMissileEnemyCollisions.bind(this));

    // inizia il gioco
    this.timeline.start();

  }

}
