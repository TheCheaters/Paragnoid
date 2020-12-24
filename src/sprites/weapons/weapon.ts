import { Scene } from "phaser";
import Game from '~/scenes/game';
import { DEFAULT } from '~/sprites/weapons/weapons_enemy_types.json';
import WEAPON_ENEMY_TYPES from '~/sprites/weapons/weapons_enemy_types.json';
import WEAPON_PLAYER_TYPES from '~/sprites/weapons/weapons_player_types.json';
import WEAPON_SATELLITE_TYPES from '~/sprites/weapons/weapons_satellite_types.json';

type WeaponEnemyType = keyof typeof WEAPON_ENEMY_TYPES;
type WeaponPlayerType = keyof typeof WEAPON_PLAYER_TYPES;
type WeaponSatelliteType = keyof typeof WEAPON_SATELLITE_TYPES;
const weaponSatelliteNames = Object.keys(WEAPON_SATELLITE_TYPES);
export class Weapon extends Phaser.Physics.Arcade.Sprite {

  public weaponType = weaponSatelliteNames[0] as WeaponSatelliteType;
  public timer!: Phaser.Time.TimerEvent;
  DAMAGE = DEFAULT.DAMAGE;
  FIRE_SPEED = DEFAULT.FIRE_SPEED;
  TEXTURE_NAME = DEFAULT.TEXTURE_NAME;
  FRAME_NAME = DEFAULT.FRAME_NAME;
  AUDIO_NAME = DEFAULT.AUDIO_NAME;
  AUDIO_ASSET_PATH = DEFAULT.AUDIO_ASSET_PATH;
  WIDTH = DEFAULT.WIDTH;
  HEIGHT = DEFAULT.HEIGHT;
  FOLLOW = 0;

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

  setWeaponTexture(texture: string, frame: string) {
    this.setTexture(texture, frame);
  }

	preUpdate(time: number, delta: number,) {
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
    this.FRAME_NAME = DEFAULT.FRAME_NAME;
    this.AUDIO_NAME = DEFAULT.AUDIO_NAME;
    this.AUDIO_ASSET_PATH = DEFAULT.AUDIO_ASSET_PATH;
    this.WIDTH = DEFAULT.WIDTH;
    this.HEIGHT = DEFAULT.HEIGHT;
   }

   firePlayer(x: number, y: number, angle: number, weaponType: WeaponPlayerType, weaponLevel: number) {

    this.setTexture(WEAPON_PLAYER_TYPES[weaponType].TEXTURE_NAME, WEAPON_PLAYER_TYPES[weaponType].FRAME_NAME);
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
    this.setWeaponTexture(WEAPON_ENEMY_TYPES[weaponType].TEXTURE_NAME, WEAPON_ENEMY_TYPES[weaponType].FRAME_NAME);
    this.DAMAGE = (WEAPON_ENEMY_TYPES[weaponType].DAMAGE);
    this.FIRE_SPEED = -(WEAPON_ENEMY_TYPES[weaponType].FIRE_SPEED);
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

export class SatelliteWeapon extends Weapon {

  fireSatellite(x: number, y: number, angle: number, follow: number, weaponType: WeaponSatelliteType){
      this.setWeaponTexture(WEAPON_SATELLITE_TYPES[weaponType].TEXTURE_NAME, WEAPON_SATELLITE_TYPES[weaponType].FRAME_NAME);
      this.DAMAGE = (WEAPON_SATELLITE_TYPES[weaponType].DAMAGE);
      this.FOLLOW = follow;
      this.FIRE_SPEED = (WEAPON_SATELLITE_TYPES[weaponType].FIRE_SPEED);
      this.body.enable = true;
      this.body.reset(x + 2, y + 2);
      this.setActive(true);
      this.setVisible(true);
      //this.scene.sound.play(this.AUDIO_NAME);
      if (follow === 0){
        this.setVelocityX(this.FIRE_SPEED*Math.cos(Phaser.Math.DegToRad(angle)));
        this.setVelocityY(this.FIRE_SPEED*Math.sin(Phaser.Math.DegToRad(angle)));
        this.setRotation(Phaser.Math.DegToRad(angle));
      }
  }

	preUpdate(time: number, delta: number,) {
    super.preUpdate(time, delta);
    if (this.FOLLOW === 1){
      const { enemies } = this.scene as Game;
      const closestEnemy = this.scene.physics.closest(this, enemies.getChildrenAlive()) as Phaser.Physics.Arcade.Sprite;
      /*
        scene.gfx.clear()
        .lineStyle(2,0xff3300)
        .lineBetween(closestEnemy.x, closestEnemy.y, this.x, this.y);
        */
       //tracciamento grafico utile per il debug
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        if (this instanceof SatelliteWeapon) {
          this.scene.physics.moveToObject(this, closestEnemy, this.FIRE_SPEED);
          this.setRotation(Phaser.Math.Angle.Between(closestEnemy.x, closestEnemy.y, this.x, this.y));
        }
    }
	}

}