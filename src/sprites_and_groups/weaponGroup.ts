import { Scene } from "phaser";

export default class WeaponGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene: Scene, texture: string, classType: Function) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 100,
      setXY: {x: -100, y: -100},
      key: texture,
      active: false,
      visible: false,
      classType: classType
    });

  }

  fireBullet(x: number, y: number, type: string, fireSpeed: number) {
    const weapon = this.getFirstDead(false);

    if (weapon) {
      weapon.fire(x, y, type, fireSpeed);
    }
  }
}