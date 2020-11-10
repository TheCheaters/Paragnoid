import { Scene } from "phaser";

export default class MissileGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene: Scene, texture: string, classType: Function) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 100,
      setXY: { x: 1000, y: 2000 },
      key: texture,
      active: false,
      visible: false,
      classType: classType
    });

  }

  fireBullet(x: number, y: number, type: string) {
    const missile = this.getFirstDead(false);

    if (missile) {
      missile.fire(x, y, type);
    }
  }
}