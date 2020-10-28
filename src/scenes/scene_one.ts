import { Physics, Scene } from 'phaser';

export default class SceneOne extends Scene {

  constructor() {
    super('scene-one')
  }
  preload() {
    this.load.atlas ('spacecraft', "assets/spacecraft.png", "assets/spacecraft.json");
    
  }
  create() {
    this.add.image(400, 300, "spacecraft");

    this.anims.create ({
      key: "accelerate",
      frames: [{ key: "spacecraft", frame: 4}],
      frameRate: 20
    });

    this.anims.create ({
      key: "decelerate",
      frames: [{ key: "spacecraft", frame: 4}],
      frameRate: 20
    })
    this.anims.create ({
      key: "goup",
      frames: [{ key: "spacecraft", frame: 4}],
      frameRate: 20
    });
    this.anims.create ({
      key: "godown",
      frames: [{ key: "spacecraft", frame: 4}],
      frameRate: 20
    });

  }

  update() {
  }
}