import { LEFT_KILL_ZONE, RIGHT_KILL_ZONE, RIGHT_SPAWN_ZONE, TOP_KILL_ZONE, BOTTOM_KILL_ZONE } from '~/utils/spawn_kill_areas';
import { AUDIO_EXPLOSION } from '~/configurations/sounds.json';
import { FLARES } from '~/configurations/images.json';

import Game from '~/scenes/game';
import UI from '~/scenes/ui';
import ENEMY_TYPES from '~/sprites/enemies/enemy_types.json';
import ENEMY_BEHAVIORS from '~/sprites/enemies/enemy_behaviors.json';
import ENEMY_PATHS from '~/sprites/enemies/enemy_paths.json';
import eventManager from '~/emitters/event-manager';
import Lifeline from '~/utils/Lifeline';
import { WeaponEnemyType } from '~/types/weapons';

let enemyProgressiveNumber = 0;

const BOSS_LVL = {
  SPACE_BOSS: "space",
  SKY_BOSS: "sky",
};

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
  private manager!: Phaser.GameObjects.Particles.ParticleEmitterManager;
  private emitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private enginePosition!: [number, number];

  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, ENEMY_TYPES.DEFAULT.TEXTURE_NAME);
  }

  make({ enemyType, enemyBehavior, enemyPath, enemyFlip }: Make) {

    const { ENERGY, SPEED, FIRE_RATE } = ENEMY_BEHAVIORS[enemyBehavior];
    const { TEXTURE_NAME, FRAME_NAME, WIDTH, HEIGHT, WEAPON_TYPE, SCORE_VALUE, ENEMY_SCALE, ENGINE_POSITION, BOSS } = ENEMY_TYPES[enemyType];

    this.enemyType = enemyType;
    this.isBoss = BOSS;

    // BIND UI SCENE
    this.ui = this.scene.game.scene.getScene('ui') as UI;

    // RESET PREVIOUS PATH
    this.enemyPath = null;
    this.curve = null;
    this.tween = null;

    enemyProgressiveNumber += 1;
    this.enemyName = `Enemy_${enemyProgressiveNumber}`;
    console.log(`Made Enemy ${this.enemyName} [Boss: ${this.isBoss}]`);


    // TEXTURE
    this.setTexture(TEXTURE_NAME, FRAME_NAME);
    this.setBodySize(WIDTH, HEIGHT);
    this.setScale(ENEMY_SCALE);
    this.enginePosition = ENGINE_POSITION as [number, number];

    // POSITION
    const y = Phaser.Math.Between(0, this.scene.scale.height);
    const x = RIGHT_SPAWN_ZONE;
    this.setOrigin(0.5, 0.5);
    this.body.reset(x, y);

    // DIRECTION
    if (enemyPath) {
      this.setRotation(0);
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
      this.setRotation(Phaser.Math.Angle.Between(player.x, player.y,this.x, this.y));
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
    this.lifeLine = new Lifeline(this.scene as Game, this, true);

    const delay = Phaser.Math.Between(FIRE_RATE, FIRE_RATE + 2000);

    this.timer = this.scene.time.addEvent({ delay, callback: () => {
      this.fire(this.x, this.y, WEAPON_TYPE as WeaponEnemyType);
    }, callbackScope: this, loop: true });

    this.createFireEngine();

  }

  createFireEngine() {
    this.manager = this.scene.add.particles(FLARES);
    this.emitter = this.manager
      .createEmitter({
        name: 'fire',
        frame: [
          'yellow',
        ],
        x: this.x,
        y: this.y,
        blendMode: 'ADD',
        scale: { start: 0.3, end: 0 },
        speed: { min: -100, max: 100 },
        lifespan: 200,
        quantity: 1,
        alpha: [0.5, 1]
      })
  }

  removeFireEngine() {
    if (this.emitter) this.emitter.remove();
  }

  fire(x: number, y: number, weaponType: WeaponEnemyType) {
    const { enemyWeaponsGroup } = this.scene as Game;
    enemyWeaponsGroup.fire(x, y, weaponType as WeaponEnemyType);

  }

  takeHit(damage: number) {
    this.energy -= damage;
    if (this.energy <= 0) {
      this.explode();
      this.ui?.addScore(this.scoreValue);
    }
    if (damage >= 20 ) /* è un laser, no esplosione a catena */ eventManager.emit(`play-${AUDIO_EXPLOSION}`);
  }

  explode() {
    const { explosions } = this.scene as Game;
    explosions.addExplosion(this.x, this.y);
    eventManager.emit(`play-${AUDIO_EXPLOSION}`);
    this.kill();
  }

  kill() {
    this.lifeLine.kill();
    this.body.enable = false;
    this.setActive(false);
    this.setVisible(false);
    this.timer.remove();
    this.tween?.stop();
    this.removeFireEngine();
    console.log(`Killed Enemy ${this.enemyName}`);
    enemyProgressiveNumber -= 1;
    if (this.isBoss) eventManager.emit(`${BOSS_LVL[this.enemyType]}-is-over`);
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
    const engineXpos = this.flipX ? this.body.width / 2 : -this.body.width / 2
    this.emitter.setPosition(this.x + engineXpos + this.enginePosition[0], this.y + this.enginePosition[1]);

    if (this.x < LEFT_KILL_ZONE
      || this.x > RIGHT_KILL_ZONE
      || this.y < TOP_KILL_ZONE
      || this.y > BOTTOM_KILL_ZONE) {
     this.kill();
		}
	}

}
