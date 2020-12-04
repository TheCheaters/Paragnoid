import { Scene } from 'phaser';
import { NUVOLE } from '~/constants.json';
import nuvoleAtlas from '~/atlantes/nuvole.json';

export default class Sky extends Scene {
  constructor() {
    super({
      key: 'sky',
      active: false,
    });
  }

  create() {
    nuvoleAtlas.textures[0].frames.forEach((frame) => {
      this.add.image(400, 200, NUVOLE, frame.filename);
    })
  }

  update(time, delta) {
    }
}