import { Scene } from "phaser";
import * as I from '~/configurations/images.json';

export default class Lives extends Phaser.Physics.Arcade.Group {
    public lifes!: number;
    public firstLifeIconX!: number;
    constructor(scene: Scene) {
        super(scene.physics.world, scene);
        this.lifes = 3;

        this.createMultiple({
            frameQuantity: this.lifes,
            key: I.BATTERY,
            repeat: 0,
          });
          this.firstLifeIconX = this.scene.scale.width - 40 - (this.lifes * 50);
          Phaser.Actions.SetXY(this.getChildren(), this.firstLifeIconX, 25, 50);
          Phaser.Actions.SetScale(this.getChildren(), 0.10, 0.10);
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