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
  SPRITE_ASSET_PATH = DEFAULT.SPRITE_ASSET_PATH;
  AUDIO_NAME = DEFAULT.AUDIO_NAME;
  AUDIO_ASSET_PATH = DEFAULT.AUDIO_ASSET_PATH;
  WIDTH = DEFAULT.WIDTH;
  HEIGHT = DEFAULT.HEIGHT;
  FOLLOW = 0;
  TURN_RATE = 0;

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
    this.SPRITE_ASSET_PATH = DEFAULT.SPRITE_ASSET_PATH;
    this.AUDIO_NAME = DEFAULT.AUDIO_NAME;
    this.AUDIO_ASSET_PATH = DEFAULT.AUDIO_ASSET_PATH;
    this.WIDTH = DEFAULT.WIDTH;
    this.HEIGHT = DEFAULT.HEIGHT;
   }

   firePlayer(x: number, y: number, angle: number, weaponType: WeaponPlayerType, weaponLevel: number) {

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
      this.setWeaponTexture(WEAPON_SATELLITE_TYPES[weaponType].TEXTURE_NAME);
      this.DAMAGE = (WEAPON_SATELLITE_TYPES[weaponType].DAMAGE);
      this.FOLLOW = follow;
      this.TURN_RATE = (WEAPON_SATELLITE_TYPES[weaponType].TURN_RATE);
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
      if (closestEnemy !== null) {var angleEnemy = Phaser.Math.Angle.Between(this.x, this.y, closestEnemy.x, closestEnemy.y); 
      var coords: number[] = [0, 0];
      /*
        scene.gfx.clear()
        .lineStyle(2,0xff3300)
        .lineBetween(closestEnemy.x, closestEnemy.y, this.x, this.y);
        */
       //tracciamento grafico utile per il debug
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        if (this instanceof SatelliteWeapon) {
          if (closestEnemy !== null && this.rotation !== angleEnemy) { 
          coords[0] = closestEnemy.x;
          coords[1] = closestEnemy.y
          var delta = angleEnemy - this.rotation; // differenza tra l'angolo del missile e l'angolo del nemico
          if (delta > Math.PI) delta -= Math.PI * 2; // se la differenza è > 180° allora togli 90° dal delta e mantienilo nel range 0-180°
          if (delta < -Math.PI) delta += Math.PI * 2; // se la differenza è < -180° allora aggiungi 90° al delta e mantienilo nel range -180° - 0
          if (delta > 0) { this.angle += this.TURN_RATE} else { this.angle -= this.TURN_RATE}; // se delta > 0 gira in senso orario gradualmente altrimenti gira in senso antiorario
          if (Math.abs(delta) < Phaser.Math.DegToRad(this.TURN_RATE)) { this.rotation = angleEnemy};
          this.body.velocity.x = Math.cos(this.rotation) * this.FIRE_SPEED;
          this.body.velocity.y = Math.sin(this.rotation) * this.FIRE_SPEED;
          
          /*this.scene.physics.moveTo(this, coords[0], coords[1], this.FIRE_SPEED);
          this.setRotation(Phaser.Math.Angle.Between(coords[0], coords[1], this.x, this.y));*/
        } 
          /*else {
            var angleEnemyCoords = Phaser.Math.Angle.Between(coords[0], coords[1], this.x, this.y);   
            var delta = angleEnemyCoords - this.rotation; 
            if (delta > Math.PI) delta -= Math.PI * 2;
            if (delta < -Math.PI) delta += Math.PI * 2; 
            if (delta > 0) { this.angle += this.TURN_RATE} else { this.angle -= this.TURN_RATE};
            if (Math.abs(delta) < Phaser.Math.DegToRad(this.TURN_RATE)) { this.rotation = angleEnemyCoords};
            this.body.velocity.x = Math.cos(this.rotation) * this.FIRE_SPEED;
            this.body.velocity.y = Math.sin(this.rotation) * this.FIRE_SPEED;*/
            /*this.scene.physics.moveTo(this, 1500, angleEnemyCoords*1500, this.FIRE_SPEED);
            this.setRotation(Phaser.Math.Angle.Between(coords[0], coords[1], this.x, this.y));*/

          }   }        
          
        } 
        
    }
	
}