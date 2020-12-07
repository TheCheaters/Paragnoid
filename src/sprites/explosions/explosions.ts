import { Scene } from "phaser";
import EXPLOSION_TYPES from '~/sprites/explosions/explosions_types.json';

const DEFAULT = 'ONE';
type ExplosionType = keyof typeof EXPLOSION_TYPES;

class Explosion extends Phaser.Physics.Arcade.Sprite {
  private explosionTypes = Object.keys(EXPLOSION_TYPES) as ExplosionType[];
  private explosionType: ExplosionType = DEFAULT;
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, DEFAULT);
  }

  explode (x: number, y: number) {
    const rd = Phaser.Math.Between(0, this.explosionTypes.length - 1);
    this.explosionType = this.explosionTypes[rd];
    this.body.enable = true;
    this.body.reset(x, y);
    this.setTexture(this.explosionType);
    this.play(this.explosionType, true);
    this.setActive(true);
    this.setVisible(true);

    this.on('animationcomplete', (...args) => this.kill());

  }

  kill() {
    this.body.enable = false;
    this.setActive(false);
    this.setVisible(false);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    this.anims.update(time, delta);
	}
}

export default class Explosions extends Phaser.Physics.Arcade.Group {
  constructor(scene: Scene) {
    super(scene.physics.world, scene);

    Object.keys(EXPLOSION_TYPES).forEach((EXPLOSION) => {
      scene.anims.create ({
        key: EXPLOSION,
        frames: scene.anims.generateFrameNumbers(EXPLOSION, {
          start: 0,
          end: 63
        }),
        frameRate: 30,
      });
    });

    this.createMultiple({
      frameQuantity: 30,
      key: DEFAULT,
      active: false,
      visible: false,
      classType: Explosion,
    });

  }

  addExplosion(x: number, y: number){
    const explosion = this.getFirstDead(false);

    if (explosion) {
      explosion.explode(x, y);
    }
  }
}