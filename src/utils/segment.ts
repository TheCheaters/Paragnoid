import { Scene } from "phaser";
import Game from '~/scenes/game';
import { DEFAULT } from '~/sprites/enemies/weapons_enemy_types.json';
import { LEFT_KILL_ZONE, RIGHT_KILL_ZONE } from '~/constants.json';

export default class Segment extends Phaser.GameObjects.Line {
 public level !: number
 public startX !: number
 public startY !: number
 public endX !: number
 public endY !: number
 constructor(scene: Scene, startX: number, startY: number, endX: number, endY: number, level: number){
    super(scene, startX, startY, endX, endY);
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.level = level;
     }

// punto medio non serve si può usare la funzione GetMidPoint
clone(){
   return new Segment(this.scene, this.startX, this.startY, this.endX, this.endY, this.level)
}

draw(){   
   const graphics = new Phaser.GameObjects.Graphics(this.scene);
   graphics.lineBetween(this.startX, this.startY, this.endX, this.endY);
   graphics.lineStyle(1, 0xFF0000)
}

}