import Game from '~/scenes/game';
import {
   LAMPO_GENERAZIONI,
   LAMPO_MAXOFFSET,
   LAMPO_SCALA, 
   LAMPO_DURATA
} from '~/constants.json';
export default class Segment {
   public scene!: Game;
   public level!: number
   public startX!: number
   public startY!: number
   public endX!: number
   public endY!: number
   public scoreText!: Phaser.GameObjects.DynamicBitmapText;
   private line: Phaser.Geom.Line;
   public offset!: number

   constructor(scene: Game, startX: number, startY: number, endX: number, endY: number, level: number, offset: number) {
      this.scene = scene;
      this.startX = startX;
      this.startY = startY;
      this.endX = endX;
      this.endY = endY;
      this.level = level;
      this.line = new Phaser.Geom.Line();
      this.offset = offset;
   }

   draw(style: Phaser.GameObjects.Graphics, style1: Phaser.GameObjects.Graphics): void {
      this.line.x1 = this.startX;
      this.line.y1 = this.startY;
      this.line.x2 = this.endX;
      this.line.y2 = this.endY;
      //this.scene.add.shader();
      if (this.level <= 1) {
         style.strokeLineShape(this.line); 
            this.scene.tweens.add({               
               targets: style,
               alpha: {value:0, duration: 500, ease: 'Power1'},
               onComplete: function(){ style1.destroy}
          });
   
         /*setTimeout(() => {
            this.scene.tweens.add({
               targets: style,
               alpha: {value:0, duration: 500, ease: 'Power1'} })
            style.clear();            
         }, LAMPO_DURATA + 500) */
      } else {
         style1.strokeLineShape(this.line);
         this.scene.tweens.add({
            targets: style1,            
            alpha: {value:0, duration: 500, ease: 'Power1'},
            onComplete: function(){ style1.destroy}
         });
         /*setTimeout(() => {
            this.scene.tweens.add({
               targets: style1,
               alpha: {value:0, duration: 500, ease: 'Power1'} })
            style1.clear();
         }, LAMPO_DURATA + 500)*/

      }

   }

}