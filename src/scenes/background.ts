import { Scene } from 'phaser';
import Game from '~/scenes/game';

const SPACE            = 'space';
const SPACE_ASSET_PATH = 'assets/space-background.gif';

export default class Background extends Scene {
  private bg?: Phaser.GameObjects.TileSprite;
  private gameInstance?: Game;
  constructor() {
    super({
      key: 'background',
      active: true,
    });
  }
  preload() {
    this.load.image(SPACE, SPACE_ASSET_PATH);
  }
  create() {
    this.bg = this.add.tileSprite(0, 0, 1600, 1200, SPACE).setOrigin(0);
    this.gameInstance = this.scene.get('gameInstance') as Game;
  }
  update() {
    if (this.bg && this.gameInstance) {
      const backgroundVelocity = this.gameInstance.VelocityX > 0 ? this.gameInstance.VelocityX / 100 : 0;
      this.bg.tilePositionX += 1 + backgroundVelocity;
      this.bg.tilePositionY += this.gameInstance.VelocityY / 50;
    }
  }
}