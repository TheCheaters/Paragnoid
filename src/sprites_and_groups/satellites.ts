import { Scene } from "phaser";
import Game from '../scenes/game';
import { SATELLITE } from '~/constants.json';
import WEAPON_PLAYER_TYPES from '~/sprites_and_groups/weapons_player_types.json';

type WeaponPlayerType = keyof typeof WEAPON_PLAYER_TYPES;
const weaponNames = Object.keys(WEAPON_PLAYER_TYPES);
export class Satellite extends Phaser.Physics.Arcade.Sprite{
    private flares!: Phaser.GameObjects.Particles.ParticleEmitter;
    private energy = 200;
    private offsetY!: number;
    public weaponType = weaponNames[0] as WeaponPlayerType;
    constructor(scene: Game, x:number, y:number, texture:string){
        super(scene, x, y, texture);{

        }

    }

make(offsetY: number) {
    // POSITION
    const scene = this.scene as Game;
    this.offsetY = offsetY;
    var xTo = scene.player.x;
    var yTo = scene.player.y - offsetY;
    var xFrom = -100;
    var yFrom = 0;
    this.setOrigin(0.5, 0.5);
    this.body.reset(xFrom, yFrom);    
    
    // BEHAVIOR
    this.body.enable = true;
    this.setActive(true);
    this.setVisible(true);
    

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
  }

preUpdate(){
    const scene = this.scene as Game;
    scene.physics.moveTo(this, scene.player.x, scene.player.y +this.offsetY, 500, 75); 
    //con l'ultimo parametro '75' si controlla in pratica l'inerzia del movimento dei satelliti rispetto ai movimenti del player

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
      if (offsetY !== 0) { satellitePlayer.make(offsetY);}
    })
 }

  }