import { Scene } from "phaser";
import WEAPON_PLAYER_TYPES from '~/sprites/player/weapons_player_types.json';
import PlayerWeapon from '~/sprites/player/player-weapon';

type WeaponPlayerType = keyof typeof WEAPON_PLAYER_TYPES;
export default class WeaponGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene: Scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 30,
      setXY: {x: -50, y: -50},
      key: WEAPON_PLAYER_TYPES.DEFAULT.TEXTURE_NAME,
      active: false,
      visible: false,
      classType: PlayerWeapon,
    });
  }

  fire(x: number, y: number, weaponType: WeaponPlayerType, weaponLevel: number) {
    WEAPON_PLAYER_TYPES[weaponType].LEVELS[weaponLevel].ANGLE.forEach((angle) => {
      const weaponPlayer = this.getFirstDead(true) as PlayerWeapon;
      weaponPlayer.fire(x, y, angle, weaponType, weaponLevel);
    })
  }

}