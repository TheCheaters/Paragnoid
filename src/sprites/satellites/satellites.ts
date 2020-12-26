import { Scene } from "phaser";
import Game from '~/scenes/game';
import { MISSILI_SATELLITE } from '~/sprites/weapons/weapons_satellite_types.json';
import { SATELLITE } from '~/constants.json';
import WEAPON_PLAYER_TYPES from '~/sprites/weapons/weapons_player_types.json';
import WEAPON_SATELLITE_TYPES from '~/sprites/weapons/weapons_satellite_types.json';

type WeaponSatelliteType = keyof typeof WEAPON_SATELLITE_TYPES;
const weaponNames = Object.keys(WEAPON_PLAYER_TYPES);
export class Satellite extends Phaser.Physics.Arcade.Sprite{
    private keys!: {
      [key: string]: Phaser.Input.Keyboard.Key; };
    public timer!: Phaser.Time.TimerEvent;
    fireSpeed = MISSILI_SATELLITE.FIRE_SPEED;
    audioName = MISSILI_SATELLITE.AUDIO_NAME;
    damage = MISSILI_SATELLITE.DAMAGE;
    textureName = MISSILI_SATELLITE.TEXTURE_NAME;
    audioAssetPath = MISSILI_SATELLITE.AUDIO_ASSET_PATH;
    width = MISSILI_SATELLITE.WIDTH;
    height = MISSILI_SATELLITE.HEIGHT;
    follow = MISSILI_SATELLITE.FOLLOW;
    private energy = 200;
    private offsetY!: number;
    private offsetX!: number;
    public activeSatellite!: boolean;
    public weaponType = weaponNames[0] as WeaponSatelliteType;
    constructor(scene: Game, x: number, y: number, texture: string){
        super(scene, x, y, texture);
        this.damage = MISSILI_SATELLITE.DAMAGE;
        this.fireSpeed = MISSILI_SATELLITE.FIRE_SPEED;
        this.textureName = MISSILI_SATELLITE.TEXTURE_NAME;
        this.audioName = MISSILI_SATELLITE.AUDIO_NAME;
        this.audioAssetPath = MISSILI_SATELLITE.AUDIO_ASSET_PATH;
        this.width = MISSILI_SATELLITE.WIDTH;
        this.height = MISSILI_SATELLITE.HEIGHT;
        this.follow = MISSILI_SATELLITE.FOLLOW;
        this.keys = {
          space: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)  }


    }

make(offsetX: number, offsetY: number) {
    // POSITION
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    const xFrom = -100;
    const yFrom = 0;
    this.setOrigin(0.5, 0.5);
    this.body.reset(xFrom, yFrom);

    // BEHAVIOR
    this.body.enable = true;
    this.setActive(true);
    this.setVisible(true);
    this.activeSatellite = true;
    this.weaponType = "MISSILI_SATELLITE";
    const delay = Phaser.Math.Between(1000, 1100); // con questo si controlla il tempo di fuoriuscita dei missili a ricerca

    this.timer = this.scene.time.addEvent({ delay, callback: () => {
      this.fireSatellite(this.x, this.y, this.weaponType, this.follow);
    }, callbackScope: this, loop: true });

    }

takeHit(damage: number) {
    const scene = this.scene as Game;
    console.log(scene.shield.isUp);
    if (scene.shield.isUp) scene.shield.takeHit(damage);
    else {
      this.energy -= damage;
      if (this.energy < 0) {
          scene.explosions?.addExplosion(this.x, this.y);
          this.kill();
         }
    }
  }

kill() {
    this.body.enable = false;
    this.setActive(false);
    if(this.timer) { this.timer.remove(); }
    this.setVisible(false);
    //this.setVelocity(0);

  }

fireSatellite(x: number, y: number, weaponType: WeaponSatelliteType, follow: number){
  const { satelliteWeaponsGroup } = this.scene as Game;
  satelliteWeaponsGroup.fireBulletSatellite({ x, y, weaponType, follow });
}

preUpdate(){
    const scene = this.scene as Game;
    scene.physics.moveTo(this, scene.player.x-this.offsetX, scene.player.y+this.offsetY, 500, 75);
    //con l'ultimo parametro '75' si controlla in pratica l'inerzia del movimento dei satelliti rispetto ai movimenti del player
   }

}

export default class Satellites extends Phaser.Physics.Arcade.Group {
    constructor(scene: Scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
          frameQuantity: 5,
          key: SATELLITE,
          setXY: {x: -1000, y: -1000},
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