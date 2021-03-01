import { PV_FONT_NAME, FLARES } from '~/constants.json';
import { Scene } from 'phaser';
import debug from '~/utils/debug';
import Game from '~/scenes/game';

export default class UserInterface extends Scene {
  public score = 0;
  private gameInstance!: Game;
  private scoreText!: Phaser.GameObjects.DynamicBitmapText;
  private energyText!: Phaser.GameObjects.DynamicBitmapText;
  private fpsText!: Phaser.GameObjects.Text;
  private style!: Phaser.GameObjects.Graphics;
  private manager!: Phaser.GameObjects.Particles.ParticleEmitterManager;
  private emitter!: Phaser.GameObjects.Particles.ParticleEmitter;

  private energyLine!: Phaser.Geom.Line;
  private energyLineXPos = 130;
  private energyLineMaxWidth = 1040;
  private particleQuantity = 130;

  constructor() {
    super({
      key: 'ui',
      active: false,
    });
  }

  create() {
    this.gameInstance = this.scene.get('game') as Game;
    this.scoreText = this.add.dynamicBitmapText(16, 16, PV_FONT_NAME, 'Score: 0', 14 );
    this.energyText = this.add.dynamicBitmapText(16, this.scale.height -16, PV_FONT_NAME, 'Energy', 14 ).setOrigin(0, 1);
    if (debug) {
      this.fpsText = this.add.text(10, 40, 'FPS: -- \n-- Particles', {
        font: 'bold 16px Arial',
      });
    }
    this.style = this.add.graphics({ lineStyle: { width: 1, color: 0xFFFFFF } });
    this.energyLine = new Phaser.Geom.Line();
    this.setLineMaxWidth();
    this.setLineEmitter();
  }

  addScore(scoreValue: number) {
    this.score += scoreValue;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  resetScore() {
    this.score = 0;
  }

  setLineEmitter() {
    this.manager = this.add.particles(FLARES);
    this.emitter = this.manager
      .createEmitter({
        name: 'fire',
        frame: [
          'blue',
        ],
        x: 0, y: 0,
        speed: 40,
        lifespan: 100,
        quantity: this.particleQuantity,
        scale: { start: 0.2, end: 0 },
        blendMode: 'ADD',
        emitZone: { type: 'random', source: this.energyLine, quantity: this.particleQuantity }
      })
  }

  setLineMaxWidth() {
    this.energyLine.x1 = this.energyLineXPos;
    this.energyLine.x2 = this.energyLineXPos +  this.energyLineMaxWidth;
    this.energyLine.y1 = this.scale.height -25;
    this.energyLine.y2 = this.scale.height -25;
  }

  lineWidth() {
    const { player } = this.gameInstance;
    const { energyRatio } = player;
    this.energyLine.x2 = (this.energyLineMaxWidth * energyRatio) + this.energyLineXPos;
    this.emitter.setQuantity(this.particleQuantity * energyRatio);
  }


  update (time, delta) {
    this.lineWidth();
    if (debug) this.fpsText.setText('FPS: ' + (1000/delta).toFixed(3) + '\n');
  }

}