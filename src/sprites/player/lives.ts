import { Scene } from "phaser";

export default class Lives extends Phaser.Physics.Arcade.Group {
    public lifes!: number;
    public firstLifeIconX!: number;
    constructor(scene: Scene, texture: string) {
        super(scene.physics.world, scene);
        this.lifes = 2;

        this.createMultiple({
            frameQuantity: this.lifes,
            key: texture,
            frame: 35,
            repeat: 0,
          });
          this.firstLifeIconX = this.scene.scale.width - 10 - (this.lifes * 50);
          Phaser.Actions.SetXY(this.getChildren(), this.firstLifeIconX, 25, 50);
          Phaser.Actions.SetScale(this.getChildren(), 0.8, 0.8);
          Phaser.Actions.SetOrigin(this.getChildren(), 0.5, 0.5);
   }

    addLives(){
      this.add(this.create()) //da collegare ai powerups
    }

    destroyLives(){
      const child = this.getFirstAlive();
      if (child) this.remove(child, true, true);
      Phaser.Actions.SetXY(this.getChildren(), this.firstLifeIconX, 25, 50);

    }

}