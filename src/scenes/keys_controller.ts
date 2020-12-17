import { Scene } from 'phaser';
import Game from '~/scenes/game';
import { DIRECTIONS } from '~/globals';
import WEAPON_PLAYER_TYPES from '~/sprites/weapons/weapons_player_types.json';
import sceneChangeEmitter from '~/emitters/scene-change-emitter';

const weaponNames = Object.keys(WEAPON_PLAYER_TYPES);

type WeaponPlayerType = keyof typeof WEAPON_PLAYER_TYPES;

type VirtualJoystickPlugin = Phaser.Plugins.BasePlugin & {
  add: (Scene, any) => VirtualJoystickPlugin;
  on: (event: string, callback: Function, context: Scene) => VirtualJoystickPlugin;
  createCursorKeys: () => Phaser.Types.Input.Keyboard.CursorKeys;
}

export default class KeysController extends Scene {
  private cursor!: Phaser.Types.Input.Keyboard.CursorKeys;
  private joyStick!: VirtualJoystickPlugin;
  private joyStickKeys!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: {
    [key: string]: Phaser.Input.Keyboard.Key;
  }
  private gameInstance!: Game;
  constructor() {
    super({
      key: 'keys-controller',
      active: false,
    });
  }

  create() {
    this.gameInstance = this.scene.get('game') as Game;

    const plugin = this.plugins.get('rexVirtualJoystick') as VirtualJoystickPlugin;
    this.joyStick = plugin.add(this, {
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
    this.cursor = this.input.keyboard.createCursorKeys();
    this.joyStickKeys = this.joyStick.createCursorKeys();
    this.keys = {
      space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      one: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
      two: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
      z: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
      m: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M),
      n: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N),
      l: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L),
      k: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K),
      j: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J),
      w: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      a: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      s: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      d: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),

    }

  }

  update() {

    const { player, playerWeaponsGroup } = this.gameInstance;
    const { speed } = player;
    const up = this.cursor.up?.isDown || this.joyStickKeys.up?.isDown || this.keys.w?.isDown;
    const right = this.cursor.right?.isDown || this.joyStickKeys.right?.isDown || this.keys.d?.isDown;
    const down = this.cursor.down?.isDown || this.joyStickKeys.down?.isDown || this.keys.s?.isDown;
    const left = this.cursor.left?.isDown || this.joyStickKeys.left?.isDown || this.keys.a?.isDown;

    // ACCELERAZIONE E ANIMAZIONE ORIZONTALE
    if (left) {
      player.setAccelerationX(-speed);
      player.play(DIRECTIONS.GO_LEFT, true);
    } else if (right) {
      player.setAccelerationX(speed);
      player.play(DIRECTIONS.GO_RIGHT, true);
    }

    // ACCELERAZIONE E ANIMAZIONE VERTICALE
    if (up) {
      player.setAccelerationY(-speed);
      player.play(DIRECTIONS.GO_UP, true);
    } else if (down) {
      player.setAccelerationY(speed);
      player.play(DIRECTIONS.GO_DOWN, true);
    }

    if (!up && !down && !left && !right) {
      player.setAccelerationY(0);
      player.setAccelerationX(0);
      player.play(DIRECTIONS.STOP, true);
    }

    // TASTI AUMENTO DIMINUZIONE LIVELLO ARMI PER DEBUG
    if (Phaser.Input.Keyboard.JustDown(this.keys.m)) {
      player.increaseLevelWeapon();
      
    } else if (Phaser.Input.Keyboard.JustDown(this.keys.n)) {
      player.decreaseLevelWeapon();
    }
    // TASTI CAMBIO ARMA PER DEBUG
    if (Phaser.Input.Keyboard.JustDown(this.keys.l)) {
      player.changeWeaponType(1);
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.k)) {
      player.changeWeaponType(2);
    }
    if (Phaser.Input.Keyboard.JustDown(this.keys.j)) {
      player.changeWeaponType(0);
    }
    //  PLAYER SHOOT FUNCTION
    if (Phaser.Input.Keyboard.DownDuration(this.keys.space, WEAPON_PLAYER_TYPES[player.weaponType].LEVELS[player.weaponLevel].DURATION)) {
        playerWeaponsGroup.fireBulletPlayer(player.x, player.y, player.weaponType, player.weaponLevel);

    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.one)) {
      sceneChangeEmitter.emit('sky-boss-is-dead');
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.two)) {
      sceneChangeEmitter.emit('space-boss-is-dead');
    }

    // SHIELD UP (DEBUG)
    if (Phaser.Input.Keyboard.JustDown(this.keys.z)) {
      player.shieldUp();
    }

  }
}

