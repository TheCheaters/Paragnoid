import { DIRECTIONS } from '~/globals';
import { SPACECRAFT, RESPAWN_TIME } from '~/constants.json';
import WEAPON_PLAYER_TYPES from '~/sprites/weapons/weapons_player_types.json';
import { PowerUpTypes, PowerUpType } from '~/sprites/powerups/powerups';

import Game from '~/scenes/game';
type WeaponPlayerType = keyof typeof WEAPON_PLAYER_TYPES;

const weaponNames = Object.keys(WEAPON_PLAYER_TYPES);

export default class Player extends Phaser.Physics.Arcade.Sprite {

  public energy = 300;
  public speed = 1000;
  private maxEnergy!: number;
  private greenStyle!: Phaser.GameObjects.Graphics;
  private greenLine!: Phaser.Geom.Line;
  public weaponType = weaponNames[0] as WeaponPlayerType;
  public weaponLevel = 0;

  constructor(scene: Game, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setDrag(500, 500);
    this.setMaxVelocity(300, 300);

    scene.anims.create({
      key: DIRECTIONS.GO_RIGHT,
      frames: scene.anims.generateFrameNumbers(SPACECRAFT, {
        start: 0,
        end: 6
      }),
      frameRate: 20
    });

    scene.anims.create({
      key: DIRECTIONS.GO_LEFT,
      frames: scene.anims.generateFrameNumbers(SPACECRAFT, {
        start: 28,
        end: 35
      }),
      frameRate: 20
    })

    scene.anims.create({
      key: DIRECTIONS.GO_UP,
      frames: scene.anims.generateFrameNumbers(SPACECRAFT, {
        start: 14,
        end: 20
      }),
      frameRate: 20
    });

    scene.anims.create({
      key: DIRECTIONS.GO_DOWN,
      frames: scene.anims.generateFrameNumbers(SPACECRAFT, {
        start: 7,
        end: 13
      }),
      frameRate: 20
    });

    scene.anims.create({
      key: DIRECTIONS.STOP,
      frames: scene.anims.generateFrameNumbers(SPACECRAFT, {
        start: 21,
        end: 27
      }),
      frameRate: 20
    });


    // BEHAVIOR
    this.maxEnergy = this.energy;
    this.setLifeLine();
  }

  setLifeLine() {
    this.greenStyle = this.scene.add.graphics({
      lineStyle: {
        width: 3,
        color: 0x00ff3d
      }
    });
    this.greenLine = new Phaser.Geom.Line();
  }

  updateLifeLine() {
    this.greenStyle.clear();
    const xPos = this.x - this.width / 2;
    this.greenLine.x1 = xPos;
    this.greenLine.y1 = this.y + this.height-2;
    this.greenLine.x2 = xPos + ((this.width) * this.energy) / this.maxEnergy;
    this.greenLine.y2 = this.y + this.height-2;
    this.greenStyle.strokeLineShape(this.greenLine);
  }

  takeHit(damage: number) {
    const scene = this.scene as Game;
    console.log(scene.shield.isUp);
    if (scene.shield.isUp) scene.shield.takeHit(damage);
    else {
      this.energy -= damage;
      if (this.energy <= 0) { this.die(); }
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
    this.weaponType = weaponNames[Phaser.Math.Between(0, weaponNames.length - 1)] as WeaponPlayerType;
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
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    const scene = this.scene as Game;

    scene.shield.moveShield(this.x, this.y);
    this.updateLifeLine();

  }
}