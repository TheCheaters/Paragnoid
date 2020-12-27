import { Scene } from "phaser";
import Game from '~/scenes/game';
import { DEFAULT } from '~/sprites/weapons/weapons_enemy_types.json';
import { BLUE_PARTICLE, LEFT_KILL_ZONE, RIGHT_KILL_ZONE } from '~/constants.json';

export default class Weapon extends Phaser.Physics.Arcade.Sprite {
  timer!: Phaser.Time.TimerEvent;
  damage = DEFAULT.DAMAGE;
  fireSpeed = DEFAULT.FIRE_SPEED;
  textureName = DEFAULT.TEXTURE_NAME;
  frameName = DEFAULT.FRAME_NAME;
  width = DEFAULT.WIDTH;
  height = DEFAULT.HEIGHT;
  follow = 0;
  private manager!: Phaser.GameObjects.Particles.ParticleEmitterManager;
  private emitter!: Phaser.GameObjects.Particles.ParticleEmitter;


  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, DEFAULT.TEXTURE_NAME);
  }

  explode() {
    const { explosions } = this.scene as Game;
    explosions.addExplosion(this.x, this.y);
    this.kill();
  }

  kill() {
    this.body.enable = false;
    this.setActive(false);
    this.setVisible(false);
    this.removeTrail();
  }

  createTrail() {
    this.manager = this.scene.add.particles(BLUE_PARTICLE);
    this.emitter = this.manager
      .createEmitter({
        x: 0,
        y: 0,
        blendMode: 'ADD',
        scale: { start: 0.1, end: 0 },
        speed: { min: -100, max: 100 },
        quantity: 3,
      });
  }

  removeTrail() {
    this.manager.destroy();
  }

  make(texture: string, frame: string, sound: string, x: number, y: number, width: number, height: number, scale: number, flip = true) {
    this.createTrail();
    this.setTexture(texture, frame);
    this.setBodySize(width, height);
    this.setScale(scale);
    this.setFlipX(flip);
    this.enableBody(true, x, y, true, true);
    this.scene.sound.play(sound);
  }

	preUpdate(time: number, delta: number,) {
    super.preUpdate(time, delta);
    this.emitter.setPosition(this.x, this.y);
    if (this.x < -LEFT_KILL_ZONE || this.x > RIGHT_KILL_ZONE) {
      this.kill();
    }

	}
}