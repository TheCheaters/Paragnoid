import { Scene } from "phaser";
import Game from './game';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  public energy: number;
  public score: number;
  private timer!: Phaser.Time.TimerEvent;

  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, 'enemy');
    this.energy = 100;
    this.score = 10;
  }

  make(x: number, y: number,) {
    this.energy = 100;
    this.body.immovable = true;
    this.body.enable = true;
    this.body.reset(x, y);

    this.setActive(true);
    this.setVisible(true);

    const { player } = this.scene as Game;

    this.scene.physics.moveToObject(this, player, 100);

    this.timer = this.scene.time.addEvent({ delay: 1000, callback: () => {
      this.fire(this.x, this.y);
    }, callbackScope: this, loop: true });

  }

  fire(x: number, y: number) {
    const { missileGroup } = this.scene as Game;
    missileGroup.fireBullet(x, y, 'enemy');
  }

  kill() {
    this.body.enable = false;
    this.setActive(false);
    this.setVisible(false);
    this.setVelocity(0);
    this.timer.remove();
  }

	preUpdate(time: number, delta: number) {
		super.preUpdate(time, delta);
    this.anims.play('enemy', true);

		if (this.x < -100) {
			this.kill();
		}
	}

}

export default class Enemies extends Phaser.Physics.Arcade.Group {
  constructor(scene: Scene, texture: string) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 30,
      key: texture,
      setXY: { x: 500, y: 1000 },
      active: false,
      visible: false,
      classType: Enemy
    });

    scene.anims.create ({
      key: texture,
      frames: scene.anims.generateFrameNumbers (texture, {
        start: 0,
        end: 1
      }),
      frameRate: 2
    });

    scene.time.addEvent({ delay: Phaser.Math.Between(2000, 3000), callback: this.makeEnemy, callbackScope: this, loop: true });

  }

  makeEnemy() {
    const y = Phaser.Math.Between(0, 600);
    const x = 900;
    const laser = this.getFirstDead(false);

    if (laser) {
      laser.make(x, y);
    }
  }
}
