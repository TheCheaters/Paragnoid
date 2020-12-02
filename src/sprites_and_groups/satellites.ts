import { Scene } from "phaser";
import Game from '../scenes/game';
import { SATELLITE, SATELLITE_ASSET_PATH } from '~/constants.json';

export class Satellite extends Phaser.Physics.Arcade.Sprite{
    private flares!: Phaser.GameObjects.Particles.ParticleEmitter;
    constructor(scene: Game, x:number, y:number, texture:string){
        super(scene, x, y, texture);
        //scene.add.existing(this);
        //scene.physics.add.existing(this);    
    }

make() {
    // POSITION
    const scene = this.scene as Game;
    var x = 300;
    var y = 400;
    this.setOrigin(0.5, 0.5);
    this.body.reset(x, y);

    // BEHAVIOR
    this.body.enable = true;
    this.setActive(true);
    this.setVisible(true);
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
    const satellite = this.getFirstDead(false) as Satellite;
    if (satellite) satellite.make();
  }

}