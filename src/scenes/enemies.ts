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

		if (this.x < -100) {
			this.setActive(false);
			this.setVisible(false);
		}
	}

}

export default class LaserGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene: Scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 30,
      key: 'enemy',
      active: false,
      visible: false,
      classType: Enemy
    });
  }

  makeEnemy(x: number, y: number) {
    const laser = this.getFirstDead(false);

    if (laser) {
      laser.make(x, y);
    }
  }
}