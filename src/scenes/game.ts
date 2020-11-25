import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';
import * as C from '~/constants.json';
import { Scene } from 'phaser';
import { PlayerWeapon, EnemyWeapon } from '~/sprites_and_groups/weapon';
import WeaponGroup from '~/sprites_and_groups/weaponGroup';
import Enemies from '~/sprites_and_groups/enemies';
import Player from '~/sprites_and_groups/player';
import Shield from '~/sprites_and_groups/shield';
import Explosions from '~/sprites_and_groups/explosions';
import Powerups from '~/sprites_and_groups/powerups';
import handlerPlayerEnemyCollisions from '~/colliders/handlerPlayerEnemyCollisions';
import handlerPlayerWeaponCollisions from '~/colliders/handlerPlayerWeaponCollisions';
import handlerPlayerPowerupCollisions from '~/colliders/handlerPlayerPowerupCollisions';
import missileEnemyCollision from '~/colliders/handlerMissileEnemyCollisions';
import Timeline from '~/game_timeline/timeline';
import Lives from '../sprites_and_groups/Lives';
import ENEMY_TYPES from '~/sprites_and_groups/enemy_types.json';
import { POWERUP, POWERUP_ASSET_PATH } from '~/constants.json';

import WEAPON_ENEMY_TYPES from '~/sprites_and_groups/weapons_enemy_types.json';
import WEAPON_PLAYER_TYPES from '~/sprites_and_groups/weapons_player_types.json';
import ENEMY_PATHS from '~/sprites_and_groups/enemy_paths.json';

type EnemyType = keyof typeof ENEMY_TYPES;
type WeaponEnemyType = keyof typeof WEAPON_ENEMY_TYPES;
type WeaponPlayerType = keyof typeof WEAPON_PLAYER_TYPES;
type PathTypes = keyof typeof ENEMY_PATHS;

export default class Game extends Scene {
  public player!: Player;
  public shield!: Shield;
  public enemies!: Enemies;
  public playerWeaponsGroup!: WeaponGroup;
  public enemyWeaponsGroup!: WeaponGroup;
  public PlayerWeapon1Level1Group!: WeaponGroup;
  public explosions!: Explosions;
  public powerups!: Powerups;
  public colliderPlayerEnemy!: Phaser.Physics.Arcade.Collider;
  public colliderPlayerWeapons!: Phaser.Physics.Arcade.Collider;
  public colliderPlayerPowerups!: Phaser.Physics.Arcade.Collider;
  public colliderEnemyWeapons!: Phaser.Physics.Arcade.Collider;
  public colliderEnemyWeapons1Lvl1!: Phaser.Physics.Arcade.Collider;
  public colliderEnemyWeapons1Lvl2!: Phaser.Physics.Arcade.Collider;
  public colliderEnemyWeapons1Lvl3!: Phaser.Physics.Arcade.Collider;
  public colliderEnemyWeapons1Lvl4!: Phaser.Physics.Arcade.Collider;
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
      frameWidth: C.SPACECRAFT_FRAME_WIDTH,
      frameHeight: C.SPACECRAFT_FRAME_HEIGH,
    });
    this.load.image(C.BLUE_PARTICLE, C.BLUE_PARTICLE_ASSET_PATH);
    this.load.atlas(C.FLARES, C.FLARES_ASSET_PATH, C.FLARES_JSON_ASSET_PATH);
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
    Object.keys(WEAPON_ENEMY_TYPES).forEach((W) => {
      const WEAPON = W as WeaponEnemyType;
      this.load.image(WEAPON_ENEMY_TYPES[WEAPON].TEXTURE_NAME, WEAPON_ENEMY_TYPES[WEAPON].SPRITE_ASSET_PATH);
      this.load.audio(WEAPON_ENEMY_TYPES[WEAPON].AUDIO_NAME, WEAPON_ENEMY_TYPES[WEAPON].AUDIO_ASSET_PATH);
    });

    //Carica tutti gli sprite ed i suoni del Player
    Object.keys(WEAPON_PLAYER_TYPES).forEach((P) =>{
      const PLAYER = P as WeaponPlayerType;
      this.load.image(WEAPON_PLAYER_TYPES[PLAYER].TEXTURE_NAME, WEAPON_PLAYER_TYPES[PLAYER].SPRITE_ASSET_PATH);
      this.load.audio(WEAPON_PLAYER_TYPES[PLAYER].AUDIO_NAME, WEAPON_PLAYER_TYPES[PLAYER].AUDIO_ASSET_PATH);
    });

    this.load.audio(C.HIT_ENEMY, C.HIT_ENEMY_ASSET_PATH);
    this.load.audio(C.AUDIO_EXPLOSION, C.AUDIO_EXPLOSION_ASSET_PATH);

    this.load.bitmapFont(C.PV_FONT_NAME, C.PV_FONT_PATH, C.PV_FONT_XML_PATH);
  }

  create() {

    this.player = new Player(this, 100, this.scale.height / 2, C.SPACECRAFT);
    this.shield = new Shield(this);
    this.playerWeaponsGroup = new WeaponGroup(this, PlayerWeapon);
    this.enemyWeaponsGroup = new WeaponGroup(this, EnemyWeapon);
    this.PlayerWeapon1Level1Group = new WeaponGroup(this, PlayerWeapon);
    this.enemies = new Enemies(this);
    this.powerups = new Powerups(this);
    this.explosions = new Explosions(this, C.EXPLOSION);
    this.timeline = new Timeline(this);

    this.scoreText = this.add.dynamicBitmapText(16, 16, C.PV_FONT_NAME, 'Score: 0', 14 );

    this.lives = new Lives(this, C.SPACECRAFT);

    Object.keys(WEAPON_ENEMY_TYPES).forEach((W) => {
      const WEAPON = W as WeaponEnemyType;
      this.sound.add(WEAPON_ENEMY_TYPES[WEAPON].AUDIO_NAME, {loop: false});
    });

    const handlerMissileEnemyCollisions = missileEnemyCollision(this) as ArcadePhysicsCallback;

    this.colliderPlayerEnemy = this.physics.add.collider(this.player, this.enemies, handlerPlayerEnemyCollisions as ArcadePhysicsCallback);
    this.colliderPlayerWeapons = this.physics.add.collider(this.player, this.enemyWeaponsGroup, handlerPlayerWeaponCollisions as ArcadePhysicsCallback);
    this.colliderPlayerPowerups = this.physics.add.collider(this.player, this.powerups, handlerPlayerPowerupCollisions as ArcadePhysicsCallback);
    this.colliderEnemyWeapons = this.physics.add.collider(this.enemies, this.playerWeaponsGroup, handlerMissileEnemyCollisions.bind(this));
    this.colliderEnemyWeapons1Lvl1 = this.physics.add.collider(this.enemies, this.PlayerWeapon1Level1Group, handlerMissileEnemyCollisions.bind(this));
    

    // inizia il gioco
    this.timeline.start();

  }

}
