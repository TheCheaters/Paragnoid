import { Scene } from 'phaser';

export const FONT_NAME            = 'lady_radical';
export const FONT_PATH            = 'assets/fonts/lady_radical/lady_radical.png';
export const FONT_XML_PATH        = 'assets/fonts/lady_radical/lady_radical.xml';

export default class Intro extends Scene {
  private text!: Phaser.GameObjects.DynamicBitmapText;
  constructor() {
    super({
      key: 'intro',
      active: true,
    });
  }
  preload() {
    this.load.bitmapFont(FONT_NAME, FONT_PATH, FONT_XML_PATH);
  }
  create() {
    this.text = this.add.dynamicBitmapText(400, 300, FONT_NAME, 'Paragnoid', 60 ).setOrigin(0.5);
    this.input.once('pointerdown', () => {

      this.scene.start('game');

    });
  }
}