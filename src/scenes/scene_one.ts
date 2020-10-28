import { Physics, Scene } from 'phaser';

export default class SceneOne extends Scene {

  constructor() {
    super('scene-one')
  }
  preload() {
    this.load.image('sky', 'assets/sky.png');
  }
  create() {
    this.add.image(400, 300, 'sky');

  }

  update() {
  }
}