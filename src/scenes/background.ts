import { Scene } from 'phaser';
import enemyTimeline from '~/game_timeline/storyboard.json';
import ENEMY_TYPES from '~/sprites/enemies/enemy_types.json';

export type TimeLineScenes = keyof typeof enemyTimeline

export default class Sky extends Scene {
  private interval?: number;
  private enemies: Phaser.GameObjects.Image[] = [];
  constructor() {
    super({
      key: 'background',
      active: false,
    });
  }

  launchEnemyWawe(sceneName: TimeLineScenes) {
    enemyTimeline[sceneName].forEach((block, i) => {
      const { waves, enemyQuantity, enemyType } = block;
      const { TEXTURE_NAME } = ENEMY_TYPES[enemyType];
      for (let index = 0; index < waves; index++) {
        for (let index = 0; index < enemyQuantity; index++) {
          const image = this.add
            .image(0, 0, TEXTURE_NAME)
            .setAlpha(.8)
            .setScale(0.3)
            .setRandomPosition()
            .setFlipX(true);

          this.enemies.push(image);
        }
      }
    });
  }

  stopEnemyWave() {
    clearTimeout(this.interval);
    this.enemies.forEach(image => {
      image.destroy();
    });
    this.enemies.splice(0, this.enemies.length);
  }

}