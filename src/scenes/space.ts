import { Scene } from 'phaser';
import Game from '~/scenes/game';
import { SPACE, SUN } from '~/constants.json';

export default class Space extends Scene {
  private bg!: Phaser.GameObjects.TileSprite;
  private sun!: Phaser.GameObjects.Image;
  private planet!: Phaser.GameObjects.Image;
  private gameInstance!: Game;
  constructor() {
    super({
      key: 'space',
      active: false,
    });
  }
  create() {
    this.bg = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, SPACE).setOrigin(0);
    this.sun = this.add.image(0, 0, SUN).setPosition(this.scale.width / 4, this.scale.height / 4).setScale(0.3, 0.3);
    this.gameInstance = this.scene.get('game') as Game;
    this.gameInstance.timeline.start('space');
  }

  update(time, delta) {

    let backgroundVelocity = 0;

    const VelocityX = 0;
    const VelocityY = 0;

    backgroundVelocity = VelocityX > 0 ? VelocityX / 100 : 0;
    this.bg.tilePositionY += VelocityY / 500;

    this.bg.tilePositionX += 1 + backgroundVelocity;

    this.sun.rotation += 0.00006 * delta;
    }
}