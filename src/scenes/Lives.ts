import {Game, Scene} from "phaser";
import { SPACECRAFT } from './game';

export default class Lives extends Phaser.Physics.Arcade.Group {
    public livesPlayer; 
    public extraLifesPlayer!: number;
    public firstLifeIconX!: number;
    constructor(scene: Scene, texture: string) {
        super(scene.physics.world, scene);
        this.extraLifesPlayer = 3;
    
        this.livesPlayer = scene.add.group();
        this.livesPlayer.createMultiple({
            frameQuantity: 3,
            key: SPACECRAFT,
            frame: 0,   
            repeat: 1,         
          }); 

           
          this.firstLifeIconX = 800 - 10 - (this.extraLifesPlayer * 50);
          //Phaser.Actions.SetXY(this.livesPlayer.getChildren(), 32, 100, 32); //larghezza schermo da rendere parametrica
          //for (var i=0; i<this.extraLifesPlayer; i++){
              
            //var life = this.livesPlayer.create(firstLifeIconX + (50 * i), 50, SPACECRAFT);
            
            
            //this.scoreText = this.add.dynamicBitmapText(600, 300, FONT_NAME, this.extraLifesPlayer.toString(), 60 );
            //life.setScale(0.8);
            //life.setOrigin(0.5, 0.5);
          //}
    }
        
}