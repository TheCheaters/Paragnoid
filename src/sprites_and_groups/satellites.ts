import { Scene } from "phaser";
import Game from '../scenes/game';
import { MISSILI_SATELLITE, LASER_SATELLITE } from '~/sprites_and_groups/weapons_satellite_types.json';
import { SATELLITE } from '~/constants.json';
import WEAPON_PLAYER_TYPES from '~/sprites_and_groups/weapons_player_types.json';
import WEAPON_SATELLITE_TYPES from '~/sprites_and_groups/weapons_satellite_types.json';
import { SatelliteWeapon } from './weapon';

type WeaponPlayerType = keyof typeof WEAPON_PLAYER_TYPES;
type WeaponSatelliteType = keyof typeof WEAPON_SATELLITE_TYPES;
const weaponNames = Object.keys(WEAPON_PLAYER_TYPES);
const weaponSatellitenames = Object.keys(WEAPON_SATELLITE_TYPES);
export class Satellite extends Phaser.Physics.Arcade.Sprite{
    private flares!: Phaser.GameObjects.Particles.ParticleEmitter;
    private keys!: {
      [key: string]: Phaser.Input.Keyboard.Key; };
      private timer!: Phaser.Time.TimerEvent;
    FIRE_SPEED = MISSILI_SATELLITE.FIRE_SPEED;
    AUDIO_NAME = MISSILI_SATELLITE.AUDIO_NAME;
    DAMAGE = MISSILI_SATELLITE.DAMAGE;
    TEXTURE_NAME = MISSILI_SATELLITE.TEXTURE_NAME;
    SPRITE_ASSET_PATH = MISSILI_SATELLITE.SPRITE_ASSET_PATH;
    AUDIO_ASSET_PATH = MISSILI_SATELLITE.AUDIO_ASSET_PATH;
    WIDTH = MISSILI_SATELLITE.WIDTH;
    HEIGHT = MISSILI_SATELLITE.HEIGHT;
    FOLLOW = MISSILI_SATELLITE.FOLLOW;
    private energy = 200;
    private offsetY!: number;
    private offsetX!: number;
    public activeSatellite!: boolean;
    public weaponType = weaponNames[0] as WeaponSatelliteType;
    constructor(scene: Game, x:number, y:number, texture:string){
        super(scene, x, y, texture);
        this.DAMAGE = MISSILI_SATELLITE.DAMAGE;
        this.FIRE_SPEED = MISSILI_SATELLITE.FIRE_SPEED;
        this.TEXTURE_NAME = MISSILI_SATELLITE.TEXTURE_NAME;
        this.SPRITE_ASSET_PATH = MISSILI_SATELLITE.SPRITE_ASSET_PATH;
        this.AUDIO_NAME = MISSILI_SATELLITE.AUDIO_NAME;
        this.AUDIO_ASSET_PATH = MISSILI_SATELLITE.AUDIO_ASSET_PATH;
        this.WIDTH = MISSILI_SATELLITE.WIDTH;
        this.HEIGHT = MISSILI_SATELLITE.HEIGHT;
        this.FOLLOW = MISSILI_SATELLITE.FOLLOW;
        this.keys = {
          space: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)  }
         
              
    }

make(offsetX: number, offsetY: number) {
    // POSITION
    const scene = this.scene as Game;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    var xFrom = -100;
    var yFrom = 0;
    this.setOrigin(0.5, 0.5);
    this.body.reset(xFrom, yFrom);    
    
    // BEHAVIOR
    this.body.enable = true;
    this.setActive(true);
    this.setVisible(true);
    this.activeSatellite = true;
    this.weaponType = "MISSILI_SATELLITE";
    const delay = Phaser.Math.Between(100, 150);

    this.timer = this.scene.time.addEvent({ delay, callback: () => {
      this.fireSatellite(this.x, this.y, this.weaponType, this.FOLLOW);
    }, callbackScope: this, loop: true });
    
    }

takeHit(damage: number) {
    const scene = this.scene as Game;
    console.log(scene.shield.isUp);
    if (scene.shield.isUp) scene.shield.takeHit(damage);
    else {
      this.energy -= damage;
      if (this.energy <= 0) {
          scene.explosions?.addExplosion(this.x, this.y);
          this.kill(); }
    }
  }

kill() {
    this.body.enable = false;
    this.setActive(false);
    this.setVisible(false);
    //this.setVelocity(0);
    this.timer.remove();
  }

fireSatellite(x: number, y:number, weaponType: WeaponSatelliteType, follow: number){ 
  const { satelliteWeaponsGroup } = this.scene as Game;
  satelliteWeaponsGroup.fireBulletSatellite({ x, y, weaponType, follow });
}  

preUpdate(){
    const scene = this.scene as Game;
    scene.physics.moveTo(this, scene.player.x-this.offsetX, scene.player.y+this.offsetY, 500, 75); 
    //con l'ultimo parametro '75' si controlla in pratica l'inerzia del movimento dei satelliti rispetto ai movimenti del player
    /*if (Phaser.Input.Keyboard.JustDown(this.keys.space) && scene.satelliteWeaponsGroup) {
      this.fireSatellite(this.x, this.y, this.weaponType, this.FOLLOW);            
  }*/
  if (this.x < -500 || this.x > 1500) {this.kill();}
    
  }

}

export default class Satellites extends Phaser.Physics.Arcade.Group {
    constructor(scene: Scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
          frameQuantity: 5,
          key: SATELLITE,
          setXY: {x: -100, y: -100},
          setScale: {x: 0.5, y: 0.5},
          active: false,
          visible: false,
          classType: Satellite
        });

}
launchSatellite() {
    const scene = this.scene as Game;
    WEAPON_PLAYER_TYPES[scene.player.weaponType].LEVELS[scene.player.weaponLevel].SATELLITES_OFFSET_Y.forEach((offsetY) => {
      const satellitePlayer = this.getFirstDead(false) as Satellite;
      const satelliteOffsetX = WEAPON_PLAYER_TYPES[scene.player.weaponType].LEVELS[scene.player.weaponLevel].SATELLITES_OFFSET_X;
      if (offsetY !== 0 ) { satellitePlayer.make(satelliteOffsetX, offsetY);}        
      
    })
 }

}