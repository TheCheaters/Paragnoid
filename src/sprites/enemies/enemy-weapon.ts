import Weapon from '~/sprites/weapons/weapon';
import WEAPON_ENEMY_TYPES from '~/sprites/enemies/weapons_enemy_types.json';
import Game from '~/scenes/game';
import { FLARES } from '~/constants.json';
import { WeaponEnemyType } from '~/types/weapons';

export default class EnemyWeapon extends Weapon {
  manager!: Phaser.GameObjects.Particles.ParticleEmitterManager;
  emitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y);
  }
  createTrail() {
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
        scale: { start: 0.1, end: 0 },
        speed: { min: -100, max: 100 },
        lifespan: 80,
        quantity: 1,
      })
  }

  fire(x: number, y: number, angle: number, follow: number, weaponType: WeaponEnemyType) {
    const { TEXTURE_NAME, FRAME_NAME, DAMAGE, FIRE_SPEED, WIDTH, HEIGHT, AUDIO_NAME, SCALE, EXPLODES } = WEAPON_ENEMY_TYPES[weaponType];
    this.make({
      texture: TEXTURE_NAME,
      frame: FRAME_NAME,
      sound: AUDIO_NAME,
      x: x + 2,
      y: y + 2,
      width: WIDTH,
      height: HEIGHT,
      scale: SCALE,
      explodes: EXPLODES,
    });
    this.damage = (DAMAGE);
    this.fireSpeed = -(FIRE_SPEED);
    if (follow === 0){
      this.setVelocityX(this.fireSpeed*Math.cos(Phaser.Math.DegToRad(angle)));
      this.setVelocityY(this.fireSpeed*Math.sin(Phaser.Math.DegToRad(angle)));
      this.setRotation(Phaser.Math.DegToRad(angle));
    }
    if (follow === 1){
      const { player } = this.scene as Game;
      this.setVelocityX(this.fireSpeed*Math.cos(Phaser.Math.DegToRad(angle)));
      this.setVelocityY(this.fireSpeed*Math.sin(Phaser.Math.DegToRad(angle)));
      this.scene.physics.moveToObject(this, player, -this.fireSpeed);
      this.setRotation(Phaser.Math.Angle.Between(player.x, player.y,this.x, this.y));
    }
  }
}
