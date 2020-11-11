import { Scene } from "phaser";
import { EXPLOSION } from '~/constants.json';

class Explosion extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, EXPLOSION);
    this.play(EXPLOSION, true);
  }

  explode (x: number, y: number) {
    this.body.enable = true;
    this.body.reset(x, y);
    this.play(EXPLOSION, true);
    this.setActive(true);
    this.setVisible(true);
    this.on('animationcomplete', (...args) => this.kill());

  }

  kill() {
    this.body.enable = false;
    this.setActive(false);
    this.setVisible(false);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    this.play(EXPLOSION, true);
    this.anims.update(time, delta);
	}
}

export default class Explosions extends Phaser.Physics.Arcade.Group {
  constructor(scene: Scene, texture: string) {
    super(scene.physics.world, scene);

    scene.anims.create ({
      key: EXPLOSION,
      frames: scene.anims.generateFrameNumbers(EXPLOSION, {
        start: 0,
        end: 9
      }),
      frameRate: 20,
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

  addExplosion(x: number, y: number){
    const explosion = this.getFirstDead(false);

    if (explosion) {
      explosion.explode(x, y);
    }
  }
}