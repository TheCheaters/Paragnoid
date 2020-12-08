import * as C from '~/constants.json';
import { Scene } from 'phaser';
import { PlayerWeapon, EnemyWeapon, SatelliteWeapon } from '~/sprites_and_groups/weapon';
import WeaponGroup from '~/sprites_and_groups/weaponGroup';
import Enemies, { Enemy } from '~/sprites_and_groups/enemies';
import Player from '~/sprites_and_groups/player';
import Shield from '~/sprites_and_groups/shield';
import Explosions from '~/sprites_and_groups/explosions';
import Powerups from '~/sprites_and_groups/powerups';
import handlerPlayerEnemyCollisions from '~/colliders/handlerPlayerEnemyCollisions';
import handlerPlayerWeaponCollisions from '~/colliders/handlerPlayerWeaponCollisions';
import handlerPlayerPowerupCollisions from '~/colliders/handlerPlayerPowerupCollisions';
import handlerMissileEnemyCollisions from '~/colliders/handlerMissileEnemyCollisions';
import Timeline from '~/game_timeline/timeline';
import Lives from '../sprites_and_groups/Lives';
import WEAPON_ENEMY_TYPES from '~/sprites_and_groups/weapons_enemy_types.json';
import Satellites, { Satellite } from '~/sprites_and_groups/satellites';

type WeaponEnemyType = keyof typeof WEAPON_ENEMY_TYPES;
export default class Game extends Scene {
  public player!: Player;
  public satellites!: Satellites;
  public satellite!: Satellite;
  public shield!: Shield;
  public enemies!: Enemies;
  public enemy!: Enemy;
  public playerWeaponsGroup!: WeaponGroup;
  public enemyWeaponsGroup!: WeaponGroup;
  public satelliteWeaponsGroup!: WeaponGroup;
  public explosions!: Explosions;
  public powerups!: Powerups;
  public gfx;
  public colliderPlayerEnemy!: Phaser.Physics.Arcade.Collider;
  public colliderSatelliteEnemy!: Phaser.Physics.Arcade.Collider;
  public colliderPlayerWeapons!: Phaser.Physics.Arcade.Collider;
  public colliderSatellite!: Phaser.Physics.Arcade.Collider;
  public colliderPlayerPowerups!: Phaser.Physics.Arcade.Collider;
  public colliderEnemyWeapons!: Phaser.Physics.Arcade.Collider;
  public colliderSatelliteWeapon!: Phaser.Physics.Arcade.Collider;
  public lives!: Lives;
  public timeline!: Timeline;

  constructor() {
    super({
      key: 'game',
      active: false,
    });
  }

  create() {

    this.player = new Player(this, 100, this.scale.height / 2, C.SPACECRAFT);
    this.shield = new Shield(this);
    this.playerWeaponsGroup = new WeaponGroup(this, PlayerWeapon);
    this.enemyWeaponsGroup = new WeaponGroup(this, EnemyWeapon);
    this.satelliteWeaponsGroup = new WeaponGroup(this, SatelliteWeapon)
    this.enemies = new Enemies(this);
    this.powerups = new Powerups(this);
    this.satellites = new Satellites (this);
    this.explosions = new Explosions(this, C.EXPLOSION);
    this.timeline = new Timeline(this);

    this.lives = new Lives(this, C.SPACECRAFT);

    Object.keys(WEAPON_ENEMY_TYPES).forEach((W) => {
      const WEAPON = W as WeaponEnemyType;
      this.sound.add(WEAPON_ENEMY_TYPES[WEAPON].AUDIO_NAME, {loop: false});
    });

    this.colliderPlayerEnemy = this.physics.add.collider(this.player, this.enemies, handlerPlayerEnemyCollisions as ArcadePhysicsCallback);
    this.colliderSatelliteEnemy = this.physics.add.collider(this.satellites, this.enemies, handlerPlayerEnemyCollisions as ArcadePhysicsCallback);
    this.colliderPlayerWeapons = this.physics.add.collider(this.player, this.enemyWeaponsGroup, handlerPlayerWeaponCollisions as ArcadePhysicsCallback);
    this.colliderSatellite = this.physics.add.collider(this.satellites, this.enemyWeaponsGroup, handlerPlayerWeaponCollisions as ArcadePhysicsCallback);
    this.colliderPlayerPowerups = this.physics.add.collider(this.player, this.powerups, handlerPlayerPowerupCollisions as ArcadePhysicsCallback);
    this.colliderEnemyWeapons = this.physics.add.collider(this.enemies, this.playerWeaponsGroup, handlerMissileEnemyCollisions as ArcadePhysicsCallback);
    this.colliderSatelliteWeapon = this.physics.add.collider(this.enemies, this.satelliteWeaponsGroup, handlerPlayerWeaponCollisions as ArcadePhysicsCallback);
    this.gfx = this.add.graphics();
  }

}
