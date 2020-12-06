import { Scene } from 'phaser';
import { GAME_NAME, GAME_TITLE, LR_FONT_NAME } from "~/constants.json"

export default class Intro extends Scene {
  private text!: Phaser.GameObjects.DynamicBitmapText;
  constructor() {
    super({
      key: 'intro',
      active: false,
    });
  }
  create() {
    this.text = this.add.dynamicBitmapText(this.scale.width / 2, this.scale.height / 2, LR_FONT_NAME, GAME_NAME, 60 ).setOrigin(0.5);
    this.text = this.add.dynamicBitmapText(this.scale.width / 2, (this.scale.height / 2) +  50, LR_FONT_NAME, GAME_TITLE, 20 ).setOrigin(0.5);

    this.input.once('pointerdown', () => {
      this.scene.start('game');
      this.scene.start('sky');
      this.scene.start('ui');
    });
  }
}