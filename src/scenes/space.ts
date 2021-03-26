import { SPACE, PLANETS } from '~/configurations/images.json';
import Level from '~/scenes/level';

export default class Space extends Level {
  distance = 1500;
  nebulaDeltaSpeed = 1.5;

  private bg!: Phaser.GameObjects.TileSprite;
  private nebule!: {
    image: Phaser.GameObjects.Image,
    x: number;
    y: number;
  }[];
  constructor() {
    super('space', 'sky');
  }
  create() {
    console.log('create Space');
    this.bg = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, SPACE).setOrigin(0);

    const nomiNebule = [
      // 'nebula_4.png',
      'nebula_3.png',
      'nebula_2.png',
      'nebula_1.png',
    ];
    this.nebule = nomiNebule.map((frame, index) => ({
      image: this.add.image(this.scale.width + (this.distance * index), index * 200, PLANETS, frame).setScale(2).setAlpha(0.3),
      x: this.scale.width + (this.distance * index / 5),
      y: Phaser.Math.Between(0, 600),
    }));
    super.create();
  }


  update(time, delta) {

    let backgroundVelocity = 0;

    const VelocityX = 0;
    const VelocityY = 100;

    backgroundVelocity = VelocityX > 0 ? VelocityX / 100 : 0;
    this.bg.tilePositionY += VelocityY / 500;

    this.bg.tilePositionX += 1 + backgroundVelocity;

    for (let index = 0; index < this.nebule.length; index++) {
      const nebula = this.nebule[index];
      nebula.image.setPosition(nebula.x, nebula.y);
      if (nebula.x > -this.distance) {
        // scroll
        nebula.x = nebula.x - (this.nebulaDeltaSpeed);
        nebula.image.rotation += 0.000012 * delta
      } else {
        // reset
        nebula.x = this.scale.width + this.distance;
        nebula.y = Phaser.Math.Between(-200, 800);
        nebula.image
          .setAlpha(Phaser.Math.Between(0.1, 0.5))
          .setScale(Phaser.Math.Between(2, 3));
      }
    }

    }
}