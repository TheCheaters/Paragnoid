import { Scene } from "phaser";
import Game from '~/scenes/game';
import { DEFAULT } from '~/sprites/weapons/weapons_enemy_types.json';

export default class Weapon extends Phaser.Physics.Arcade.Sprite {
  timer!: Phaser.Time.TimerEvent;
  damage = DEFAULT.DAMAGE;
  fireSpeed = DEFAULT.FIRE_SPEED;
  textureName = DEFAULT.TEXTURE_NAME;
  frameName = DEFAULT.FRAME_NAME;
  width = DEFAULT.WIDTH;
  height = DEFAULT.HEIGHT;
  follow = 0;

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
  }

  make(texture: string, frame: string, sound: string, x: number, y: number, width: number, height: number) {
    this.setTexture(texture, frame);
    this.setBodySize(width, height);
    this.enableBody(true, x, y, true, true);
    this.scene.sound.play(sound);
  }

	preUpdate(time: number, delta: number,) {
    super.preUpdate(time, delta);
    if (this.x > this.scene.scale.width || this.x < -200) this.kill();
	}
}