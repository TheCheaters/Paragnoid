import { Scene } from "phaser";

class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, 'enemy');
  }

  make(x: number, y: number) {
    this.body.reset(x, y);

    this.setActive(true);
    this.setVisible(true);

    this.setVelocityX(-500);
  }

	preUpdate(time: number, delta: number) {
		super.preUpdate(time, delta);
    this.anims.play('enemy', true);

		if (this.x < -100) {
			this.setActive(false);
			this.setVisible(false);
		}
	}

}

export default class Enemies extends Phaser.Physics.Arcade.Group {
  constructor(scene: Scene, texture: string) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 30,
      key: texture,
      active: false,
      visible: false,
      classType: Enemy
    });

    scene.anims.create ({
      key: texture,
      frames: scene.anims.generateFrameNumbers (texture, {
        start: 0,
        end: 1
      }),
      frameRate: 2
    });

    scene.time.addEvent({ delay: 2000, callback: this.makeEnemy, callbackScope: this, loop: true });

  }

  makeEnemy() {
    const y = Phaser.Math.Between(0, 600);
    const x = 900;
    const laser = this.getFirstDead(false);

    if (laser) {
      laser.make(x, y);
    }
  }
}