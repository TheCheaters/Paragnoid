import {Game, Scene} from "phaser";
import { SPACECRAFT } from './game';

export default class Lives extends Phaser.Physics.Arcade.Group {
    public livesPlayer;
    constructor(scene: Scene, texture: string) {
        super(scene.physics.world, scene);
    
        // this.livesPlayer = scene.add.group({
        //     key: SPACECRAFT,


        // });

        this.livesPlayer = this.createMultiple({
            frameQuantity: 30,
            key: SPACECRAFT,
            frame: 0,
          });    

    
    }
        
}