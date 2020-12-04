import * as C from '~/constants.json';
import { KEYS, DIRECTIONS } from '~/globals';
import { SPACECRAFT, RESPAWN_TIME } from '~/constants.json';
import WEAPON_PLAYER_TYPES from '~/sprites_and_groups/weapons_player_types.json';

import Game from '~/scenes/game';
import { Scene } from 'phaser';

type VirtualJoystickPlugin = Phaser.Plugins.BasePlugin & {
  add: (Scene, any) => VirtualJoystickPlugin;
  on: (event: string, callback: Function, context: Scene) => VirtualJoystickPlugin;
  createCursorKeys: () => Phaser.Types.Input.Keyboard.CursorKeys;
}
type WeaponPlayerType = keyof typeof WEAPON_PLAYER_TYPES;

const weaponNames = Object.keys(WEAPON_PLAYER_TYPES);

export default class Player extends Phaser.Physics.Arcade.Sprite {
  public cursor!: Phaser.Types.Input.Keyboard.CursorKeys;
  public joyStick!: VirtualJoystickPlugin;
  public joyStickKeys!: Phaser.Types.Input.Keyboard.CursorKeys;
  public keys!: {
    [key: string]: Phaser.Input.Keyboard.Key;
  }
  public spaceKey!: Phaser.Input.Keyboard.Key;
  public MKey!: Phaser.Input.Keyboard.Key;
  public NKey!: Phaser.Input.Keyboard.Key;
  public VelocityX = 0;
  public VelocityY = 0;
  private energy = 300;
  public maxEnergy!: number;
  private lastHorizontalKeyPressed: KEYS.LEFT | KEYS.RIGHT | null = null;
  private lastVerticalKeyPressed: KEYS.UP | KEYS.DOWN | null = null;
  private greenStyle!: Phaser.GameObjects.Graphics;
  private greenLine!: Phaser.Geom.Line;
  private weaponType = weaponNames[0] as WeaponPlayerType;
  public weaponLevel = 0;

  constructor(scene: Game, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);

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


    const plugin = this.scene.plugins.get('rexVirtualJoystick') as VirtualJoystickPlugin;
    this.joyStick = plugin.add(this.scene, {
      x: -200,
      y: -200,
      radius: 0,
      // base: this.add.circle(0, 0, 100, 0x888888),
      // thumb: this.add.circle(0, 0, 50, 0xcccccc),
      // dir: '8dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
      // forceMin: 16,
      enable: true
    });
    // scene.sys.game.device.os.desktop

