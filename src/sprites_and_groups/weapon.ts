import { Scene } from "phaser";
import Game from '../scenes/game';
import { DEFAULT } from '~/sprites_and_groups/weapons_enemy_types.json';
import WEAPON_ENEMY_TYPES from '~/sprites_and_groups/weapons_enemy_types.json';
import WEAPON_PLAYER_TYPES from '~/sprites_and_groups/weapons_player_types.json';
import { BLUE_PARTICLE, FLARES, SPACECRAFT_FRAME_WIDTH, SPACECRAFT_FRAME_HEIGH } from '~/constants.json';
import Player from './player';

type WeaponEnemyType = keyof typeof WEAPON_ENEMY_TYPES;
type WeaponPlayerType = keyof typeof WEAPON_PLAYER_TYPES;
export class Weapon extends Phaser.Physics.Arcade.Sprite {

  DAMAGE = DEFAULT.DAMAGE;
  FIRE_SPEED = DEFAULT.FIRE_SPEED;
  TEXTURE_NAME = DEFAULT.TEXTURE_NAME;
  SPRITE_ASSET_PATH = DEFAULT.SPRITE_ASSET_PATH;
  AUDIO_NAME = DEFAULT.AUDIO_NAME;
  AUDIO_ASSET_PATH = DEFAULT.AUDIO_ASSET_PATH;
  WIDTH = DEFAULT.WIDTH;
  HEIGHT = DEFAULT.HEIGHT;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, DEFAULT.TEXTURE_NAME);
    
  }

  explode() {
    const { explosions } = this.scene as Game;
    explosions.addExplosion(this.x, this.y);
    this.kill();
  }

  kill() {
    this.body.enable = false;
    this.setActive(false);
    this.setVisible(false);
  }

  setWeaponTexture(texture: string) {
    this.setTexture(texture);
  }

	preUpdate(time: number, delta: number) {
		super.preUpdate(time, delta);

		if (this.x > this.scene.scale.width || this.x < -200) this.kill();
	}
}

export class PlayerWeapon extends Weapon {
 
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y);
    this.DAMAGE = DEFAULT.DAMAGE;
    this.FIRE_SPEED = DEFAULT.FIRE_SPEED;
    this.TEXTURE_NAME = DEFAULT.TEXTURE_NAME;
    this.SPRITE_ASSET_PATH = DEFAULT.SPRITE_ASSET_PATH;
    this.AUDIO_NAME = DEFAULT.AUDIO_NAME;
    this.AUDIO_ASSET_PATH = DEFAULT.AUDIO_ASSET_PATH;
    this.WIDTH = DEFAULT.WIDTH;
    this.HEIGHT = DEFAULT.HEIGHT;
   }

   firePlayer(x: number, y: number, angle: number, weaponType: WeaponPlayerType, weaponLevel:number) { 
    
    this.setTexture(WEAPON_PLAYER_TYPES[weaponType].TEXTURE_NAME);
    this.FIRE_SPEED = (WEAPON_PLAYER_TYPES[weaponType].FIRE_SPEED);
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
    this.setVelocityX(this.FIRE_SPEED*Math.cos(Phaser.Math.DegToRad(angle)));
    this.setVelocityY(this.FIRE_SPEED*Math.sin(Phaser.Math.DegToRad(angle)));
    this.scene.sound.play(this.AUDIO_NAME);
    this.setRotation(Phaser.Math.DegToRad(angle));
    this.body.gravity.set(WEAPON_PLAYER_TYPES[weaponType].LEVELS[weaponLevel].GRAVITY_X, WEAPON_PLAYER_TYPES[weaponType].LEVELS[weaponLevel].GRAVITY_Y);

  }
}

export class EnemyWeapon extends Weapon {
  fireEnemy(x: number, y: number, angle: number, follow: number, weaponType: WeaponEnemyType) {
    this.setWeaponTexture(WEAPON_ENEMY_TYPES[weaponType].TEXTURE_NAME);
    this.DAMAGE = (WEAPON_ENEMY_TYPES[weaponType].DAMAGE);
    this.FIRE_SPEED = -(WEAPON_ENEMY_TYPES[weaponType].FIRE_SPEED);    
    this.body.enable = true;
    this.body.enable = true;
    this.body.reset(x + 2, y + 20);
    this.setActive(true);
    this.setVisible(true);    
    this.scene.sound.play(this.AUDIO_NAME);    
    if (follow === 0){
      this.setVelocityX(this.FIRE_SPEED*Math.cos(Phaser.Math.DegToRad(angle)));
      this.setVelocityY(this.FIRE_SPEED*Math.sin(Phaser.Math.DegToRad(angle)));
      this.setRotation(Phaser.Math.DegToRad(angle));
    }
    if (follow === 1){
      const { player } = this.scene as Game;
      this.setVelocityX(this.FIRE_SPEED*Math.cos(Phaser.Math.DegToRad(angle)));
      this.setVelocityY(this.FIRE_SPEED*Math.sin(Phaser.Math.DegToRad(angle)));
      this.scene.physics.moveToObject(this, player, -this.FIRE_SPEED);
      this.setRotation(Phaser.Math.Angle.Between(player.x, player.y,this.x, this.y));
    }
  }
}