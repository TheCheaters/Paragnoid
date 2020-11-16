import { Scene } from "phaser";
import Game from '../scenes/game';
import ENEMY_TYPES from '~/sprites_and_groups/enemy_types.json';
import ENEMY_BEHAVIORS from '~/sprites_and_groups/enemy_behaviors.json';
import WEAPON_TYPES from '~/sprites_and_groups/weapons_types.json';


type Make = {
  enemyType: keyof typeof ENEMY_TYPES;
  enemyBehavior: keyof typeof ENEMY_BEHAVIORS;
}

type WeaponType = keyof typeof WEAPON_TYPES;

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  public energy!: number;
  public maxEnergy!: number;
  private timer!: Phaser.Time.TimerEvent;

  private greenStyle!: Phaser.GameObjects.Graphics;
  private greenLine!: Phaser.Geom.Line;

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

  make({ enemyType, enemyBehavior }: Make) {

    const { ENERGY, SPEED, FIRE_RATE } = ENEMY_BEHAVIORS[enemyBehavior];
    const { TEXTURE_NAME, WIDTH, HEIGHT, WEAPON_TYPE } = ENEMY_TYPES[enemyType];

    // TEXTURE
    this.setTexture(TEXTURE_NAME);
    this.setBodySize(WIDTH, HEIGHT);

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

    const delay = Phaser.Math.Between(FIRE_RATE, FIRE_RATE + 2000);

    this.timer = this.scene.time.addEvent({ delay, callback: () => {
      this.fire(this.x, this.y, WEAPON_TYPE as WeaponType);
    }, callbackScope: this, loop: true });

  }

  fire(x: number, y: number, weaponType: WeaponType) {
    const { enemyWeaponsGroup } = this.scene as Game;
    enemyWeaponsGroup.fireBullet(x, y, weaponType as WeaponType);
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
  constructor(scene: Scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 50,
      key: ENEMY_TYPES.DEFAULT.TEXTURE_NAME,
      setXY: {x: -100, y: -100},
      setScale: {x: 0.5, y: 0.5},
      active: false,
      visible: false,
      classType: Enemy
    });

  }

  makeEnemy({ enemyType, enemyBehavior }: Make) {
    const enemy = this.getFirstDead(false) as Enemy;
    if (enemy) enemy.make({ enemyType, enemyBehavior });
  }
}
