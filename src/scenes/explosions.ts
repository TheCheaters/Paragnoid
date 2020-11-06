import { Scene } from "phaser";
import { EXPLOSION } from './game';

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

    scene.add.existing(this);
    scene.physics.add.existing(this);

    scene.anims.create ({
      frames: scene.anims.generateFrameNumbers(EXPLOSION, {
        start: 0,
        end: 9
      }),
      frameRate: 20
    });

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