import { Scene } from "phaser";
import { AUDIO_MISSILE, MISSILE } from '~/constants.json';

export class Weapon extends Phaser.Physics.Arcade.Sprite {
  energy = 90;
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, MISSILE);
  }

  fire(x: number, y: number, type: string, fireSpeed: number) {
    this.body.enable = true;
    this.body.reset(x + 2, y + 20);

    this.setActive(true);
    this.setVisible(true);

    if (type === 'player') {
      this.setVelocityX(1000);
    } else {
      this.setVelocityX(-fireSpeed);
    }

    this.scene.sound.play(AUDIO_MISSILE);
  }

  kill() {
    this.body.enable = false;
    this.setActive(false);
    this.setVisible(false);
  }

	preUpdate(time: number, delta: number) {
		super.preUpdate(time, delta);

		if (this.x > 800 || this.x < -200) {
      this.kill();
		}
	}
}

export class PlayerWeapon extends Weapon {
  energy = 90;
}

export class EnemyWeapon extends Weapon {
  energy = 90;
}