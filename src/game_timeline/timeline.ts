import enemyTimeline from '~/game_timeline/storyboard.json';
import ENEMY_TYPES from '~/sprites/enemies/enemy_types.json';
import ENEMY_BEHAVIORS from '~/sprites/enemies/enemy_behaviors.json';
import ENEMY_PATHS from '~/sprites/enemies/enemy_paths.json';
import Level from '~/scenes/level';
import Game from '~/scenes/game';

export type EnemyBlock = {
  delay: number;
  waves: number;
  wavesDelay: number;
  singleWave: boolean;
  enemyQuantity: number;
  enemyDelay: number;
  enemyType: keyof typeof ENEMY_TYPES;
  enemyPath: keyof typeof ENEMY_PATHS | null;
  enemyBehavior: keyof typeof ENEMY_BEHAVIORS;
  callbacks: string[];
}

export type TimeLineScenes = keyof typeof enemyTimeline

export type StoryBoard = {
  [key: string]: EnemyBlock[];
}

export default class Timeline {
  private scene!: Level;
  private timers: Phaser.Time.TimerEvent[] = [];
  private gameInstance: Game;
  constructor(scene: Level) {
    this.scene = scene;
    this.gameInstance = this.scene.scene.get('game') as Game;
  }
  start(sceneName: TimeLineScenes) {

    console.log(`Start timeline of ${sceneName}`);

    let time = 0;

    const launchCallbacks = (callbacks) => callbacks.forEach(cb => {
      const [group, fn] = cb.split('.');
      if (!fn) throw new Error('Warning, callback must be in the form of ["gameMember.function", ...] ');
      console.log(`Now executing callback ${cb}`);
      this.gameInstance[group][fn]();
    })

    enemyTimeline[sceneName].forEach((block, i) => {

      const {
        delay,
        waves,
        wavesDelay,
        singleWave,
        enemyType,
        enemyBehavior,
        enemyPath,
        enemyQuantity,
        enemyDelay,
        callbacks
      } = block as EnemyBlock;

      time += delay;

      if (enemyPath && singleWave === true) throw new Error('Warning, multiple enemies in one path at the same time!');

      for (let wave = 1; wave <= waves; wave++) {

        if (singleWave) {

          const timer = this.scene.time.addEvent({
            delay: time,
            callback: () => {
              for (let enemies = 1; enemies <= enemyQuantity; enemies++) {
                this.gameInstance.enemies.makeEnemy({ enemyType, enemyBehavior, enemyPath });
                time += enemyDelay;
              }
            },
            callbackScope: this,
            loop: false
          });

          this.timers.push(timer);

        } else {

          for (let enemies = 1; enemies <= enemyQuantity; enemies++) {
            const timer = this.scene.time.addEvent({
              delay: time,
              callback: () => {
                this.gameInstance.enemies.makeEnemy({ enemyType, enemyBehavior, enemyPath });
              },
              callbackScope: this,
              loop: false
            });
            time += enemyDelay;

            this.timers.push(timer);

          }
        }

        time += wavesDelay;
      }

      if (callbacks) {
        const timer = this.scene.time.addEvent({
          delay: time,
          callback: () => launchCallbacks(callbacks),
          callbackScope: this,
          loop: false,
        });

        this.timers.push(timer);

      }

    })

  }
  stop() {
    this.timers.forEach(timer => {
      timer.remove();
    })
  }
}

