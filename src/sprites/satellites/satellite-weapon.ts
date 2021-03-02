import Weapon from '~/sprites/weapons/weapon';
import Game from '~/scenes/game';
import WEAPON_SATELLITE_TYPES from '~/sprites/satellites/weapons_satellite_types.json';
import { FLARES } from '~/constants.json';
import {
  LAMPO_GENERAZIONI,
  LAMPO_MAXOFFSET,
  LAMPO_SCALA,
  LAMPO_DURATA
} from '~/constants.json';
import Lampo from '~/sprites/satellites/lampo';
import { WeaponSatelliteType } from '~/types/weapons';
import { createRecurringFunctionLast } from '~/sprites/satellites/recurring';

const weaponSatelliteNames = Object.keys(WEAPON_SATELLITE_TYPES);

export default class SatelliteWeapon extends Weapon {
  weaponType = weaponSatelliteNames[0] as WeaponSatelliteType;
  manager!: Phaser.GameObjects.Particles.ParticleEmitterManager;
  emitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  turnRate!: number;
  physics!: Phaser.Physics.Arcade.ArcadePhysics;
  style!: Phaser.GameObjects.Graphics;
  style1!: Phaser.GameObjects.Graphics;  

  fire(x: number, y: number, angle: number, follow: number, weaponType: WeaponSatelliteType){
      const { TEXTURE_NAME, FRAME_NAME, DAMAGE, TURN_RATE, FIRE_SPEED, WIDTH, HEIGHT, AUDIO_NAME, SCALE, EXPLODES } = WEAPON_SATELLITE_TYPES[weaponType];
       
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
      this.follow = follow;
      this.turnRate = TURN_RATE;
      this.fireSpeed = (FIRE_SPEED);
      if (follow === 0){
        this.setVelocityX(this.fireSpeed*Math.cos(Phaser.Math.DegToRad(angle)));
        this.setVelocityY(this.fireSpeed*Math.sin(Phaser.Math.DegToRad(angle)));
        this.setRotation(Phaser.Math.DegToRad(angle));
      }
  } 

fireLampoSatellite(x: number, y: number){
  this.lampoSatellite(x, y);
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

  lampoSatellite(x: number, y: number): any {
    const {player, enemies} = this.scene as Game;    
    const closestEnemy = this.scene.physics.closest(player, enemies.getChildrenAlive()) as Phaser.Physics.Arcade.Sprite;
    const lampo = new Lampo(this.scene as Game, LAMPO_GENERAZIONI, LAMPO_MAXOFFSET, LAMPO_SCALA);
    const segmentoIniziale = lampo.generazione2(x, y, closestEnemy.x, closestEnemy.y, 1);
    const generazioneRecorsiva = createRecurringFunctionLast(lampo.funzioneT, lampo);
    const risultato = generazioneRecorsiva(segmentoIniziale, 5);
    this.style = this.scene.add.graphics({
        lineStyle: {
            width: 3,
            color: 0xf5faff,
            alpha: 1
        }
      });
    this.style1 = this.scene.add.graphics({
        lineStyle: {
            width: 2,
            color: 0xaacff4,
            alpha: 1
        }
      });
    for (let index = 0; index < risultato.length; index++) {
        const segmento = risultato[index];
        segmento.draw(this.style, this.style1);
        }
      
  }

  preUpdate(time: number, delta: number,) {
    super.preUpdate(time, delta);
   
    if (this.follow === 1) {
      const { enemies } = this.scene as Game;
      const closestEnemy = this.scene.physics.closest(this, enemies.getChildrenAlive()) as Phaser.Physics.Arcade.Sprite;
      if (closestEnemy !== null) {
        const angleEnemy = Phaser.Math.Angle.Between(this.x, this.y, closestEnemy.x, closestEnemy.y);
        const coords: number[] = [0, 0];
        /*
          scene.gfx.clear()
          .lineStyle(2,0xff3300)
          .lineBetween(closestEnemy.x, closestEnemy.y, this.x, this.y);
          */
        //tracciamento grafico utile per il debug
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        if (this instanceof SatelliteWeapon) {
          if (closestEnemy !== null && this.rotation !== angleEnemy) {
            coords[0] = closestEnemy.x;
            coords[1] = closestEnemy.y
            let delta = angleEnemy - this.rotation; // differenza tra l'angolo del missile e l'angolo del nemico
            if (delta > Math.PI) delta -= Math.PI * 2; // se la differenza è > 180° allora togli 360° dal delta e mantienilo nel range 0-180°
            if (delta < -Math.PI) delta += Math.PI * 2; // se la differenza è < -180° allora aggiungi 360° al delta e mantienilo nel range 0-180°
            if (delta > 0) {
              this.angle += this.turnRate
            } else {
              this.angle -= this.turnRate
            } // se delta > 0 gira in senso orario gradualmente altrimenti gira in senso antiorario
            if (Math.abs(delta) < Phaser.Math.DegToRad(this.turnRate)) {
              this.rotation = angleEnemy
            } //se l'angolo è troppo piccolo approssima l'angolo a quello originario con i nemici
            this.body.velocity.x = Math.cos(this.rotation) * this.fireSpeed;
            this.body.velocity.y = Math.sin(this.rotation) * this.fireSpeed;

          } else {
            const angleEnemyCoords = Phaser.Math.Angle.Between(this.x, this.y, coords[0], coords[1]); // angolo tra player e nemico più vicino prima che morisse
            let delta = angleEnemyCoords - this.rotation; // differenza tra l'angolo del missile e l'angolo del nemico
            if (delta > Math.PI) delta -= Math.PI * 2; // se la differenza è > 180° allora togli 360° dal delta e mantienilo nel range 0-180°
            if (delta < -Math.PI) delta += Math.PI * 2; // se la differenza è < -180° allora aggiungi 360° al delta e mantienilo nel range 0-180°
            if (delta > 0) {
              this.angle += this.turnRate
            } else {
              this.angle -= this.turnRate
            } // se delta > 0 gira in senso orario gradualmente altrimenti gira in senso antiorario
            if (Math.abs(delta) < Phaser.Math.DegToRad(this.turnRate)) {
              this.rotation = angleEnemyCoords
            } //se l'angolo è troppo piccolo approssima l'angolo con l'ultimo memorizzato
            this.body.velocity.x = Math.cos(this.rotation) * this.fireSpeed;
            this.body.velocity.y = Math.sin(this.rotation) * this.fireSpeed;
          }
        }
      }
    }
  }
}