import Game from '~/scenes/game';
import enemyTimeline from '~/storyboard.json';
import { ENEMY_BEHAVIOR } from '~/constants.json';

export type EnemyBlock = {
  delay: number;
  waves: number;
  wavesDelay: number;
  enemyQuantity: number;
  enemyTexture: string;
  enemyBehavior: keyof typeof ENEMY_BEHAVIOR;
  callbacks: string[];
}

export type StoryBoard = {
  [key: string]: EnemyBlock[];
}

export default class Timeline {
  private scene!: Game;
  constructor(scene: Game) {
    this.scene = scene;
  }
  start() {

    let time = 0;

    enemyTimeline.quadro_uno.forEach((block, i) => {

      const {
        delay,
        waves,
        wavesDelay,
        enemyTexture,
        enemyBehavior,
        enemyQuantity
      } = block as EnemyBlock;
      time += delay;
      console.log(`block ${i + 1} created`);

      for (let wave = 0; wave < waves; wave++) {

        time += wave * wavesDelay;

        console.log(`wave ${wave + 1} created`);
        console.log(JSON.stringify(time));
        this.scene.time.addEvent({
          delay: time,
          callback: () => {
            if (this.scene.enemies) {
              for (let enemies = 0; enemies < enemyQuantity; enemies++) {
                console.log(`sending group of ${enemyQuantity} enemies`);
                this.scene.enemies.makeEnemy({ enemyTexture, enemyBehavior });
              }
            }
          },
          callbackScope: this,
          loop: false
        });
      }
    })
  }
}