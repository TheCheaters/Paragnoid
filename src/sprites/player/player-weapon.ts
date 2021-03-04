import Weapon from '~/sprites/weapons/weapon';
import Game from '~/scenes/game';
import WEAPON_PLAYER_TYPES from '~/sprites/player/weapons_player_types.json';
import { WeaponPlayerType, WeaponType } from '~/types/weapons';
import { FLARES } from '~/configurations/images.json';
import eventManager from '~/emitters/event-manager';

export default class PlayerWeapon extends Weapon {
  manager!: Phaser.GameObjects.Particles.ParticleEmitterManager;
  emitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  particleType!: 'LASER' | 'SMOKE';

  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y);
  }

  createTrail() {
    this.manager = this.scene.add.particles(FLARES);
    if (this.particleType === 'SMOKE') {
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
    } else if (this.particleType === 'LASER') {
      this.emitter = this.manager
        .createEmitter({
          name: 'laser',
          frame: [
            'blue',
          ],
          x: this.x,
          y: this.y,
          blendMode: 'ADD',
          scale: 0.3,
          speed: { min: -100, max: 100 },
          lifespan: 40,
          quantity: 1,
        });
    }
  }

   fire(x: number, y: number, angle: number, weaponType: WeaponPlayerType, weaponLevel: number) {
    const { DAMAGE,
      ENERGY,
      TEXTURE_NAME,
      FRAME_NAME,
      FIRE_SPEED,
      LEVELS,
      AUDIO_NAME,
      WIDTH,
      HEIGHT,
      SCALE,
      PARTICLES,
      EXPLODES } = WEAPON_PLAYER_TYPES[weaponType] as WeaponType ;
    this.particleType = PARTICLES;
    const { VERTICAL_OFFSET, GRAVITY_X, GRAVITY_Y } = LEVELS[weaponLevel];
    let _x = x;
    let _y = y;
    if (angle > 0) {
      _x = x + 20;
      _y = y + 5 + VERTICAL_OFFSET;
    } else if (angle < 0){
      _x = x + 20;
      _y = y + 5 - VERTICAL_OFFSET;
    } else {
      _x = x + 20;
      _y = y + 5;
    }
    // this.setOrigin(0, 0.5); // TODO: spostare in make
    this.make({
      texture: TEXTURE_NAME,
      frame: FRAME_NAME,
      sound: AUDIO_NAME,
      x: _x,
      y: _y,
      width: WIDTH,
      height: HEIGHT,
      scale: SCALE,
      explodes: EXPLODES,
      flip: false,
    });
    this.fireSpeed = (FIRE_SPEED);
    this.damage = DAMAGE;
    this.setVelocityX(this.fireSpeed*Math.cos(Phaser.Math.DegToRad(angle)));
    this.setVelocityY(this.fireSpeed*Math.sin(Phaser.Math.DegToRad(angle)));
    this.setRotation(Phaser.Math.DegToRad(angle));
    this.body.gravity.set(GRAVITY_X, GRAVITY_Y);
    eventManager.emit('player-weapon-fired', ENERGY);

  }
}