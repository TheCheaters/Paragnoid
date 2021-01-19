import { Scene } from 'phaser';
import * as C from '~/constants.json';
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
import Lampo from '~/sprites/weapons/lampo';

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

  constructor() {
    super({
      key: 'game',
      active: false,
    });
  }

  create() {
    console.log('create Game');
    this.player = new Player(this, 100, this.scale.height / 2, C.SPACECRAFT);
    this.shield = new Shield(this);
    this.playerWeaponsGroup = new PlayerWeaponsGroup(this);
    this.enemyWeaponsGroup = new EnemyWeaponsGroup(this);
    this.satelliteWeaponsGroup = new SatelliteWeaponsGroup(this);
    this.enemies = new Enemies(this);
    this.powerups = new Powerups(this);
    this.satellites = new Satellites (this);
    this.explosions = new Explosions(this);
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

    this.scene.launch('ui');
    this.scene.launch('keys-controller');
    this.scene.launch('space');

    const lampo = new Lampo(this, 10, 50, 0.8);
    const armaLampo = lampo.generazione(600, 300, 1000, 300);
    armaLampo.forEach((segmento) => {
      segmento.draw();
    });

  }
}