    // assegna comandi
    this.cursor = this.scene.input.keyboard.createCursorKeys();
    this.joyStickKeys = this.joyStick.createCursorKeys();
    this.keys = {
      space: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      s: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      m: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M),
      n: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N),
      l: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L),
      k: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K),
      j: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J),
    }

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
    this.greenLine.y1 = this.y + this.height + 5;
    this.greenLine.x2 = xPos + ((this.width) * this.energy) / this.maxEnergy;
    this.greenLine.y2 = this.y + this.height + 5;
    this.greenStyle.strokeLineShape(this.greenLine);
  }

  takeHit(damage: number) {
    const scene = this.scene as Game;
    console.log(scene.shield.isUp);
    if (scene.shield.isUp) scene.shield.takeHit(damage);
    else {
      this.energy -= damage;
      if (this.energy <= 0) this.die();
    }
  }

  upgradeWeapon() {
    if (this.weaponLevel < WEAPON_PLAYER_TYPES[this.weaponType].LEVELS.length - 1) {
      this.weaponLevel += 1;
      } else {this.weaponLevel += 0;} }

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
    const up = this.cursor.up?.isDown || this.joyStickKeys.up?.isDown;
    const right = this.cursor.right?.isDown || this.joyStickKeys.right?.isDown;
    const down = this.cursor.down?.isDown || this.joyStickKeys.down?.isDown;
    const left = this.cursor.left?.isDown || this.joyStickKeys.left?.isDown;
    
    // ACCELERAZIONE E ANIMAZIONE ORIZONTALE
    if (left) {
      this.VelocityX -= C.SPACECRAFT_ACC_X_DELTA;
      this.anims.play(DIRECTIONS.GO_LEFT, true);
      this.lastHorizontalKeyPressed = KEYS.LEFT;
    } else if (right) {
      this.VelocityX += C.SPACECRAFT_ACC_X_DELTA;
      this.play(DIRECTIONS.GO_RIGHT, true);
      this.lastHorizontalKeyPressed = KEYS.RIGHT;
    }

    // ACCELERAZIONE E ANIMAZIONE VERTICALE
    if (up) {
      this.VelocityY -= C.SPACECRAFT_ACC_Y_DELTA;
      this.play(DIRECTIONS.GO_UP, true);
      this.lastVerticalKeyPressed = KEYS.UP;
    } else if (down) {
      this.VelocityY += C.SPACECRAFT_ACC_Y_DELTA;
      this.play(DIRECTIONS.GO_DOWN, true);
      this.lastVerticalKeyPressed = KEYS.DOWN;
    }

    if (!up && !down && !left && !right) {
      this.play(DIRECTIONS.STOP, true);
    }

    // DECELERAZIONE ORIZONTALE
    if (this.lastHorizontalKeyPressed === KEYS.RIGHT && this.VelocityX > 0 && !right) {
      this.VelocityX -= C.SPACECRAFT_DEC_X_DELTA;
    }

    if (this.lastHorizontalKeyPressed === KEYS.LEFT && this.VelocityX < 0 && !left) {
      this.VelocityX += C.SPACECRAFT_DEC_X_DELTA;
    }

    // DECELERAZIONE VERTICALE
    if (this.lastVerticalKeyPressed === KEYS.DOWN && this.VelocityY > 0 && !down) {
      this.VelocityY -= C.SPACECRAFT_DEC_Y_DELTA;
    }

    if (this.lastVerticalKeyPressed === KEYS.UP && this.VelocityY < 0 && !up) {
      this.VelocityY += C.SPACECRAFT_DEC_Y_DELTA;
    }

    // SPOSTAMENTO SPRITE
    scene.player.setVelocityX(this.VelocityX);
    scene.player.setVelocityY(this.VelocityY);

    // TASTI AUMENTO DIMINUZIONE LIVELLO PER DEBUG
    if (Phaser.Input.Keyboard.JustDown(this.keys.m) && scene.playerWeaponsGroup) {
      if (this.weaponLevel < WEAPON_PLAYER_TYPES[this.weaponType].LEVELS.length - 1) {
        this.weaponLevel += 1;
      }
    } else if (Phaser.Input.Keyboard.JustDown(this.keys.n) && scene.playerWeaponsGroup) {
      if (this.weaponLevel >= 1) {
        this.weaponLevel -= 1;
      }
    }
    // TASTI CAMBIO ARMA PER DEBUG
    if (Phaser.Input.Keyboard.JustDown(this.keys.l) && scene.playerWeaponsGroup) {
      this.weaponType = weaponNames[1] as WeaponPlayerType;  
    } 
    if (Phaser.Input.Keyboard.JustDown(this.keys.k) && scene.playerWeaponsGroup) {
      this.weaponType = weaponNames[2] as WeaponPlayerType;  
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.j) && scene.playerWeaponsGroup) {
      this.weaponType = weaponNames[0] as WeaponPlayerType;  
    }
    //  PLAYER SHOOT FUNCTION
    if (Phaser.Input.Keyboard.DownDuration(this.keys.space, WEAPON_PLAYER_TYPES[this.weaponType].LEVELS[this.weaponLevel].DURATION) && scene.playerWeaponsGroup) {
        scene.PlayerWeapon1Level1Group.fireBulletPlayer(this.x, this.y, this.weaponType, this.weaponLevel);
    } 

    if (Phaser.Input.Keyboard.JustDown(this.keys.s)) {
      this.shieldUp();
    }

    scene.shield.moveShield(this.x, this.y);
    this.updateLifeLine();

  }
}