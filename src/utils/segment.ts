import Game from "~/scenes/game";

export default class Segment {
   public scene!: Game;
   public level!: number
   public startX!: number
   public startY!: number
   public endX!: number
   public endY!: number
   public scoreText!: Phaser.GameObjects.DynamicBitmapText;
   private style: Phaser.GameObjects.Graphics;
   private line: Phaser.Geom.Line;

   constructor(scene: Game, startX: number, startY: number, endX: number, endY: number, level: number) {
      this.scene = scene;
      this.startX = startX;
      this.startY = startY;
      this.endX = endX;
      this.endY = endY;
      this.level = level;
      this.style = this.scene.add.graphics({ lineStyle: { width: 5, color: 0x00ff3d } });
      this.line = new Phaser.Geom.Line();

   }

   // punto medio non serve si può usare la funzione GetMidPoint
   clone() {
      return new Segment(this.scene, this.startX, this.startY, this.endX, this.endY, this.level)
   }

   draw() {
      // const graphics = new Phaser.GameObjects.Graphics(this.scene);
      // graphics.lineBetween(this.startX, this.startY, this.endX, this.endY);
      // this.scoreText = this.scene.add.dynamicBitmapText(260, 260, PV_FONT_NAME, this.startX.toString(), 14);
      // graphics.lineStyle(10, 0xFF0000)
      console.log(this.startX, this.startY, this.endX, this.endY);
      console.log(this.scene);
      // console.log(graphics);
      this.line.x1 = this.startX;
      this.line.y1 = this.startY;
      this.line.x2 = this.endX;
      this.line.y2 = this.endY;
      this.style.strokeLineShape(this.line);

   }

}