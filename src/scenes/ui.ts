import { PV_FONT_NAME } from '~/constants.json';
import { Scene } from 'phaser';

export default class UserInterface extends Scene {
  public score = 0;
  public scoreText!: Phaser.GameObjects.DynamicBitmapText;

  constructor() {
    super({
      key: 'ui',
      active: false,
    });
  }

  create() {
    this.scoreText = this.add.dynamicBitmapText(16, 16, PV_FONT_NAME, 'Score: 0', 14 );
  }

  addScore(scoreValue: number) {
    this.score += scoreValue;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  resetScore() {
    this.score = 0;
  }

}