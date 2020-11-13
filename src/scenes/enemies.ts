import { Scene } from "phaser";
import Game from './game';
import { ENEMY_GREEN, ENEMY_BEHAVIOR } from '~/constants.json';


type Make = {
  enemyTexture?: string;
  enemyBehavior: keyof typeof ENEMY_BEHAVIOR;
}

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  public energy!: number;
  public maxEnergy!: number;
  private timer!: Phaser.Time.TimerEvent;

  private greenStyle!: Phaser.GameObjects.Graphics;
  private greenLine!: Phaser.Geom.Line;

  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, ENEMY_GREEN);
    this.setData('score', 10);
  }

  setLifeLine() {
    this.greenStyle = this.scene.add.graphics({ lineStyle: { width: 2, color: 0x00ff3d } });
    this.greenLine = new Phaser.Geom.Line();
  }

  updateLifeLine() {
    this.greenStyle.clear();
    this.greenLine.x1 = this.x;
    this.greenLine.y1 = this.y - 3;
    this.greenLine.x2 = this.x + ((this.width / 2) * this.energy) / this.maxEnergy;
    this.greenLine.y2 = this.y - 3;
    this.greenStyle.strokeLineShape(this.greenLine);
  }

  make({ enemyTexture, enemyBehavior }: Make) {

    const { ENERGY, SPEED, FIRERATE, FIRESPEED } = ENEMY_BEHAVIOR[enemyBehavior];

    // POSITION
    const y = Phaser.Math.Between(0, this.scene.scale.height);
    const x = this.scene.scale.width + 100;
    this.setOrigin(0, 0);
    this.body.reset(x, y);
    const { player } = this.scene as Game;
    this.scene.physics.moveToObject(this, player, SPEED);

    // BEHAVIOR
    this.maxEnergy = ENERGY;
    this.energy = ENERGY;

    this.body.immovable = true;
    this.body.enable = true;
    this.setActive(true);
    this.setVisible(true);
    this.setLifeLine();

    this.timer = this.scene.time.addEvent({ delay: FIRERATE, callback: () => {
      this.fire(this.x, this.y, FIRESPEED);
    }, callbackScope: this, loop: true });

  }

  fire(x: number, y: number, fireSpeed: number) {
    const { enemyWeaponsGroup } = this.scene as Game;
    enemyWeaponsGroup.fireBullet(x, y, ENEMY_GREEN, fireSpeed);
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
      setScale: {x: 0.5, y: 0.5},
      active: false,
      visible: false,
      classType: Enemy
    });

  }

  makeEnemy({ enemyTexture, enemyBehavior }: Make) {
    const laser = this.getFirstDead(false);

    if (laser) {
      laser.make({ enemyTexture, enemyBehavior });
    }
  }
}
