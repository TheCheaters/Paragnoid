import { Scene } from "phaser";
import Game from '~/scenes/game';
import { DEFAULT } from '~/sprites/enemies/weapons_enemy_types.json';
import { LEFT_KILL_ZONE, RIGHT_KILL_ZONE } from '~/constants.json';

type WeaponType = {
  texture: string;
  frame: string;
  sound: string;
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  explodes: boolean;
  flip?: boolean;
}

export default abstract class Weapon extends Phaser.Physics.Arcade.Sprite {
  private timer!: Phaser.Time.TimerEvent;
  protected damage = DEFAULT.DAMAGE;
  protected fireSpeed = DEFAULT.FIRE_SPEED;
  private textureName = DEFAULT.TEXTURE_NAME;
  private frameName = DEFAULT.FRAME_NAME;
  width = DEFAULT.WIDTH;
  height = DEFAULT.HEIGHT;
  protected follow = 0;
  private explodes!: boolean;
  abstract manager: Phaser.GameObjects.Particles.ParticleEmitterManager;
  abstract emitter: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, DEFAULT.TEXTURE_NAME);
  }

  make({ texture, frame, sound, x, y, width, height, scale, explodes, flip = true }: WeaponType) {
    this.explodes = explodes;
    this.createTrail();
    this.setImmovable(true);
    this.setTexture(texture, frame);
    this.setBodySize(width, height);
    this.setScale(scale);
    this.setFlipX(flip);
    this.setOrigin(1, 0.5);
    this.enableBody(true, x, y, true, true);
    this.scene.sound.play(sound);
  }

  explode() {
    if (this.explodes) {
      const { explosions } = this.scene as Game;
      explosions.addExplosion(this.x, this.y);
      this.kill();
    }
  }

  kill() {
    this.body.enable = false;
    this.setActive(false);
    this.setVisible(false);
    this.removeTrail();
    console.log('weapon killed');
  }

  abstract createTrail(): void;

  removeTrail() {
    if (this.emitter) this.emitter.remove();
  }
}