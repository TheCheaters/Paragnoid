import { Scene } from 'phaser';
import Game from '~/scenes/game';
import { SPACE, SPACE_ASSET_PATH, SUN, SUN_ASSET_PATH } from '~/constants.json';

export default class Background extends Scene {
  private bg!: Phaser.GameObjects.TileSprite;
  private sun!: Phaser.GameObjects.Image;
  private gameInstance!: Game;
  constructor() {
    super({
      key: 'background',
      active: false,
    });
  }
  preload() {
    this.load.image(SPACE, SPACE_ASSET_PATH);
    this.load.image(SUN, SUN_ASSET_PATH);
  }
  create() {
    this.bg = this.add.tileSprite(0, 0, 1024, 1024, SPACE).setOrigin(0);
    this.sun = this.add.image(0, 0, SUN).setPosition(1000, 200)
    this.gameInstance = this.scene.get('game') as Game;
  }
  update(time, delta) {

    let backgroundVelocity = 0;

    if (this.gameInstance) {
      backgroundVelocity = this.gameInstance.VelocityX > 0 ? this.gameInstance.VelocityX / 100 : 0;
      this.bg.tilePositionY += this.gameInstance.VelocityY / 500;
    }

    this.bg.tilePositionX += 1 + backgroundVelocity;

    this.sun.x -= 0.01;
    // this.sun.y += this.gameInstance.VelocityY / 5000;

    if (this.sun.x < -200) this.sun.x = 1000;
    this.sun.rotation += 0.00006 * delta;
    }
}