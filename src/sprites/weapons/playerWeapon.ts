import Weapon from '~/sprites/weapons/weapon';
import Game from '~/scenes/game';
import WEAPON_PLAYER_TYPES from '~/sprites/weapons/weapons_player_types.json';

type WeaponPlayerType = keyof typeof WEAPON_PLAYER_TYPES;

export default class PlayerWeapon extends Weapon {

  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y);
   }

   firePlayer(x: number, y: number, angle: number, weaponType: WeaponPlayerType, weaponLevel: number) {
    const { TEXTURE_NAME, FRAME_NAME, FIRE_SPEED, LEVELS, AUDIO_NAME, WIDTH, HEIGHT, SCALE } = WEAPON_PLAYER_TYPES[weaponType];
    const { VERTICAL_OFFSET, GRAVITY_X, GRAVITY_Y } = LEVELS[weaponLevel];
    let _x = x;
    let _y = y;
    if (angle > 0) {
      _x = x + 20;
      _y = y + 5 + VERTICAL_OFFSET;
    } else if (angle < 0){
      _x = x + 20;
      _y = y + 5 - VERTICAL_OFFSET;
    } else {
      _x = x + 20;
      _y = y + 5;
    }
    // this.setOrigin(0, 0.5); // TODO: spostare in make
    this.make(TEXTURE_NAME, FRAME_NAME, AUDIO_NAME, _x, _y, WIDTH, HEIGHT, SCALE, false);
    this.fireSpeed = (FIRE_SPEED);
    this.setVelocityX(this.fireSpeed*Math.cos(Phaser.Math.DegToRad(angle)));
    this.setVelocityY(this.fireSpeed*Math.sin(Phaser.Math.DegToRad(angle)));
    this.setRotation(Phaser.Math.DegToRad(angle));
    this.body.gravity.set(GRAVITY_X, GRAVITY_Y);
  }
}