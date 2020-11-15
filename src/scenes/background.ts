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
    this.bg = this.add.tileSprite(0, 0, this.scale.width, this.scale.width, SPACE).setOrigin(0);
    this.sun = this.add.image(0, 0, SUN).setPosition(this.scale.width / 4, this.scale.height / 4).setScale(0.3, 0.3);
    this.gameInstance = this.scene.get('game') as Game;
  }

  update(time, delta) {

    let backgroundVelocity = 0;

    const VelocityX = this.gameInstance?.player?.VelocityX || 0;
    const VelocityY = this.gameInstance?.player?.VelocityY || 0;

    backgroundVelocity = VelocityX > 0 ? VelocityX / 100 : 0;
    this.bg.tilePositionY += VelocityY / 500;

    this.bg.tilePositionX += 1 + backgroundVelocity;

    this.sun.rotation += 0.00006 * delta;
    }
}