import { Scene } from "phaser";
import { DEFAULT } from '~/sprites_and_groups/weapons_types.json';
import WEAPON_TYPES from '~/sprites_and_groups/weapons_types.json';

type WeaponType = keyof typeof WEAPON_TYPES;

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

  fire(x: number, y: number) {
    this.body.enable = true;
    this.body.reset(x + 2, y + 20);
    this.setActive(true);
    this.setVisible(true);
    this.setVelocityX(this.FIRE_SPEED);
    this.scene.sound.play(this.AUDIO_NAME);
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
  }
  fire(x: number, y: number, weaponType?: WeaponType) {
    if (weaponType) {
      this.setWeaponTexture(WEAPON_TYPES[weaponType].TEXTURE_NAME);
      this.FIRE_SPEED = (WEAPON_TYPES[weaponType].FIRE_SPEED);
    }
    super.fire(x, y);
  }
}

export class EnemyWeapon extends Weapon {
  fire(x: number, y: number, weaponType?: WeaponType) {
    if (weaponType) {
      this.setWeaponTexture(WEAPON_TYPES[weaponType].TEXTURE_NAME);
      this.FIRE_SPEED = (WEAPON_TYPES[weaponType].FIRE_SPEED);
    }
    super.fire(x, y);
  }
}