import { AUDIO_EXPLOSION, HIT_ENEMY, LEFT_KILL_ZONE, RIGHT_KILL_ZONE, RIGHT_SPAWN_ZONE } from '~/constants.json';
import Game from '~/scenes/game';
import UI from '~/scenes/ui';
import ENEMY_TYPES from '~/sprites/enemies/enemy_types.json';
import ENEMY_BEHAVIORS from '~/sprites/enemies/enemy_behaviors.json';
import ENEMY_PATHS from '~/sprites/enemies/enemy_paths.json';
import sceneChangeEmitter from '~/emitters/scene-change-emitter';
import Lifeline from '~/utils/Lifeline';
import { WeaponEnemyType } from '~/types/weapons';

let enemyProgressiveNumber = 0;

export type Make = {
  enemyType: keyof typeof ENEMY_TYPES;
  enemyBehavior: keyof typeof ENEMY_BEHAVIORS;
  enemyPath: keyof typeof ENEMY_PATHS | null;
  enemyFlip: true | false;
}

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  public energy!: number;
  public scoreValue!: number;
  public maxEnergy!: number;
  private enemyType!: keyof typeof ENEMY_TYPES;
  private enemyName!: string;
  private timer!: Phaser.Time.TimerEvent;
  private isBoss = false;
  private enemyPath?: Make['enemyPath'] | null;
  private lifeLine!: Lifeline;
  private path?: { t: number, vec: Phaser.Math.Vector2 };
  private curve?: Phaser.Curves.Spline | null;
  private tween?: Phaser.Tweens.Tween | null;
  private points?: number[];
  private ui?: UI;
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, ENEMY_TYPES.DEFAULT.TEXTURE_NAME);
  }

  make({ enemyType, enemyBehavior, enemyPath, enemyFlip }: Make) {

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
    console.log(`Made Enemy ${this.enemyName}`);

    const { ENERGY, SPEED, FIRE_RATE } = ENEMY_BEHAVIORS[enemyBehavior];
    const { TEXTURE_NAME, FRAME_NAME, WIDTH, HEIGHT, WEAPON_TYPE, SCORE_VALUE } = ENEMY_TYPES[enemyType];

    // TEXTURE
    this.setTexture(TEXTURE_NAME, FRAME_NAME);
    this.setBodySize(WIDTH, HEIGHT);
    this.setScale(0.3, 0.3);


    // POSITION
    const y = Phaser.Math.Between(0, this.scene.scale.height);
    const x = RIGHT_SPAWN_ZONE;
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
        repeat: this.isBoss ? -1 : 0,
      });

    } else {

      const { player } = this.scene as Game;
      this.scene.physics.moveToObject(this, player, SPEED);

    }

    this.setFlipX(enemyFlip);

    // BEHAVIOR
    this.maxEnergy = ENERGY;
    this.energy = ENERGY;
    this.scoreValue = SCORE_VALUE;

    this.body.immovable = true;
    this.body.enable = true;
    this.setActive(true);
    this.setVisible(true);
    this.lifeLine = new Lifeline(this.scene as Game, this);

    const delay = Phaser.Math.Between(FIRE_RATE, FIRE_RATE + 2000);

    this.timer = this.scene.time.addEvent({ delay, callback: () => {
      this.fire(this.x, this.y, WEAPON_TYPE as WeaponEnemyType);
    }, callbackScope: this, loop: true });

  }

  fire(x: number, y: number, weaponType: WeaponEnemyType) {
    const { enemyWeaponsGroup } = this.scene as Game;
    enemyWeaponsGroup.fire(x, y, weaponType as WeaponEnemyType);

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
    this.lifeLine.kill();
    this.body.enable = false;
    this.setActive(false);
    this.setVisible(false);
    this.timer.remove();
    this.tween?.stop();
    console.log(`Killed Enemy ${this.enemyName}`);
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
    this.lifeLine.update();

    if (this.x < LEFT_KILL_ZONE || this.x > RIGHT_KILL_ZONE) {
			this.kill();
		}
	}

}
