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

    const launchCallbacks = (callbacks) => callbacks.forEach(cb => {
      const [group, fn] = cb.split('.');
      if (!fn) throw new Error('Warning, callback must be in the form of ["gameMember.function", ...] ');
      console.log(`Now executing callback ${cb}`);
      this.scene[group][fn]();
    })

    enemyTimeline.quadro_uno.forEach((block, i) => {

      const {
        delay,
        waves,
        wavesDelay,
        singleWave,
        enemyType,
        enemyBehavior,
        enemyPath,
        enemyQuantity,
        callbacks
      } = block as EnemyBlock;

      time += delay;

      if (enemyPath && singleWave === true) throw new Error('Warning, multiple enemies in one path at the same time!');

      for (let wave = 1; wave <= waves; wave++) {

        if (singleWave) {

          this.scene.time.addEvent({
            delay: time,
            callback: () => {
              for (let enemies = 1; enemies <= enemyQuantity; enemies++) {
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
                  this.scene.enemies.makeEnemy({ enemyType, enemyBehavior, enemyPath });
              },
              callbackScope: this,
              loop: false
            });

            time += (wave * wavesDelay) + (500 * enemies);

          }
        }
      }

      if (callbacks) {
        this.scene.time.addEvent({
          delay: time,
          callback: () => launchCallbacks(callbacks),
          callbackScope: this,
          loop: false,
        })
      }
    })
  }
}

