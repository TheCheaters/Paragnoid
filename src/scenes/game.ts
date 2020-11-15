import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';
import * as C from '~/constants.json';
import { Scene } from 'phaser';
import { PlayerWeapon, EnemyWeapon } from '~/sprites_and_groups/weapon';
import WeaponGroup from '~/sprites_and_groups/weaponGroup';
import Enemies from '~/sprites_and_groups/enemies';
import Player from '~/sprites_and_groups/player';
import Explosions from '~/sprites_and_groups/explosions';
import playerEnemyCollision from '~/colliders/handlerPlayerEnemyCollisions';
import missileEnemyCollision from '~/colliders/handlerMissileEnemyCollisions';
import Timeline from '~/game_timeline/timeline';
import Lives from '../sprites_and_groups/Lives';
import ENEMY_TYPES from '~/sprites_and_groups/enemy_types.json';

type EnemyType = keyof typeof ENEMY_TYPES;
export default class Game extends Scene {
  public player!: Player;
  public enemies!: Enemies;
  public playerWeaponsGroup!: WeaponGroup;
  public enemyWeaponsGroup!: WeaponGroup;
  public explosions!: Explosions;
  public colliderPlayerEnemy!: Phaser.Physics.Arcade.Collider;
  public colliderPlayerWeapons!: Phaser.Physics.Arcade.Collider;
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
    this.load.image(C.MISSILE, C.MISSILE_ASSET_PATH);

    Object.keys(ENEMY_TYPES).forEach((E) => {
      const ENEMY = E as EnemyType;
      this.load.image(ENEMY_TYPES[ENEMY].TEXTURE_NAME, ENEMY_TYPES[ENEMY].SPRITE_ASSET_PATH);
    });

    this.load.bitmapFont(C.PV_FONT_NAME, C.PV_FONT_PATH, C.PV_FONT_XML_PATH);
    this.load.audio(C.AUDIO_MISSILE, C.AUDIO_MISSILE_PATH);
  }

  create() {

    this.player = new Player(this, 100, this.scale.height / 2, C.SPACECRAFT);
    this.playerWeaponsGroup = new WeaponGroup(this, C.MISSILE, PlayerWeapon);
    this.enemyWeaponsGroup = new WeaponGroup(this, C.MISSILE, EnemyWeapon);
    this.enemies = new Enemies(this);
    this.explosions = new Explosions(this, C.EXPLOSION);
    this.timeline = new Timeline(this);

    this.scoreText = this.add.dynamicBitmapText(16, 16, C.PV_FONT_NAME, 'Score: 0', 14 );

    this.lives = new Lives(this, C.SPACECRAFT);
    this.sound.add(C.AUDIO_MISSILE, {loop: false});

    const handlerPlayerEnemyCollisions = playerEnemyCollision(this) as ArcadePhysicsCallback;
    const handlerMissileEnemyCollisions = missileEnemyCollision(this) as ArcadePhysicsCallback;

    this.colliderPlayerEnemy = this.physics.add.collider(this.player, this.enemies, handlerPlayerEnemyCollisions.bind(this));
    this.colliderPlayerWeapons = this.physics.add.collider(this.player, this.enemyWeaponsGroup, handlerPlayerEnemyCollisions.bind(this));
    this.colliderEnemyWeapons = this.physics.add.collider (this.enemies, this.playerWeaponsGroup, handlerMissileEnemyCollisions.bind(this));

    // inizia il gioco
    this.timeline.start();

  }

}
