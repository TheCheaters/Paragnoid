import { Scene } from "phaser";
import Game from '~/scenes/game';
import { SATELLITES, SATELLITES_ASSET_PATH, FLARES } from '~/constants.json';
import WEAPON_SATELLITE_TYPES from '~/sprites/satellites/weapons_satellite_types.json';
import WEAPON_PLAYER_TYPES from '~/sprites/player/weapons_player_types.json';
import { WeaponSatelliteType } from "~/types/weapons";

const weaponNames = Object.keys(WEAPON_PLAYER_TYPES);
export class Satellite extends Phaser.Physics.Arcade.Sprite {
    private keys!: {
      [key: string]: Phaser.Input.Keyboard.Key; };
    public timer!: Phaser.Time.TimerEvent;
    fireSpeed = WEAPON_SATELLITE_TYPES.DEFAULT.FIRE_SPEED;
    audioName = WEAPON_SATELLITE_TYPES.DEFAULT.AUDIO_NAME;
    damage = WEAPON_SATELLITE_TYPES.DEFAULT.DAMAGE;
    textureName = WEAPON_SATELLITE_TYPES.DEFAULT.TEXTURE_NAME;
    audioAssetPath = WEAPON_SATELLITE_TYPES.DEFAULT.AUDIO_ASSET_PATH;
    width = WEAPON_SATELLITE_TYPES.DEFAULT.WIDTH;
    height = WEAPON_SATELLITE_TYPES.DEFAULT.HEIGHT;
    follow = WEAPON_SATELLITE_TYPES.DEFAULT.FOLLOW;
    private energy = 200;
    private offsetY!: number;
    private offsetX!: number;
    public activeSatellite!: boolean;
    public weaponType = weaponNames[0] as WeaponSatelliteType;
    private manager!: Phaser.GameObjects.Particles.ParticleEmitterManager;
    private emitter!: Phaser.GameObjects.Particles.ParticleEmitter;

    constructor(scene: Game, x: number, y: number, texture: string){
        super(scene, x, y, texture);
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
      const delay = 2000 // Phaser.Math.Between(1000, 1000); // con questo si controlla il tempo di fuoriuscita dei missili a ricerca

      this.timer = this.scene.time.addEvent({ delay, callback: () => {
        this.fireSatellite(this.x, this.y, this.weaponType, this.follow);
      }, callbackScope: this, loop: true });
      this.createFireEngine();
  }

  createFireEngine() {
    this.manager = this.scene.add.particles(FLARES);
    this.emitter = this.manager
      .createEmitter({
        name: 'fire',
        frame: [
          'red',
        ],
        gravityX: -300,
        x: -5,
        y: 15,
        blendMode: 'ADD',
        scale: { start: 0.1, end: 0 },
        speedX: { min: -50, max: 5, steps: 12 },
        // speedY: { min: -25, max: 25 },
        lifespan: 250,
        quantity: 1,
      })
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
      // this.body.enable = false;
      // this.setActive(false);
      // if(this.timer) { this.timer.remove(); }
      // this.setVisible(false);
      //this.setVelocity(0);

    }

  fireSatellite(x: number, y: number, weaponType: WeaponSatelliteType, follow: number){
    const { satelliteWeaponsGroup } = this.scene as Game;
    satelliteWeaponsGroup.fire({ x, y, weaponType, follow });
  }

  preUpdate(){
    const scene = this.scene as Game;
    scene.physics.moveTo(this, scene.player.x-this.offsetX, scene.player.y+this.offsetY, 500, 75);
    //con l'ultimo parametro '75' si controlla in pratica l'inerzia del movimento dei satelliti rispetto ai movimenti del player
    this.manager.setPosition(this.x, this.y);
   }
}

export default class Satellites extends Phaser.Physics.Arcade.Group {
    constructor(scene: Scene) {
        super(scene.physics.world, scene);

        this.createMultiple({
          frameQuantity: 5,
          key: SATELLITES,
          frame: SATELLITES_ASSET_PATH,
          setXY: {x: -1000, y: -1000},
          setScale: {x: 0.2, y: 0.2},
          active: false,
          visible: false,
          classType: Satellite
        });

}
launchSatellite() {
    [40, -60].forEach((offsetY) => {
      const satellitePlayer = this.getFirstDead(false) as Satellite;
      const satelliteOffsetX = 30;
      if (offsetY !== 0 ) { satellitePlayer.make(satelliteOffsetX, offsetY);}

    })
 }

}