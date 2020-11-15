import { Scene } from "phaser";
import WEAPON_TYPES from '~/sprites_and_groups/weapons_types.json';
import { PlayerWeapon, EnemyWeapon } from './weapon';

type WeaponType = keyof typeof WEAPON_TYPES;
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

  fireBullet(x: number, y: number, weaponType?: WeaponType) {
    const weapon = this.getFirstDead(false) as PlayerWeapon || EnemyWeapon;
    if (weapon instanceof EnemyWeapon) {
      weapon.fire(x, y, weaponType);
    }
    if (weapon instanceof PlayerWeapon) {
      weapon.fire(x, y);
    }
  }
}