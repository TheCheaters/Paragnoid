import * as C from '~/constants.json';
import { Scene } from 'phaser';
export default class GameOver extends Scene {
  public ricominciamoText!: Phaser.GameObjects.DynamicBitmapText;
  constructor() {
    super({
      key: 'gameover',
      active: false,
    });
  }
  create(){
    this.add.image(this.scale.width / 2, this.scale.height / 2, C.INFOPANEL_OVER);
    // this.sound.add(C.AUDIO_OVER, {loop: false}).play();
    this.ricominciamoText = this.add.dynamicBitmapText(this.scale.width / 2, this.scale.height / 2 + 100, C.PV_FONT_NAME, 'clicca per ricominciare', 14 ).setOrigin(0.5);

    this.scene.stop('keys-controller');
    this.scene.stop('game');
    this.scene.stop('ui');

    this.input.once('pointerdown', () => {
      this.scene.start('intro');
    });
  }
}
