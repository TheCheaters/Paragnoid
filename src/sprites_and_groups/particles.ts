import Game from '~/scenes/game';
import { BLUE_PARTICLE } from '~/constants.json';

export default class Particles {
  public shield!: Phaser.GameObjects.Particles.ParticleEmitter;
  private shieldEnergy = 30;
  private scene: Game;

  constructor(scene: Game) {
    this.scene = scene;
    this.createShield();
  }

  createShield() {
    this.shield = this.scene.add.particles(BLUE_PARTICLE)
      .createEmitter({
        x: 400,
        y: 300,
        blendMode: 'SCREEN',
        scale: { start: 0.2, end: 0 },
        speed: { min: -100, max: 100 },
        quantity: this.shieldEnergy,
        visible: false,
      })
      .setEmitZone({
        source: new Phaser.Geom.Circle(0, 0, 100),
        type: 'edge',
        quantity: 50
      });
  }

  shieldUp() {
    this.shield.setVisible(true);
    console.log(this.shield.visible);
    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.shieldEnergy -= 5;
        this.changeShield(this.shieldEnergy);
        if (this.shieldEnergy <= 0) this.resetShield()
      },
      loop: false,
      repeat: this.shieldEnergy / 5,
    })

  }

  resetShield() {
    this.shieldEnergy = 30;
    this.shield.setVisible(false);
  }

  shieldDown() {
    this.shield.setVisible(false);
  }

  moveShield(x: number, y: number) {
    this.shield.setPosition(x, y);
  }

  changeShield(qty: number) {
    this.shield.setQuantity(qty);
  }

}