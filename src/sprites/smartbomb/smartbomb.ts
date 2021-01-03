import Game from '~/scenes/game';
import { BLUE_PARTICLE, FLARES,  SPACECRAFT_FRAME_WIDTH, SPACECRAFT_FRAME_HEIGHT } from '~/constants.json';

export default class Smartbomb {

  private emitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private energy = 0;
  private scene: Game;
  private manager!: Phaser.GameObjects.Particles.ParticleEmitterManager;

  constructor(scene: Game) {
    this.scene = scene;
    this.createSmartbomb(600, 400);
  }
  createSmartbomb(x: number, y: number) {
    this.manager = this.scene.add.particles(FLARES);
    this.emitter = this.manager
      .createEmitter({
        frame: 'red',
        x: x,
        y: y,
        lifespan: {min:1300, max:2200},
        angle: {start:0, end: 360, steps:64},
        speed: 200,
        blendMode: 'ADD',
        scale: { start: 0.2, end: 0.1 },
        quantity: 64,
        frequency: 32,
        visible: false,
      })};

smartbombLaunch(){
    this.emitter.setVisible(true);
}


}