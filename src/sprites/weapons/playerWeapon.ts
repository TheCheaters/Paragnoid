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

    this.setTexture(WEAPON_PLAYER_TYPES[weaponType].TEXTURE_NAME, WEAPON_PLAYER_TYPES[weaponType].FRAME_NAME);
    this.fireSpeed = (WEAPON_PLAYER_TYPES[weaponType].FIRE_SPEED);
    this.body.enable = true;
    if (angle > 0) {
      this.body.reset(x + 20, y+5+WEAPON_PLAYER_TYPES[weaponType].LEVELS[weaponLevel].VERTICAL_OFFSET);
    } else if (angle < 0){
      this.body.reset(x + 20, y+5-WEAPON_PLAYER_TYPES[weaponType].LEVELS[weaponLevel].VERTICAL_OFFSET);
    } else {
      this.body.reset(x + 20, y+5);
    }
    this.setActive(true);
    this.setVisible(true);
    this.setVelocityX(this.fireSpeed*Math.cos(Phaser.Math.DegToRad(angle)));
    this.setVelocityY(this.fireSpeed*Math.sin(Phaser.Math.DegToRad(angle)));
    this.scene.sound.play(this.audioName);
    this.setRotation(Phaser.Math.DegToRad(angle));
    this.body.gravity.set(WEAPON_PLAYER_TYPES[weaponType].LEVELS[weaponLevel].GRAVITY_X, WEAPON_PLAYER_TYPES[weaponType].LEVELS[weaponLevel].GRAVITY_Y);

  }
}