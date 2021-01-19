import {
   Scene
} from "phaser";
import {
   PV_FONT_NAME
} from '~/constants.json';

export default class Segment extends Phaser.GameObjects.Line {
   public level!: number
   public startX!: number
   public startY!: number
   public endX!: number
   public endY!: number
   public scoreText!: Phaser.GameObjects.DynamicBitmapText;
   constructor(scene: Scene, startX: number, startY: number, endX: number, endY: number, level: number) {
      super(scene, startX, startY, endX, endY);
      this.startX = startX;
      this.startY = startY;
      this.endX = endX;
      this.endY = endY;
      this.level = level;
   }

   // punto medio non serve si può usare la funzione GetMidPoint
   clone() {
      return new Segment(this.scene, this.startX, this.startY, this.endX, this.endY, this.level)
   }

   draw() {
      const graphics = new Phaser.GameObjects.Graphics(this.scene);
      graphics.lineBetween(this.startX, this.startY, this.endX, this.endY);
      this.scoreText = this.scene.add.dynamicBitmapText(260, 260, PV_FONT_NAME, this.startX.toString(), 14);
      graphics.lineStyle(1, 0xFF0000)
   }

}