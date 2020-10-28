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

  }

  update() {
  }
}