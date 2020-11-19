import { Scene } from "phaser";
import Game from '../scenes/game';
import ENEMY_TYPES from '~/sprites_and_groups/enemy_types.json';
import ENEMY_BEHAVIORS from '~/sprites_and_groups/enemy_behaviors.json';
import WEAPON_ENEMY_TYPES from '~/sprites_and_groups/weapons_enemy_types.json';
import ENEMY_PATHS from '~/sprites_and_groups/enemy_paths.json';

let enemyProgressiveNumber = 0;

type Make = {
  enemyType: keyof typeof ENEMY_TYPES;
  enemyBehavior: keyof typeof ENEMY_BEHAVIORS;
  enemyPath: keyof typeof ENEMY_PATHS | null;
}

type WeaponEnemyType = keyof typeof WEAPON_ENEMY_TYPES;

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  public energy!: number;
  public maxEnergy!: number;
  private enemyName!: string;
  private timer!: Phaser.Time.TimerEvent;
  private enemyPath?: Make['enemyPath'] | null;
  private greenStyle!: Phaser.GameObjects.Graphics;
  private greenLine!: Phaser.Geom.Line;
  private path?: { t: number, vec: Phaser.Math.Vector2 };
  private curve?: Phaser.Curves.Spline | null;
  private tween?: Phaser.Tweens.Tween | null;
  private points?: number[];
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, ENEMY_TYPES.DEFAULT.TEXTURE_NAME);
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

  make({ enemyType, enemyBehavior, enemyPath }: Make) {

    // RESET PREVIOUS PATH
    this.enemyPath = null;
    this.curve = null;
    this.tween = null;

    enemyProgressiveNumber += 1;
    this.enemyName = `Enemy_${enemyProgressiveNumber}`;
    console.log(`Made Enemy ${this.enemyName}`);

    const { ENERGY, SPEED, FIRE_RATE } = ENEMY_BEHAVIORS[enemyBehavior];
    const { TEXTURE_NAME, WIDTH, HEIGHT, WEAPON_TYPE } = ENEMY_TYPES[enemyType];

    // TEXTURE
    this.setTexture(TEXTURE_NAME);
    this.setBodySize(WIDTH, HEIGHT);

    // POSITION
    const y = Phaser.Math.Between(0, this.scene.scale.height);
    const x = this.scene.scale.width + 100;
    /*if (Phaser.Math.IsEven(y*3)) { //prova rozza di spawn da dietro
      const x = this.scene.scale.width + 100;
    } else {
      const x = -this.scene.scale.width - 100;
    }*/
    this.setOrigin(0.5, 0.5);
    this.body.reset(x, y);

    // DIRECTION
    if (enemyPath) {

      this.enemyPath = enemyPath;
      this.path = { t: 0, vec: new Phaser.Math.Vector2() };
      this.points = ENEMY_PATHS[this.enemyPath];
      this.curve = new Phaser.Curves.Spline(this.points);
      this.tween = this.scene.tweens.add({
        targets: this.path,
        t: 1,
        duration: 5000,
        repeat: 0
      });

    } else {

      const { player } = this.scene as Game;
      this.scene.physics.moveToObject(this, player, SPEED);

    }

    // BEHAVIOR
    this.maxEnergy = ENERGY;
    this.energy = ENERGY;

    this.body.immovable = true;
    this.body.enable = true;
    this.setActive(true);
    this.setVisible(true);
    this.setLifeLine();

    const delay = Phaser.Math.Between(FIRE_RATE, FIRE_RATE + 2000);

    this.timer = this.scene.time.addEvent({ delay, callback: () => {
      this.fire(this.x, this.y, WEAPON_TYPE as WeaponEnemyType);
    }, callbackScope: this, loop: true });

  }

  fire(x: number, y: number, weaponType: WeaponEnemyType) {
    const { enemyWeaponsGroup } = this.scene as Game;
    enemyWeaponsGroup.fireBulletEnemy(x, y, weaponType as WeaponEnemyType);
  }

  kill() {
    this.greenStyle.clear();
    this.body.enable = false;
    this.setActive(false);
    this.setVisible(false);
    this.setVelocity(0);
    this.timer.remove();
    this.tween?.stop();
    console.log(`Killed Enemy ${this.enemyName}`);
  }

	preUpdate(time: number, delta: number) {
		super.preUpdate(time, delta);
    this.updateLifeLine();

    if (this.enemyPath && this.path && this.curve) {
      this.curve.getPoint(this.path.t, this.path.vec);
      const { x, y } = this.path.vec;
      this.x = x;
      this.y = y;
    }

		if (this.x < -100) {
			this.kill();
		}
	}

}

export default class Enemies extends Phaser.Physics.Arcade.Group {
  constructor(scene: Scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 70,
      key: ENEMY_TYPES.DEFAULT.TEXTURE_NAME,
      setXY: {x: -100, y: -100},
      setScale: {x: 0.5, y: 0.5},
      active: false,
      visible: false,
      classType: Enemy
    });

  }

  makeEnemy({ enemyType, enemyBehavior, enemyPath }: Make) {
    const enemy = this.getFirstDead(false) as Enemy;
    if (enemy) enemy.make({ enemyType, enemyBehavior, enemyPath });
  }
}
