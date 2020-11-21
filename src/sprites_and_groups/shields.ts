import Game from '~/scenes/game';
import { BLUE_PARTICLE } from '~/constants.json';

export default class Shields extends Phaser.GameObjects.Particles.ParticleEmitter {

  constructor(scene: Game) {
    super(scene.add.particles(BLUE_PARTICLE), {
        x: 400,
        y: 300,
        blendMode: 'SCREEN',
        scale: { start: 0.2, end: 0 },
        speed: { min: -100, max: 100 },
        quantity: 30,
    });
    console.log(this);
    this.forEachDead(particle => {
      console.log(particle)
    }, this);
    this.setVisible(true);
  }

}