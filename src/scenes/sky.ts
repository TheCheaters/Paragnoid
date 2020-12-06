import { Scene } from 'phaser';
import { NUVOLE } from '~/constants.json';
import { HORIZON } from '~/constants.json';

import nuvoleAtlas from '~/atlantes/nuvole.json';

export default class Sky extends Scene {
  distance = 1500;
  cloudDeltaSpeed = 2;
  private bg!: Phaser.GameObjects.TileSprite;
  private clouds!: {
    image: Phaser.GameObjects.Image,
    x: number;
    y: number;
  }[];
  constructor() {
    super({
      key: 'sky',
      active: false,
    });
  }

  create() {
    this.bg = this.add.tileSprite(560, 240, 1280, 720, HORIZON);
    this.clouds = nuvoleAtlas.textures[0].frames.map((frame, index) => ({
      image: this.add.image(this.scale.width + (this.distance * index), index * 200, NUVOLE, frame.filename).setOrigin(0),
      x: this.scale.width + (this.distance * index),
      y: Phaser.Math.Between(0, 600),
    }));
    }

  update(time, delta) {

    this.bg.tilePositionX += 10;

    for (let index = 0; index < this.clouds.length; index++) {
      const cloud = this.clouds[index];
      cloud.image.setPosition(cloud.x, cloud.y);
      if (cloud.x > -this.distance) {
        // scroll
        cloud.x = cloud.x - (this.cloudDeltaSpeed * (index + 1));
      } else {
        // reset
        cloud.x = this.scale.width + (this.distance * index);
        cloud.y = Phaser.Math.Between(0, 600);
      }
    }

  }
}