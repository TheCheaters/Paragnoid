import { Scene } from "phaser";
import WEAPON_ENEMY_TYPES from '~/sprites/weapons/weapons_enemy_types.json';
import WEAPON_PLAYER_TYPES from '~/sprites/weapons/weapons_player_types.json';
import WEAPON_SATELLITE_TYPES from '~/sprites/weapons/weapons_satellite_types.json';
import PlayerWeapon from '~/sprites/weapons/PlayerWeapon';
import EnemyWeapon from '~/sprites/weapons/enemyWeapon';
import SatelliteWeapon from '~/sprites/weapons/satelliteWeapon';

type WeaponEnemyType = keyof typeof WEAPON_ENEMY_TYPES;
type WeaponPlayerType = keyof typeof WEAPON_PLAYER_TYPES;
type WeaponSatelliteType = keyof typeof WEAPON_SATELLITE_TYPES;
export default class WeaponGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene: Scene, classType: Function) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 30,
      setXY: {x: -50, y: -50},
      key: WEAPON_ENEMY_TYPES.DEFAULT.TEXTURE_NAME,
      active: false,
      visible: false,
      classType,
    });
  }

  fireBulletEnemy(x: number, y: number, weaponType: WeaponEnemyType) {
    WEAPON_ENEMY_TYPES[weaponType].ANGLE.forEach((angle) => {
      const weaponEnemy = this.getFirstDead(true) as EnemyWeapon;
      weaponEnemy.fireEnemy(x, y,angle, WEAPON_ENEMY_TYPES[weaponType].FOLLOW, weaponType);
    })
  }

  fireBulletPlayer(x: number, y: number, weaponType: WeaponPlayerType, weaponLevel: number) {
    WEAPON_PLAYER_TYPES[weaponType].LEVELS[weaponLevel].ANGLE.forEach((angle) => {
      const weaponPlayer = this.getFirstDead(true) as PlayerWeapon;
      weaponPlayer.firePlayer(x, y, angle, weaponType, weaponLevel);
    })
  }

  fireBulletSatellite({ x, y, weaponType, follow }: { x: number; y: number; weaponType: WeaponSatelliteType; follow: number; }){
    const weaponSatellite = this.getFirstDead(true) as SatelliteWeapon;
    weaponSatellite.fireSatellite(x, y, 0, follow, weaponType);
  }

}