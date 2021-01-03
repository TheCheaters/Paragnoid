import { Scene } from "phaser";
import WEAPON_SATELLITE_TYPES from '~/sprites/satellites/weapons_satellite_types.json';
import SatelliteWeapon from '~/sprites/satellites/satellite-weapon';
import { WeaponSatelliteType } from "~/types/weapons";
export default class WeaponGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene: Scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 10,
      setXY: {x: -50, y: -50},
      key: WEAPON_SATELLITE_TYPES.DEFAULT.TEXTURE_NAME,
      active: false,
      visible: false,
      classType: SatelliteWeapon,
    });
  }

  fire({ x, y, weaponType, follow }: { x: number; y: number; weaponType: WeaponSatelliteType; follow: number; }){
    const weaponSatellite = this.getFirstDead(true) as SatelliteWeapon;
    weaponSatellite.fire(x, y, 0, follow, weaponType);
  }

}