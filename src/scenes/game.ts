import * as C from '~/constants.json';
import { Scene } from 'phaser';
import { PlayerWeapon, EnemyWeapon } from '~/sprites/weapons/weapon';
import WeaponGroup from '~/sprites/weapons/weaponGroup';
import Enemies from '~/sprites/enemies/enemies';
import Player from '~/sprites/player/player';
import Shield from '~/sprites/shield/shield';
import Explosions from '~/sprites/explosions/explosions';
import Powerups from '~/sprites/powerups/powerups';
import handlerPlayerEnemyCollisions from '~/colliders/handlerPlayerEnemyCollisions';
import handlerPlayerWeaponCollisions from '~/colliders/handlerPlayerWeaponCollisions';
import handlerPlayerPowerupCollisions from '~/colliders/handlerPlayerPowerupCollisions';
import handlerMissileEnemyCollisions from '~/colliders/handlerMissileEnemyCollisions';
import Timeline from '~/game_timeline/timeline';
import Lives from '~/sprites/player/lives';
import WEAPON_ENEMY_TYPES from '~/sprites/weapons/weapons_enemy_types.json';
import Satellites from '~/sprites/satellites/satellites';
import Space from '~/scenes/space';

type WeaponEnemyType = keyof typeof WEAPON_ENEMY_TYPES;
export default class Game extends Scene {
  public player!: Player;
  public satellites!: Satellites;
  public shield!: Shield;
  public enemies!: Enemies;
  public playerWeaponsGroup!: WeaponGroup;
  public enemyWeaponsGroup!: WeaponGroup;
  public PlayerWeapon1Level1Group!: WeaponGroup;
  public explosions!: Explosions;
  public powerups!: Powerups;
  public colliderPlayerEnemy!: Phaser.Physics.Arcade.Collider;
  public colliderSatelliteEnemy!: Phaser.Physics.Arcade.Collider;
  public colliderPlayerWeapons!: Phaser.Physics.Arcade.Collider;
  public colliderSatelliteWeapons!: Phaser.Physics.Arcade.Collider;
  public colliderPlayerPowerups!: Phaser.Physics.Arcade.Collider;
  public colliderEnemyWeapons!: Phaser.Physics.Arcade.Collider;
  public colliderEnemyWeapons1Lvl1!: Phaser.Physics.Arcade.Collider;
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
    this.PlayerWeapon1Level1Group = new WeaponGroup(this, PlayerWeapon);
    this.enemies = new Enemies(this);
    this.powerups = new Powerups(this);
    this.satellites = new Satellites (this);
    this.explosions = new Explosions(this);
    this.timeline = new Timeline(this);

    this.lives = new Lives(this, C.SPACECRAFT);

    Object.keys(WEAPON_ENEMY_TYPES).forEach((W) => {
      const WEAPON = W as WeaponEnemyType;
      this.sound.add(WEAPON_ENEMY_TYPES[WEAPON].AUDIO_NAME, {loop: false});
    });

    this.colliderPlayerEnemy = this.physics.add.collider(this.player, this.enemies, handlerPlayerEnemyCollisions as ArcadePhysicsCallback);
    this.colliderSatelliteEnemy = this.physics.add.collider(this.satellites, this.enemies, handlerPlayerEnemyCollisions as ArcadePhysicsCallback);
    this.colliderPlayerWeapons = this.physics.add.collider(this.player, this.enemyWeaponsGroup, handlerPlayerWeaponCollisions as ArcadePhysicsCallback);
    this.colliderSatelliteWeapons = this.physics.add.collider(this.satellites, this.enemyWeaponsGroup, handlerPlayerWeaponCollisions as ArcadePhysicsCallback);
    this.colliderPlayerPowerups = this.physics.add.collider(this.player, this.powerups, handlerPlayerPowerupCollisions as ArcadePhysicsCallback);
    this.colliderEnemyWeapons = this.physics.add.collider(this.enemies, this.playerWeaponsGroup, handlerMissileEnemyCollisions as ArcadePhysicsCallback);
    this.colliderEnemyWeapons1Lvl1 = this.physics.add.collider(this.enemies, this.PlayerWeapon1Level1Group, handlerMissileEnemyCollisions as ArcadePhysicsCallback);

    this.scene.launch('ui');
    const space = this.scene.get('space') as Space;
    space.scene.start();
    space.startTimeline();
  }
}
