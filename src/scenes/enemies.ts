import { Scene } from "phaser";
import Game from './game';
import { ENEMY } from '~/constants.json';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  public energy!: number;
  private timer!: Phaser.Time.TimerEvent;

  private greenStyle!: Phaser.GameObjects.Graphics;
  private greenLine!: Phaser.Geom.Line;

  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, ENEMY);
    this.setData('score', 10);
  }

  addLifeLine() {
    this.greenStyle = this.scene.add.graphics({ lineStyle: { width: 2, color: 0x00ff3d } });
    this.greenLine = new Phaser.Geom.Line();
  }

  updateLifeLine() {
    this.greenStyle.clear();
    this.greenLine.x1 = this.x;
    this.greenLine.y1 = this.y - 3;
    this.greenLine.x2 = this.x + (this.width * this.energy) / 100;
    this.greenLine.y2 = this.y - 3;
    this.greenStyle.strokeLineShape(this.greenLine);
  }

  make(x: number, y: number,) {
    this.energy = 100;
    this.body.immovable = true;
    this.body.enable = true;
    this.setOrigin(0, 0);
    this.body.reset(x, y);

    this.setActive(true);
    this.setVisible(true);

    this.addLifeLine();

    const { player } = this.scene as Game;

    this.scene.physics.moveToObject(this, player, 100);

    this.timer = this.scene.time.addEvent({ delay: 3000, callback: () => {
      this.fire(this.x, this.y);
    }, callbackScope: this, loop: true });

  }

  fire(x: number, y: number) {
    const { enemyWeaponsGroup } = this.scene as Game;
    enemyWeaponsGroup.fireBullet(x, y, ENEMY);
  }

  kill() {
    this.greenStyle.clear();
    this.body.enable = false;
    this.setActive(false);
    this.setVisible(false);
    this.setVelocity(0);
    this.timer.remove();
  }

	preUpdate(time: number, delta: number) {
		super.preUpdate(time, delta);
    this.anims.play(ENEMY, true);
    this.updateLifeLine();

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
