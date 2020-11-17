import { Scene } from "phaser";
import WEAPON_TYPES from '~/sprites_and_groups/weapons_types.json';
import WEAPON_LEVELS from '~/sprites_and_groups/weapons_levels.json'
import { PlayerWeapon, EnemyWeapon, Weapon } from './weapon';

type WeaponType = keyof typeof WEAPON_TYPES;
type WeaponLevel = keyof typeof WEAPON_LEVELS; 
export default class WeaponGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene: Scene, classType: Function) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 100,
      setXY: {x: -100, y: -100},
      key: WEAPON_TYPES.DEFAULT.TEXTURE_NAME,
      active: false,
      visible: false,
      classType
    });

  }

  fireBullet(x: number, y: number, weaponType?: WeaponType, weaponLevel?: WeaponLevel) {
    const weapon = this.getFirstDead(false) as PlayerWeapon || EnemyWeapon;
    const pippo = this.getFirstDead(false) as PlayerWeapon || EnemyWeapon;
    if (weapon instanceof EnemyWeapon) {
      weapon.fireEnemy(x, y, weaponType);
    }
    if (weapon instanceof PlayerWeapon) {
      weapon.firePlayer(x, y, weaponType, weaponLevel);
      pippo.firePlayer2(x, y+100, weaponType, weaponLevel);
    }
  }
}