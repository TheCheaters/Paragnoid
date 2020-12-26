import Weapon from '~/sprites/weapons/weapon';
import Game from '~/scenes/game';
import WEAPON_PLAYER_TYPES from '~/sprites/weapons/weapons_player_types.json';
import { DEFAULT } from '~/sprites/weapons/weapons_enemy_types.json';

type WeaponPlayerType = keyof typeof WEAPON_PLAYER_TYPES;

export default class PlayerWeapon extends Weapon {

  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y);
    this.damage = DEFAULT.DAMAGE;
    this.fireSpeed = DEFAULT.FIRE_SPEED;
    this.textureName = DEFAULT.TEXTURE_NAME;
    this.frameName = DEFAULT.FRAME_NAME;
    this.audioName = DEFAULT.AUDIO_NAME;
    this.audioAssetPath = DEFAULT.AUDIO_ASSET_PATH;
    this.width = DEFAULT.WIDTH;
    this.height = DEFAULT.HEIGHT;
   }

   firePlayer(x: number, y: number, angle: number, weaponType: WeaponPlayerType, weaponLevel: number) {
    const { TEXTURE_NAME, FRAME_NAME, FIRE_SPEED, LEVELS } = WEAPON_PLAYER_TYPES[weaponType];
    const { VERTICAL_OFFSET, GRAVITY_X, GRAVITY_Y } = LEVELS[weaponLevel];
    this.setTexture(TEXTURE_NAME, FRAME_NAME);
    this.fireSpeed = (FIRE_SPEED);
    this.body.enable = true;
    if (angle > 0) {
      this.body.reset(x + 20, y + 5 + VERTICAL_OFFSET);
    } else if (angle < 0){
      this.body.reset(x + 20, y + 5 - VERTICAL_OFFSET);
    } else {
      this.body.reset(x + 20, y + 5);
    }
    this.setActive(true);
    this.setVisible(true);
    this.setVelocityX(this.fireSpeed*Math.cos(Phaser.Math.DegToRad(angle)));
    this.setVelocityY(this.fireSpeed*Math.sin(Phaser.Math.DegToRad(angle)));
    this.scene.sound.play(this.audioName);
    this.setRotation(Phaser.Math.DegToRad(angle));
    this.body.gravity.set(GRAVITY_X, GRAVITY_Y);

  }
}