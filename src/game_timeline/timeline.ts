import Game from '~/scenes/game';
import enemyTimeline from '~/game_timeline/storyboard.json';
import ENEMY_TYPES from '~/sprites_and_groups/enemy_types.json';
import ENEMY_BEHAVIORS from '~/sprites_and_groups/enemy_behaviors.json';
import ENEMY_PATHS from '~/sprites_and_groups/enemy_paths.json';

export type EnemyBlock = {
  delay: number;
  waves: number;
  wavesDelay: number;
  singleWave: boolean;
  enemyQuantity: number;
  enemyType: keyof typeof ENEMY_TYPES;
  enemyPath: keyof typeof ENEMY_PATHS | null;
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
        singleWave,
        enemyType,
        enemyBehavior,
        enemyPath,
        enemyQuantity
      } = block as EnemyBlock;

      time += delay;

      if (enemyPath && singleWave === true) throw new Error('Warning, multiple enemies in one path at the same time!');

      for (let wave = 1; wave <= waves; wave++) {

        // time += wave * wavesDelay;

        if (singleWave) {

          this.scene.time.addEvent({
            delay: time,
            callback: () => {
              for (let enemies = 1; enemies <= enemyQuantity; enemies++) {
                console.log(`
                  sending a whole group of ${enemyQuantity} enemies
                  of type ${enemyType} with ${enemyBehavior} behavior
                `);
                this.scene.enemies.makeEnemy({ enemyType, enemyBehavior, enemyPath });
              }
            },
            callbackScope: this,
            loop: false
          });

          time += wave * wavesDelay;

        } else {

          for (let enemies = 1; enemies <= enemyQuantity; enemies++) {
            this.scene.time.addEvent({
              delay: time,
              callback: () => {
                  console.log(`
                    sending enemy number ${enemies} of ${enemyQuantity} enemies
                    of type ${enemyType} with ${enemyBehavior} behavior
                  `);
                  this.scene.enemies.makeEnemy({ enemyType, enemyBehavior, enemyPath });
                },
                callbackScope: this,
                loop: false
              });
            time += (wave * wavesDelay) + (500 * enemies);
          }
        }
      }
    })
  }
}