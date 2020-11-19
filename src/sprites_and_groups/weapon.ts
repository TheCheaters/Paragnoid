import { Scene } from "phaser";
import { DEFAULT } from '~/sprites_and_groups/weapons_enemy_types.json';
import {LEVEL_1} from '~/sprites_and_groups/weapons_levels.json'
import WEAPON_ENEMY_TYPES from '~/sprites_and_groups/weapons_enemy_types.json';
import WEAPON_LEVELS from '~/sprites_and_groups/weapons_levels.json'

type WeaponEnemyType = keyof typeof WEAPON_ENEMY_TYPES;
type WeaponLevel = keyof typeof WEAPON_LEVELS;

export class Weapon extends Phaser.Physics.Arcade.Sprite {

  DAMAGE = DEFAULT.DAMAGE;
  FIRE_SPEED = DEFAULT.FIRE_SPEED;
  TEXTURE_NAME = DEFAULT.TEXTURE_NAME;
  SPRITE_ASSET_PATH = DEFAULT.SPRITE_ASSET_PATH;
  AUDIO_NAME = DEFAULT.AUDIO_NAME;
  AUDIO_ASSET_PATH = DEFAULT.AUDIO_ASSET_PATH;
  WIDTH = DEFAULT.WIDTH;
  HEIGHT = DEFAULT.HEIGHT;
  ANGLE = LEVEL_1.ANGLE;
  GR_X = LEVEL_1.GRAVITY_X;
  GR_Y = LEVEL_1.GRAVITY_Y;
  public angolo!: Phaser.Physics.Arcade.Body;
  
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, DEFAULT.TEXTURE_NAME);
  }

  fire(x: number, y: number, angle:number) {
    this.body.enable = true;
    this.body.reset(x + 2, y + 20);
    this.setActive(true);
    this.setVisible(true);
    this.setVelocityX(this.FIRE_SPEED*Math.cos(Phaser.Math.DegToRad(angle)));
    this.setVelocityY(this.FIRE_SPEED*Math.sin(Phaser.Math.DegToRad(angle)));
    this.scene.sound.play(this.AUDIO_NAME);
    this.setRotation(Phaser.Math.DegToRad(angle));
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
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y);
    this.DAMAGE = DEFAULT.DAMAGE;
    this.FIRE_SPEED = DEFAULT.FIRE_SPEED;
    this.TEXTURE_NAME = DEFAULT.TEXTURE_NAME;
    this.SPRITE_ASSET_PATH = DEFAULT.SPRITE_ASSET_PATH;
    this.AUDIO_NAME = DEFAULT.AUDIO_NAME;
    this.AUDIO_ASSET_PATH = DEFAULT.AUDIO_ASSET_PATH;
    this.WIDTH = DEFAULT.WIDTH;
    this.HEIGHT = DEFAULT.HEIGHT;
    this.ANGLE = LEVEL_1.ANGLE;
    this.GR_X = LEVEL_1.GRAVITY_X;
    this.GR_Y = LEVEL_1.GRAVITY_Y;
  }
  firePlayer(x: number, y: number, angle:number, weaponType?: WeaponEnemyType, weaponLevel?: WeaponLevel) {
    if (weaponType && weaponLevel) {
      this.setWeaponTexture(WEAPON_ENEMY_TYPES[weaponType].TEXTURE_NAME);
      this.FIRE_SPEED = (WEAPON_ENEMY_TYPES[weaponType].FIRE_SPEED);
    }
    super.fire(x, y, angle);
  }

  firePlayer2(x: number, y: number, angle:number, weaponType?: WeaponEnemyType, weaponLevel?: WeaponLevel) {
    if (weaponType && weaponLevel) {
      this.setWeaponTexture(WEAPON_ENEMY_TYPES[weaponType].TEXTURE_NAME);
      this.FIRE_SPEED = 100;
    }
    super.fire(x, y, angle);
  }
}

export class EnemyWeapon extends Weapon {
  fireEnemy(x: number, y: number, weaponType?: WeaponEnemyType) {
    if (weaponType) {
      this.setWeaponTexture(WEAPON_ENEMY_TYPES[weaponType].TEXTURE_NAME);
      this.FIRE_SPEED = -(WEAPON_ENEMY_TYPES[weaponType].FIRE_SPEED);
    }
    super.fire(x, y, 0);
  }
}