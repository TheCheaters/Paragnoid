import Game from '~/scenes/game';
import enemyTimeline from '~/enemy-timeline.json';

export default class Timeline {
  private scene!: Game;
  constructor(scene: Game) {
    this.scene = scene;
  }
  start() {

    let tempo = 0;

    enemyTimeline.quadro_uno.forEach((onda) => {
      tempo += onda.delay;
      this.scene.time.addEvent({
        delay: tempo,
        callback: () => {
          if (this.scene.enemies) {
            for (let index = 0; index < onda.enemyQuantity; index++) {
              this.scene.enemies.makeEnemy();
            }
          }
        },
        callbackScope: this,
        loop: false });
    })
  }
}
