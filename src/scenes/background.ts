import { Scene } from 'phaser';
import ENEMY_TYPES from '~/sprites/enemies/enemy_types.json';
import Preload from '~/scenes/preloader';
export default class Sky extends Scene {

  constructor() {
    super({
      key: 'background',
      active: false,
    });
  }

  create() {
    const test = this.add.image(400, 400, ENEMY_TYPES.GREEN_SHIP_REVERSED.TEXTURE_NAME);
    const test2 = this.add.image(600, 500, ENEMY_TYPES.GREEN_SHIP_REVERSED.TEXTURE_NAME);
    const preloader = this.scene.get('preloader') as Preload;
    this.cameras.main.setRenderToTexture(preloader.blurPipeline);
    const camera = this.cameras.add();
    this.cameras.main.ignore(test);
    camera.ignore(test2);
    this.scene.bringToTop();
  }

}