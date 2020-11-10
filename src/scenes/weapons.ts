import { Scene } from "phaser";
import { AUDIO_MISSILE } from '~/scenes/game';

export class Weapon extends Phaser.Physics.Arcade.Sprite {
  energy = 90;
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, 'missile');
  }

  fire(x: number, y: number, type: string) {
    this.body.enable = true;
    this.body.reset(x + 2, y + 20);

    this.setActive(true);
    this.setVisible(true);

    if (type === 'player') {
      this.setVelocityX(1000);
    } else {
      this.setVelocityX(-1000);
    }

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