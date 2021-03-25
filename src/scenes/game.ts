import { Scene } from 'phaser';
import PlayerWeaponsGroup from '~/sprites/player/player-weapon-group';
import EnemyWeaponsGroup from '~/sprites/enemies/enemy-weapon-group';
import SatelliteWeaponsGroup from '~/sprites/satellites/satellite-weapon-group';
import Enemies from '~/sprites/enemies/enemies';
import Enemy from '~/sprites/enemies/enemy';
import Player from '~/sprites/player/player';
import Shield from '~/sprites/shield/shield';
import Explosions from '~/sprites/explosions/explosions';
import Powerups from '~/sprites/powerups/powerups';
import handlerPlayerEnemyCollisions from '~/colliders/handlerPlayerEnemyCollisions';
import handlerPlayerWeaponCollisions from '~/colliders/handlerPlayerWeaponCollisions';
import handlerPlayerPowerupCollisions from '~/colliders/handlerPlayerPowerupCollisions';
import handlerMissileEnemyCollisions from '~/colliders/handlerMissileEnemyCollisions';
import Lives from '~/sprites/player/lives';
import WEAPON_ENEMY_TYPES from '~/sprites/enemies/weapons_enemy_types.json';
import Satellites, { Satellite } from '~/sprites/satellites/satellites';
import { SCREEN_WIDTH, SCREEN_HEIGHT, CAMERA_WIDTH, CAMERA_HEIGHT, ENERGY_BAR_HEIGHT } from '~/configurations/game.json';

type WeaponEnemyType = keyof typeof WEAPON_ENEMY_TYPES;
export default class Game extends Scene {
  public player!: Player;
  public satellites!: Satellites;
  public satellite!: Satellite;
  public shield!: Shield;
  public enemies!: Enemies;
  public enemy!: Enemy;
  public playerWeaponsGroup!: PlayerWeaponsGroup;
  public enemyWeaponsGroup!: EnemyWeaponsGroup;
  public satelliteWeaponsGroup!: SatelliteWeaponsGroup;
  public explosions!: Explosions;
  public powerups!: Powerups;
  public colliderPlayerEnemy!: Phaser.Physics.Arcade.Collider;
  public colliderSatelliteEnemy!: Phaser.Physics.Arcade.Collider;
  public colliderPlayerWeapons!: Phaser.Physics.Arcade.Collider;
  public colliderSatellite!: Phaser.Physics.Arcade.Collider;
  public colliderPlayerPowerups!: Phaser.Physics.Arcade.Collider;
  public colliderEnemyWeapons!: Phaser.Physics.Arcade.Collider;
  public colliderSatelliteWeapon!: Phaser.Physics.Arcade.Collider;
  public lives!: Lives;
  public mainCamera!: Phaser.Cameras.Scene2D.Camera;

  constructor() {
    super({
      key: 'game',
      active: false,
    });
  }

  create() {
    console.log('create Game');
    this.player = new Player(this);
    this.shield = new Shield(this);
    this.playerWeaponsGroup = new PlayerWeaponsGroup(this);
    this.enemyWeaponsGroup = new EnemyWeaponsGroup(this);
    this.satelliteWeaponsGroup = new SatelliteWeaponsGroup(this);
    this.enemies = new Enemies(this);
    this.powerups = new Powerups(this);
    this.satellites = new Satellites (this);
    this.explosions = new Explosions(this);
    this.lives = new Lives(this);

    this.colliderPlayerEnemy = this.physics.add.collider(this.player, this.enemies, handlerPlayerEnemyCollisions as ArcadePhysicsCallback);
    this.colliderPlayerWeapons = this.physics.add.collider(this.player, this.enemyWeaponsGroup, handlerPlayerWeaponCollisions as ArcadePhysicsCallback);
    this.colliderPlayerPowerups = this.physics.add.collider(this.player, this.powerups, handlerPlayerPowerupCollisions as ArcadePhysicsCallback);
    this.colliderEnemyWeapons = this.physics.add.collider(this.enemies, this.playerWeaponsGroup, handlerMissileEnemyCollisions as ArcadePhysicsCallback);
    this.colliderSatelliteWeapon = this.physics.add.collider(this.enemies, this.satelliteWeaponsGroup, handlerPlayerWeaponCollisions as ArcadePhysicsCallback);

    const xBound = (CAMERA_WIDTH - SCREEN_WIDTH) / 2;
    const yBound = (CAMERA_HEIGHT - SCREEN_HEIGHT) / 2;

    this.mainCamera = this.cameras.main;
    this.mainCamera.setBounds(-xBound, -yBound, CAMERA_WIDTH, CAMERA_HEIGHT).setName('main');
    this.mainCamera.startFollow(this.player, false, 0.2, 0.2);
    this.physics.world.setBounds(-xBound, -yBound, CAMERA_WIDTH, CAMERA_HEIGHT - ENERGY_BAR_HEIGHT);

    this.scene.launch('ui');
    this.scene.launch('keys-controller');
    this.scene.launch('space');
  }
}
