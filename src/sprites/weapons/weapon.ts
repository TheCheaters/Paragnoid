import { Scene } from "phaser";
import Game from '~/scenes/game';
import { DEFAULT } from '~/sprites/weapons/weapons_enemy_types.json';

export default class Weapon extends Phaser.Physics.Arcade.Sprite {
  timer!: Phaser.Time.TimerEvent;
  damage = DEFAULT.DAMAGE;
  fireSpeed = DEFAULT.FIRE_SPEED;
  textureName = DEFAULT.TEXTURE_NAME;
  frameName = DEFAULT.FRAME_NAME;
  audioName = DEFAULT.AUDIO_NAME;
  audioAssetPath = DEFAULT.AUDIO_ASSET_PATH;
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

  setWeaponTexture(texture: string, frame: string) {
    this.setTexture(texture, frame);
  }

	preUpdate(time: number, delta: number,) {
    super.preUpdate(time, delta);
    if (this.x > this.scene.scale.width || this.x < -200) this.kill();
	}
}