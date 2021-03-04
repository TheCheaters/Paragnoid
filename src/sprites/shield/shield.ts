import Game from '~/scenes/game';
import { FLARES } from '~/configurations/images.json';
import eventManager from '~/emitters/event-manager';
import * as S from '~/configurations/sounds.json';


export default class Shield {
  private scene: Game;
  private manager!: Phaser.GameObjects.Particles.ParticleEmitterManager;
  private emitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  constructor(scene: Game) {
    this.scene = scene;
    this.manager = this.scene.add.particles(FLARES);
  }
  createShield() {
    this.emitter = this.manager
      .createEmitter({
        x: 0,
        y: 0,
        blendMode: 'ADD',
        scale: { start: 0.1, end: 0 },
        speed: { min: -100, max: 100 },
        lifespan: 100,
        quantity: 110,
        visible: false,
      })
      .setEmitZone({
        source: new Phaser.Geom.Circle(0, 0, 100),
        type: 'random',
        quantity: 110,
      });
  }
  get isUp() {
    return this?.emitter?.visible === true;
  }
  shieldUp() {
    const scene = this.scene as Game;
    this.createShield();
    this.emitter.setVisible(true);
    eventManager.emit(`play-${S.BUILDSP1}`);
    scene.mainCamera.shake(250, 0.005);
  }
  shieldDown() {
    this.emitter.setLifespan(1000);
    this.emitter.explode(110, 0, 0);
    this.emitter.setVisible(false);
  }
  moveShield(x: number, y: number) {
    this.manager.setPosition(x, y);
  }
}