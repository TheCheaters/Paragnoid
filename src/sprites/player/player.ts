import { RESPAWN_TIME, MORTAL } from '~/constants.json';
import components from '~/sprites/player/components_types.json';
import WEAPON_PLAYER_TYPES from '~/sprites/player/weapons_player_types.json';
import { PowerUpTypes, PowerUpType } from '~/sprites/powerups/powerups';

import Game from '~/scenes/game';
import debug from '~/utils/debug';
import Lifeline from '~/utils/Lifeline';
import { WeaponPlayerType } from '~/types/weapons';

const weaponNames = Object.keys(WEAPON_PLAYER_TYPES) as WeaponPlayerType[];

export default class Player extends Phaser.Physics.Arcade.Sprite {

  public energy = 300;
  public speed = 1000;
  public maxEnergy!: number;
  private lifeLine!: Lifeline;

  public weaponType!: WeaponPlayerType;
  public weaponLevel!: number;
  private cannon!: Phaser.GameObjects.Image;
  private cannonPosX!: number;
  private cannonPosY!: number;
  private cannonfireX!: number;
  private cannonfireY!: number;
  public scale = 0.2;

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
    // BEHAVIOR
    // this.lifeLine = new Lifeline(this.scene as Game, this);
  }

  get fireXposition() {
    return this.x + this.cannonfireX;
  }

  get fireYposition() {
    return this.y + this.cannonfireY;
  }

  setInitialWeapon() {
    this.weaponType = 'DEFAULT';
    this.weaponLevel = 0;
  }

  setInitialEnergy() {
    this.maxEnergy = this.energy;
  }

  setCannonComponent() {
    const { TEXTURE_NAME, FRAME_NAME } = WEAPON_PLAYER_TYPES[this.weaponType].LEVELS[this.weaponLevel];
    const { POS_X, POS_Y, FIRE_X, FIRE_Y, SCALE } = components[FRAME_NAME];
    this.cannonPosX = POS_X;
    this.cannonPosY = POS_Y;
    this.cannonfireX = FIRE_X;
    this.cannonfireY = FIRE_Y;
    this.cannon = this.scene.add.image(this.cannonPosX + this.x, this.cannonPosY + this.y, TEXTURE_NAME, FRAME_NAME);
    this.cannon.setScale(SCALE);
  }

  takeHit(damage: number) {
    if (MORTAL && debug) {
      const scene = this.scene as Game;
      console.log(scene.shield.isUp);
      if (scene.shield.isUp) scene.shield.takeHit(damage);
      else {
        this.energy -= damage;
        if (this.energy <= 0) { this.die(); }
      }
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
  }

  increaseLevelWeapon() {
    if (this.weaponLevel < WEAPON_PLAYER_TYPES[this.weaponType].LEVELS.length - 1) {this.weaponLevel += 1;}
  }

  decreaseLevelWeapon(){
    if (this.weaponLevel >= 1) {this.weaponLevel -= 1;}
  }

  changeWeaponType(type: number){
    this.weaponType = weaponNames[type] as WeaponPlayerType;
  }

  updgradeWeapon() {
    const scene = this.scene as Game;
    if (this.weaponLevel < WEAPON_PLAYER_TYPES[this.weaponType].LEVELS.length - 1) {
      this.weaponLevel += 1;
      scene.satellites.launchSatellite();
    } else {
      this.weaponLevel += 0;
    }
  }

  fullEnergy() {
    this.energy = this.maxEnergy;
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
    this.energy = this.maxEnergy;
  }

  shieldUp() {
    const scene = this.scene as Game;
    scene.shield.forceShieldUp();
  }

  shieldDown() {
    const scene = this.scene as Game;
    scene.shield.shieldDown();
  }

  kill() {
    this.body.enable = false;
    this.setActive(false);
    this.setVisible(false);
    this.setVelocity(0);
    this.lifeLine.kill();

  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    const scene = this.scene as Game;
    scene.shield.moveShield(this.x, this.y);
    this.cannon.setPosition(this.cannonPosX + this.x, this.cannonPosY + this.y);
    // this.lifeLine.update();

  }
}