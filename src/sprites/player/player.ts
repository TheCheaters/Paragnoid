import { RESPAWN_TIME, MORTAL, FLARES } from '~/constants.json';
import components from '~/sprites/player/components_types.json';
import WEAPON_PLAYER_TYPES from '~/sprites/player/weapons_player_types.json';
import { PowerUpTypes, PowerUpType } from '~/sprites/powerups/powerups';

import Game from '~/scenes/game';
import debug from '~/utils/debug';
import { WeaponPlayerType } from '~/types/weapons';
import eventManager from '~/emitters/event-manager';

const weaponNames = Object.keys(WEAPON_PLAYER_TYPES) as WeaponPlayerType[];

export default class Player extends Phaser.Physics.Arcade.Sprite {
  private energyLevel = 10000;
  private maxSpeed = 1000;
  private maxEnergy!: number;
  private weaponType!: WeaponPlayerType;
  private weaponTypeIndex = 0;
  private weaponLevel!: number;
  private cannon!: Phaser.GameObjects.Image;
  private cannonPosX!: number;
  private cannonPosY!: number;
  private cannonfireX!: number;
  private cannonfireY!: number;
  public scale = 0.2;
  private cannonflipY!: boolean;
  private manager!: Phaser.GameObjects.Particles.ParticleEmitterManager;
  private emitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  constructor(scene: Game, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setImmovable(true);
    this.setDrag(500, 500);
    this.setMaxVelocity(300, 300);
    this.setInitialEnergy();
    this.setInitialWeapon();
    this.setCannonComponent();
    this.createFireEngine();
    this.setWeaponEventListener();
  }
  get energy() {
    return this.energyLevel;
  }
  get energyRatio() {
    return this.energy / this.maxEnergy;
  }
  get speed() {
    return this.maxSpeed;
  }
  get weapon() {
    return this.weaponType;
  }
  get level() {
    return this.weaponLevel;
  }
  get fireXposition() {
    return this.x + this.cannonfireX;
  }
  get fireYposition() {
    return this.y + this.cannonfireY;
  }
  setWeaponEventListener() {
    eventManager.on('player-weapon-fired', (energy: number) => {
      this.decreaseEnergy(energy);
    })
  }
  setInitialWeapon() {
    this.weaponType = 'MISSILI';
    this.weaponLevel = 0;
  }
  setInitialEnergy() {
    this.maxEnergy = this.energyLevel;
  }
  setCannonComponent() {
    if (this.cannon) this.cannon.destroy();
    const { TEXTURE_NAME, FRAME_NAME } = WEAPON_PLAYER_TYPES[this.weaponType].LEVELS[this.weaponLevel];
    const { POS_X, POS_Y, FIRE_X, FIRE_Y, FLIP_Y, SCALE, DEPTH } = components[FRAME_NAME];
    this.cannonPosX = POS_X;
    this.cannonPosY = POS_Y;
    this.cannonfireX = FIRE_X;
    this.cannonfireY = FIRE_Y;
    this.cannon = this.scene.add.image(this.cannonPosX + this.x, this.cannonPosY + this.y, TEXTURE_NAME, FRAME_NAME);
    this.cannon.setScale(SCALE);
    this.cannon.setFlipY(FLIP_Y);
    this.cannon.setDepth(DEPTH);
  }
  createFireEngine() {
    this.manager = this.scene.add.particles(FLARES);
    this.emitter = this.manager
      .createEmitter({
        name: 'fire',
        frame: [
          'blue',
        ],
        gravityX: -500,
        x: -40,
        y: 5,
        blendMode: 'ADD',
        scale: { start: 0.3, end: 0 },
        speedX: { min: -100, max: 10, steps: 12 },
        speedY: { min: -50, max: 50 },
        lifespan: 500,
        quantity: 1,
        alpha: [0.5, 1]
      })
  }
  takeHit(damage: number) {
    if (MORTAL && debug) {
      if (!(this.scene as Game).shield.isUp) {
        this.decreaseEnergy(damage);
      }
    }
  }
  decreaseEnergy(energy: number) {
    this.energyLevel -= energy;
    if (this.energyLevel <= 0) { this.die(); }
  }
  increaseEnergy(energy: number) {
    if (this.energyLevel + energy <= this.maxEnergy) {
      this.energyLevel += energy;
    }
  }
  usePowerUp(type: PowerUpType) {
    switch (type) {
      case PowerUpTypes.ENERGY:
        this.fullEnergy();
        break;
      case PowerUpTypes.CHANGE_WEAPON:
        this.changeWeapon();
        break;
      case PowerUpTypes.UPGRADE_WEAPON:
        this.updgradeWeapon();
        break;
      case PowerUpTypes.SHIELD:
        this.shieldUp();
        break;
    }
  }
  changeWeapon() {
    this.weaponType = weaponNames[Phaser.Math.Between(0, weaponNames.length - 1)];
    this.setCannonComponent();
  }
  increaseLevelWeapon() {
    if (this.weaponLevel < WEAPON_PLAYER_TYPES[this.weaponType].LEVELS.length - 1) {this.weaponLevel += 1;}
    this.setCannonComponent();
  }
  decreaseLevelWeapon(){
    if (this.weaponLevel >= 1) {this.weaponLevel -= 1;}
    this.setCannonComponent();
  }
  prevWeapon(){
    this.weaponTypeIndex = (this.weaponTypeIndex === 0) ? weaponNames.length - 1 : this.weaponTypeIndex - 1;
    this.weaponType = weaponNames[this.weaponTypeIndex] as WeaponPlayerType;
    this.setCannonComponent();
  }
  nextWeapon(){
    this.weaponTypeIndex = (this.weaponTypeIndex === weaponNames.length - 1) ? 0 : this.weaponTypeIndex + 1;
    this.weaponType = weaponNames[this.weaponTypeIndex] as WeaponPlayerType;
    this.setCannonComponent();
  }
  updgradeWeapon() {
    if (this.weaponLevel < WEAPON_PLAYER_TYPES[this.weaponType].LEVELS.length - 1) {
      this.weaponLevel += 1;
      (this.scene as Game).satellites.launchSatellite();
    } else {
      this.weaponLevel += 0;
    }
  }
  fullEnergy() {
    this.energyLevel = this.maxEnergy;
  }
  die() {
    const scene = this.scene as Game;

    if (scene.lives.lifes <= 0) scene.scene.start('gameover');

    scene.explosions?.addExplosion(this.x, this.y);
    scene.colliderPlayerEnemy.active = false;
    scene.colliderPlayerWeapons.active = false;
    scene.lives.lifes -= 1;
    scene.lives.destroyLives();
    scene.tweens.addCounter({
      from: 1,
      to: 0,
      duration: RESPAWN_TIME,
      ease: Phaser.Math.Easing.Sine.InOut,
      repeat: 3,
      yoyo: true,
      onUpdate: tween => {
        const valoreFrame = tween.getValue()
        this.setAlpha(valoreFrame)
      },
      onStart: () => {
        scene.colliderEnemyWeapons.active = true;
      },
      onComplete: () => {
        scene.colliderPlayerEnemy.active = true;
        scene.colliderPlayerWeapons.active = true;
        scene.colliderEnemyWeapons.active = true;
      }
    });
    this.resurrect();
  }
  resurrect() {
    this.energyLevel = this.maxEnergy;
  }
  shieldUp() {
    (this.scene as Game).shield.shieldUp();
  }
  shieldDown() {
    (this.scene as Game).shield.shieldDown();
  }
  kill() {
    this.body.enable = false;
    this.setActive(false);
    this.setVisible(false);
    this.setVelocity(0);
  }
  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    this.manager.setPosition(this.x, this.y);
    (this.scene as Game).shield.moveShield(this.x, this.y);
    this.cannon.setPosition(this.cannonPosX + this.x, this.cannonPosY + this.y);
    if (!(this.scene as Game).shield.isUp) {
      // this.increaseEnergy(5);
    } else {
      this.decreaseEnergy(20);
    }
  }
}