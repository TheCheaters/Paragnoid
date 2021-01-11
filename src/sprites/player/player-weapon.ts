import Weapon from '~/sprites/weapons/weapon';
import Game from '~/scenes/game';
import WEAPON_PLAYER_TYPES from '~/sprites/player/weapons_player_types.json';
import { WeaponPlayerType } from '~/types/weapons';
import { FLARES } from '~/constants.json';

export default class PlayerWeapon extends Weapon {
  manager!: Phaser.GameObjects.Particles.ParticleEmitterManager;
  emitter!: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y);
  }

  // createTrail() {
  //   this.manager = this.scene.add.particles('laser');
  //   this.emitter = this.manager
  //     .createEmitter({
  //       x: this.x,
  //       y: this.y,
  //       // blendMode: 'ADD',
  //       scale: 1,
  //       speed: 0,
  //       lifespan: 0,
  //       frequency: 0,
  //       quantity: 1,
  //       // delay: 300
  //     });
  // }

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

   fire(x: number, y: number, angle: number, weaponType: WeaponPlayerType, weaponLevel: number) {
    const { DAMAGE,
      TEXTURE_NAME,
      FRAME_NAME,
      FIRE_SPEED,
      LEVELS,
      AUDIO_NAME,
      WIDTH,
      HEIGHT,
      SCALE,
      EXPLODES } = WEAPON_PLAYER_TYPES[weaponType];
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
  }
}