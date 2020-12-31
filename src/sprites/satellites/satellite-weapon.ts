import Weapon from '~/sprites/weapons/weapon';
import Game from '~/scenes/game';
import WEAPON_SATELLITE_TYPES from '~/sprites/satellites/weapons_satellite_types.json';
import { FLARES } from '~/constants.json';

type WeaponSatelliteType = keyof typeof WEAPON_SATELLITE_TYPES;
const weaponSatelliteNames = Object.keys(WEAPON_SATELLITE_TYPES);

export default class SatelliteWeapon extends Weapon {
  weaponType = weaponSatelliteNames[0] as WeaponSatelliteType;
  manager!: Phaser.GameObjects.Particles.ParticleEmitterManager;
  emitter!: Phaser.GameObjects.Particles.ParticleEmitter;

  fire(x: number, y: number, angle: number, follow: number, weaponType: WeaponSatelliteType){
      const { TEXTURE_NAME, FRAME_NAME, DAMAGE, FIRE_SPEED, WIDTH, HEIGHT, AUDIO_NAME, SCALE } = WEAPON_SATELLITE_TYPES[weaponType];
      this.setOrigin(0, 0.5); // TODO: spostare in make
      this.make(TEXTURE_NAME, FRAME_NAME, AUDIO_NAME, x + 2, y + 2, WIDTH, HEIGHT, SCALE);
      this.damage = (DAMAGE);
      this.follow = follow;
      this.fireSpeed = (FIRE_SPEED);
      if (follow === 0){
        this.setVelocityX(this.fireSpeed*Math.cos(Phaser.Math.DegToRad(angle)));
        this.setVelocityY(this.fireSpeed*Math.sin(Phaser.Math.DegToRad(angle)));
        this.setRotation(Phaser.Math.DegToRad(angle));
      }
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
        lifespan: 100,
        quantity: 5,
      })
  }

	preUpdate(time: number, delta: number,) {
    super.preUpdate(time, delta);
    if (this.follow === 1){
      const { enemies } = this.scene as Game;
      const closestEnemy = this.scene.physics.closest(this, enemies.getChildrenAlive()) as Phaser.Physics.Arcade.Sprite;
      /*
        scene.gfx.clear()
        .lineStyle(2,0xff3300)
        .lineBetween(closestEnemy.x, closestEnemy.y, this.x, this.y);
        */
       //tracciamento grafico utile per il debug
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        if (this instanceof SatelliteWeapon) {
          this.scene.physics.moveToObject(this, closestEnemy, this.fireSpeed);
          this.setRotation(Phaser.Math.Angle.Between(closestEnemy.x, closestEnemy.y, this.x, this.y));
        }
    }
	}

}