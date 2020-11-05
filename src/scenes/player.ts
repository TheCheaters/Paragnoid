import { Scene } from "phaser";
import { DIRECTIONS } from '~/globals';
import { SPACECRAFT } from '~/scenes/game';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(2);
    this.setCollideWorldBounds(true);


    scene.anims.create({
      key: DIRECTIONS.GO_RIGHT,
      frames: scene.anims.generateFrameNumbers(SPACECRAFT, {
        start: 0,
        end: 7
      }),
      frameRate: 20
    });

    scene.anims.create({
      key: DIRECTIONS.GO_LEFT,
      frames: scene.anims.generateFrameNumbers(SPACECRAFT, {
        start: 0,
        end: 7
      }),
      frameRate: 20
    })

    scene.anims.create({
      key: DIRECTIONS.GO_UP,
      frames: scene.anims.generateFrameNumbers(SPACECRAFT, {
        start: 14,
        end: 20
      }),
      frameRate: 20
    });

    scene.anims.create({
      key: DIRECTIONS.GO_DOWN,
      frames: scene.anims.generateFrameNumbers(SPACECRAFT, {
        start: 7,
        end: 13
      }),
      frameRate: 20
    });

    scene.anims.create({
      key: DIRECTIONS.STOP,
      frames: scene.anims.generateFrameNumbers(SPACECRAFT, {
        start: 0,
        end: 7
      }),
      frameRate: 20
    });

  }

}