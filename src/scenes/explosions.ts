import { Scene } from "phaser";

class Explosion extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, 100, 100, 'explosion');
  }

	preUpdate(time: number, delta: number) {

	}

}

export default class Explosions extends Phaser.Physics.Arcade.Group {
  constructor(scene: Scene, texture: string) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 30,
      setXY: { x: 1000, y: 2000 },
      key: texture,
      active: false,
      visible: false,
      classType: Explosion,
    });

  }
}