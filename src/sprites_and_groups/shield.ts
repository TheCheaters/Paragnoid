import Game from '~/scenes/game';
import { BLUE_PARTICLE } from '~/constants.json';

export default class Shield extends Phaser.GameObjects.Particles.ParticleEmitter {
  constructor(scene: Game) {
    super(new Phaser.GameObjects.Particles.ParticleEmitterManager(scene, BLUE_PARTICLE), {
      x: 400,
      y: 300,
      blendMode: 'SCREEN',
      scale: { start: 0.2, end: 0 },
      speed: { min: -100, max: 100 },
      quantity: 30,
    });

    this.setEmitZone({
      source: new Phaser.Geom.Circle(0, 0, 100),
      type: 'edge',
      quantity: 50
    })
  }
}
