import Game from "~/scenes/game";
let n = 0;
export default class Segment {
   public scene!: Game;
   public level!: number
   public startX!: number
   public startY!: number
   public endX!: number
   public endY!: number
   public scoreText!: Phaser.GameObjects.DynamicBitmapText;
   private style: Phaser.GameObjects.Graphics;
   private style1: Phaser.GameObjects.Graphics;
   private line: Phaser.Geom.Line;

   constructor(scene: Game, startX: number, startY: number, endX: number, endY: number, level: number) {
      this.scene = scene;
      this.startX = startX;
      this.startY = startY;
      this.endX = endX;
      this.endY = endY;
      this.level = level;
      this.style = this.scene.add.graphics({ lineStyle: { width: 3, color: 0xff0000 } });
      this.style1 = this.scene.add.graphics({ lineStyle: { width: 1, color: 0xff0000, alpha: 0.5 } });
      this.line = new Phaser.Geom.Line();

   }

   // punto medio non serve si può usare la funzione GetMidPoint
   clone() {
      return new Segment(this.scene, this.startX, this.startY, this.endX, this.endY, this.level)
   }

   draw() {  
      this.line.x1 = this.startX;
      this.line.y1 = this.startY;
      this.line.x2 = this.endX;
      this.line.y2 = this.endY;
      //this.scene.add.shader();
      if (this.level <= 1) {
         this.style.strokeLineShape(this.line);
         this.scene.tweens.add({
            targets: this.style,
            duration: 400,
            alpha: 0
         })
      } else {
         this.style1.strokeLineShape(this.line);
         this.scene.tweens.add({
            targets: this.style1,
            duration: 600,
            alpha: 0
         })}
      
   }

}