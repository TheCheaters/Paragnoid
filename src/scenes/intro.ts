import { Scene } from 'phaser';
import { GAME_NAME, GAME_TITLE, LR_FONT_NAME } from "~/constants.json"
import UI from '~/scenes/ui';
import enemyTimeline from '~/game_timeline/storyboard.json';

export default class Intro extends Scene {
  private text!: Phaser.GameObjects.DynamicBitmapText;
  constructor() {
    super({
      key: 'intro',
      active: false,
    });
  }
  create() {
    this.add.dynamicBitmapText(this.scale.width / 2, this.scale.height / 2, LR_FONT_NAME, GAME_NAME, 60 ).setOrigin(0.5);
    this.add.dynamicBitmapText(this.scale.width / 2, (this.scale.height / 2) +  50, LR_FONT_NAME, GAME_TITLE, 15 ).setOrigin(0.5);
    this.text = this.add.dynamicBitmapText(this.scale.width / 2, (this.scale.height / 2) +  120, LR_FONT_NAME, 'click to start', 20 ).setOrigin(0.5);

    const ui = this.scene.get('ui') as UI;
    ui.resetScore();

    Object.keys(enemyTimeline).forEach((sceneName) => {
      this.scene.stop(sceneName);
    });

    this.input.once('pointerdown', () => {
      this.scene.start('game');
    });

    this.input.gamepad.once('down', () => {
      this.scene.start('game');
    });
  }

  update(time, delta) {
    const alphaValue = (time % 1500 > 750) ? 0 : 1;
    this.text.setAlpha(alphaValue);
  }
}