import { Scene } from "phaser";
import WEAPON_ENEMY_TYPES from '~/sprites/enemies/weapons_enemy_types.json';
import EnemyWeapon from '~/sprites/enemies/enemy-weapon';
import { WeaponEnemyType } from "~/types/weapons";

export default class WeaponGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene: Scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 50,
      setXY: {x: -50, y: -50},
      key: WEAPON_ENEMY_TYPES.DEFAULT.TEXTURE_NAME,
      active: false,
      visible: false,
      classType: EnemyWeapon,
    });
  }

  fire(x: number, y: number, weaponType: WeaponEnemyType) {
    WEAPON_ENEMY_TYPES[weaponType].ANGLE.forEach((angle) => {
      const weaponEnemy = this.getFirstDead(true) as EnemyWeapon;
      weaponEnemy.fire(x, y,angle, WEAPON_ENEMY_TYPES[weaponType].FOLLOW, weaponType);
    })
  }

}