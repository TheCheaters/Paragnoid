import Game from '~/scenes/game';
import enemyTimeline from '~/game_timeline/storyboard.json';
import ENEMY_TYPES from '~/sprites_and_groups/enemy_types.json';
import ENEMY_BEHAVIORS from '~/sprites_and_groups/enemy_behaviors.json';

export type EnemyBlock = {
  delay: number;
  waves: number;
  wavesDelay: number;
  enemyQuantity: number;
  enemyType: keyof typeof ENEMY_TYPES;
  enemyBehavior: keyof typeof ENEMY_BEHAVIORS;
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
        enemyType,
        enemyBehavior,
        enemyQuantity
      } = block as EnemyBlock;
      time += delay;

      for (let wave = 0; wave < waves; wave++) {

        time += wave * wavesDelay;

        this.scene.time.addEvent({
          delay: time,
          callback: () => {
            if (this.scene.enemies) {
              for (let enemies = 0; enemies < enemyQuantity; enemies++) {
                console.log(`
                  sending group of ${enemyQuantity} enemies
                  of type ${enemyType} with ${enemyBehavior} behavior
                `);
                this.scene.enemies.makeEnemy({ enemyType, enemyBehavior });
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