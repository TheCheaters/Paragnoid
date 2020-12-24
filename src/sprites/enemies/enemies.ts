import { AUDIO_EXPLOSION, HIT_ENEMY } from '~/constants.json';
import { Scene } from "phaser";
import Game from '~/scenes/game';
import UI from '~/scenes/ui';
import ENEMY_TYPES from '~/sprites/enemies/enemy_types.json';
import ENEMY_BEHAVIORS from '~/sprites/enemies/enemy_behaviors.json';
import WEAPON_ENEMY_TYPES from '~/sprites/weapons/weapons_enemy_types.json';
import ENEMY_PATHS from '~/sprites/enemies/enemy_paths.json';
import sceneChangeEmitter from '~/emitters/scene-change-emitter';

let enemyProgressiveNumber = 0;

type Make = {
  enemyType: keyof typeof ENEMY_TYPES;
  enemyBehavior: keyof typeof ENEMY_BEHAVIORS;
  enemyPath: keyof typeof ENEMY_PATHS | null;
}

type WeaponEnemyType = keyof typeof WEAPON_ENEMY_TYPES;

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  public energy!: number;
  public scoreValue!: number;
  public maxEnergy!: number;
  private enemyType!: keyof typeof ENEMY_TYPES;
  private enemyName!: string;
  private timer!: Phaser.Time.TimerEvent;
  private isBoss = false;
  private enemyPath?: Make['enemyPath'] | null;
  private greenStyle!: Phaser.GameObjects.Graphics;
  private greenLine!: Phaser.Geom.Line;
  private path?: { t: number, vec: Phaser.Math.Vector2 };
  private curve?: Phaser.Curves.Spline | null;
  private tween?: Phaser.Tweens.Tween | null;
  private points?: number[];
  private ui?: UI;
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, ENEMY_TYPES.DEFAULT.TEXTURE_NAME);
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

    this.isBoss = enemyType.includes('BOSS');
    this.enemyType = enemyType;

    // BIND UI SCENE
    this.ui = this.scene.game.scene.getScene('ui') as UI;

    // RESET PREVIOUS PATH
    this.enemyPath = null;
    this.curve = null;
    this.tween = null;

    enemyProgressiveNumber += 1;
    this.enemyName = `Enemy_${enemyProgressiveNumber}`;
    // console.log(`Made Enemy ${this.enemyName}`);

    const { ENERGY, SPEED, FIRE_RATE } = ENEMY_BEHAVIORS[enemyBehavior];
    const { TEXTURE_NAME, WIDTH, HEIGHT, WEAPON_TYPE, SCORE_VALUE } = ENEMY_TYPES[enemyType];

    // TEXTURE
    this.setTexture(TEXTURE_NAME);
    this.setBodySize(WIDTH, HEIGHT);

    // POSITION
    const y = Phaser.Math.Between(0, this.scene.scale.height);
    const x = this.scene.scale.width + 100;
    this.setOrigin(0, 0);
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
        duration: SPEED * 10,
        repeat: this.isBoss ? -1 : 0
      });

    } else {

      const { player } = this.scene as Game;
      this.scene.physics.moveToObject(this, player, SPEED);

    }

    // BEHAVIOR
    this.maxEnergy = ENERGY;
    this.energy = ENERGY;
    this.scoreValue = SCORE_VALUE;

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

  takeHit(damage: number) {
    const scene = this.scene as Game;
    this.energy -= damage;
    if (this.energy <= 0) {
      scene.sound.add(AUDIO_EXPLOSION, { loop: false }).play();
      this.explode();
      this.ui?.addScore(this.scoreValue);
    } else {
      scene.sound.add(HIT_ENEMY, { loop: false }).play();
    }
  }

  explode() {
    const { explosions } = this.scene as Game;
    explosions.addExplosion(this.x, this.y);
    this.kill();
  }

  kill() {
    this.greenStyle.clear();
    this.body.enable = false;
    this.setActive(false);
    this.setVisible(false);
    this.timer.remove();
    this.tween?.stop();
    this.x = 1500;
    this.y = 0;
    // console.log(`Killed Enemy ${this.enemyName}`);
    if (this.isBoss) sceneChangeEmitter.emit(`${this.enemyType}-IS-DEAD`);
  }

	preUpdate(time: number, delta: number) {
		super.preUpdate(time, delta);
    if (this.enemyPath && this.path && this.curve) {
      this.curve.getPoint(this.path.t, this.path.vec);
      const { x, y } = this.path.vec;
      this.x = x;
      this.y = y;
    }
    this.updateLifeLine();

    if (this.x < -500 || this.x > 1500) {
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
      setXY: {x: -500, y: -500},
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

  getChildrenAlive(){
    
    const enemiesAlive: Phaser.GameObjects.GameObject[] = [];
    this.children.iterate((child => {
        if (child.active) {
          enemiesAlive.push(child);
        }
    }))
     return enemiesAlive;
  }

}
