import { Scene } from "phaser";
import { AUDIO_MISSILE } from '~/scenes/game';

export class Missile extends Phaser.Physics.Arcade.Sprite {
  energy = 90;
  constructor(scene: Scene, x: number, y: number) {
    super(scene, 100, 100, 'missile');
  }

  fire(x: number, y: number) {
    this.body.enable = true;
    this.body.reset(x + 2, y + 20);

    this.setActive(true);
    this.setVisible(true);

    this.setVelocityX(1000);

    // TODO: penso che ci sia un'altra soluzione perché così mangia memoria
    this.scene.sound.add(AUDIO_MISSILE, {loop: false}).play();
  }

  kill() {
    this.body.enable = false;
    this.setActive(false);
    this.setVisible(false);
    console.log('kill missile');
  }

	preUpdate(time: number, delta: number) {
		super.preUpdate(time, delta);

		if (this.x > 800) {
			this.setActive(false);
			this.setVisible(false);
		}
	}

}

export default class MissileGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene: Scene, texture: string) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 30,
      setXY: { x: 1000, y: 2000 },
      key: texture,
      active: false,
      visible: false,
      classType: Missile
    });

  }

  fireBullet(x: number, y: number) {
    const missile = this.getFirstDead(false);

    if (missile) {
      missile.fire(x, y);
    }
  }
}