import { Scene } from "phaser";
import Game from '~/scenes/game';
import { POWERUPS, FLARES, LEFT_KILL_ZONE, RIGHT_KILL_ZONE, RIGHT_SPAWN_ZONE, TOP_KILL_ZONE, BOTTOM_KILL_ZONE } from '~/constants.json';

export enum PowerUpTypes {
  ENERGY         = 'ENERGY',
  CHANGE_WEAPON  = 'CHANGE_WEAPON',
  UPGRADE_WEAPON = 'UPGRADE_WEAPON',
  SHIELD         = 'SHIELD',
}

const powerUpColors = {
  [PowerUpTypes.ENERGY]: 'blue',
  [PowerUpTypes.CHANGE_WEAPON]: 'green',
  [PowerUpTypes.UPGRADE_WEAPON]: 'red',
  [PowerUpTypes.SHIELD]: 'white',
  __WEAPON: 'yellow',
}

export type PowerUpType = keyof typeof PowerUpTypes;

export class Powerup extends Phaser.Physics.Arcade.Sprite {
  private path?: { t: number, vec: Phaser.Math.Vector2 };
  private curve?: Phaser.Curves.Spline | null;
  private tween?: Phaser.Tweens.Tween | null;
  private points?: number[];
  private flares!: Phaser.GameObjects.Particles.ParticleEmitter;
  public powerUpType!: PowerUpType;
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, POWERUPS);
  }

  make(type: PowerUpType) {
    // RESET PREVIOUS PATH
    this.curve = null;
    this.tween = null;

    // SET POWERUP TYPE
    this.powerUpType = type;

    // POSITION
    const y = Phaser.Math.Between(0, this.scene.scale.height);
    const x = this.scene.scale.width + 100;
    this.setOrigin(0.5, 0.5);
    this.body.reset(x, y);

    // DIRECTION
    this.path = { t: 0, vec: new Phaser.Math.Vector2() };
    this.points = [
      RIGHT_SPAWN_ZONE, Phaser.Math.Between(200, 400),
      Phaser.Math.Between(200, 1000), Phaser.Math.Between(200, 400),
      Phaser.Math.Between(200, 1000), Phaser.Math.Between(200, 400),
      Phaser.Math.Between(200, 1000), Phaser.Math.Between(200, 400),
      Phaser.Math.Between(200, 1000), LEFT_KILL_ZONE
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
      frame: powerUpColors[type],
      x: 200,
      y: 300,
      alpha: 0.3,
      lifespan: 500,
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
    if (this.path && this.curve) {
      this.curve.getPoint(this.path.t, this.path.vec);
      const { x, y } = this.path.vec;
      this.x = x;
      this.y = y;
    }

    this.flares.setPosition(this.x, this.y);

    if (this.x < LEFT_KILL_ZONE
      || this.x > RIGHT_KILL_ZONE
      || this.y < TOP_KILL_ZONE
      || this.y > BOTTOM_KILL_ZONE) {			this.kill();
		}
	}

}

export default class Powerups extends Phaser.Physics.Arcade.Group {
  constructor(scene: Scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 5,
      key: POWERUPS,
      setXY: {x: -100, y: -100},
      setScale: {x: 0.3, y: 0.3},
      active: false,
      visible: false,
      classType: Powerup
    });

  }

  energy() {
    const powerup = this.getFirstDead(false) as Powerup;
    if (powerup) powerup.make(PowerUpTypes.ENERGY);
  }

  changeWeapon() {
    const powerup = this.getFirstDead(false) as Powerup;
    if (powerup) powerup.make(PowerUpTypes.CHANGE_WEAPON);
  }

  upgradeWeapon() {
    const powerup = this.getFirstDead(false) as Powerup;
    if (powerup) powerup.make(PowerUpTypes.UPGRADE_WEAPON);
  }

  shield() {
    const powerup = this.getFirstDead(false) as Powerup;
    if (powerup) powerup.make(PowerUpTypes.SHIELD);
  }
}
