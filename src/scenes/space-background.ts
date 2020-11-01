import { Physics, Scene } from 'phaser';
import SpacecraftScene from '~/scenes/spacecraft-scene';

const SPACE             = 'space';
const SPACE_ASSET_PATH  = 'assets/space-background.gif';

export default class SpaceBackground extends Scene {
  private bg?: Phaser.GameObjects.TileSprite;
  private spaceCraftScene?: SpacecraftScene;
  constructor() {
    super({
      key: 'space-scene',
      active: true,
    });
  }
  preload() {
    this.load.image(SPACE, SPACE_ASSET_PATH);
  }
  create() {
    this.bg = this.add.tileSprite(0, 0, 800, 600, SPACE).setOrigin(0);
    this.spaceCraftScene = this.scene.get('spacecraft-scene') as SpacecraftScene;
  }
  update() {
    if (this.bg && this.spaceCraftScene) {
      const backgroundVelocity = this.spaceCraftScene.VelocityX > 0 ? this.spaceCraftScene.VelocityX / 100 : 0;
      this.bg.tilePositionX += 1 + backgroundVelocity;
      this.bg.tilePositionY += this.spaceCraftScene.VelocityY / 50;
    }
  }
}