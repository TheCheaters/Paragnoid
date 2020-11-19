import { Scene } from "phaser";
import Game from '../scenes/game';
import { POWERUP, FLARES } from '~/constants.json';

export class Powerup extends Phaser.Physics.Arcade.Sprite {
  private path?: { t: number, vec: Phaser.Math.Vector2 };
  private curve?: Phaser.Curves.Spline | null;
  private tween?: Phaser.Tweens.Tween | null;
  private points?: number[];
  private flares!: Phaser.GameObjects.Particles.ParticleEmitter;
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, POWERUP);
    this.setData('powerupValues', {
      potenza: 100
    });
  }

  make() {
    // RESET PREVIOUS PATH
    this.curve = null;
    this.tween = null;

    // POSITION
    const y = Phaser.Math.Between(0, this.scene.scale.height);
    const x = this.scene.scale.width + 100;
    this.setOrigin(0.5, 0.5);
    this.body.reset(x, y);

    // DIRECTION
    this.path = { t: 0, vec: new Phaser.Math.Vector2() };
    this.points = [
      1300, Phaser.Math.Between(0, 600),
      Phaser.Math.Between(0, 1200), Phaser.Math.Between(0, 600),
      Phaser.Math.Between(0, 1200), Phaser.Math.Between(0, 600),
      Phaser.Math.Between(0, 1200), Phaser.Math.Between(0, 600),
      Phaser.Math.Between(0, 1200), -150
    ];
    this.curve = new Phaser.Curves.Spline(this.points);
    this.tween = this.scene.tweens.add({
      targets: this.path,
      t: 1,
      duration: 10000,
      repeat: 0
    });

    // BEHAVIOR
    this.body.immovable = true;
    this.body.enable = true;
    this.setActive(true);
    this.setVisible(true);

    // PARTICLES
    this.flares = this.scene.add.particles(FLARES).createEmitter({
      frame: 'red',
      x: 200,
      y: 300,
      alpha: 0.3,
      lifespan: 100,
      speed: { min: -400, max: 100 },
      gravityY: 300,
      scale: { start: 0.4, end: 0 },
      quantity: 2,
      blendMode: 'LIGHTEN',
      on: true,
    });


  }

  kill() {
    this.body.enable = false;
    this.setActive(false);
    this.setVisible(false);
    this.setVelocity(0);
    this.flares.explode(20, this.x, this.y);
  }

	preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    this.play(POWERUP, true);
    if (this.path && this.curve) {
      this.curve.getPoint(this.path.t, this.path.vec);
      const { x, y } = this.path.vec;
      this.x = x;
      this.y = y;
    }

    this.flares.setPosition(this.x, this.y);

		if (this.x < -100) {
			this.kill();
		}
	}

}

export default class Powerups extends Phaser.Physics.Arcade.Group {
  constructor(scene: Scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 5,
      key: POWERUP,
      setXY: {x: -100, y: -100},
      setScale: {x: 0.5, y: 0.5},
      active: false,
      visible: false,
      classType: Powerup
    });

    scene.anims.create({
      key: POWERUP,
      frames: scene.anims.generateFrameNumbers(POWERUP, {
        start: 0,
        end: 16
      }),
      frameRate: 12
    });

  }

  launchPowerup() {
    const powerup = this.getFirstDead(false) as Powerup;
    if (powerup) powerup.make();
  }
}
