import { Scene } from 'phaser';
import Game from '~/scenes/game';
import WEAPON_PLAYER_TYPES from '~/sprites/player/weapons_player_types.json';
import sceneChangeEmitter from '~/emitters/scene-change-emitter';
import debug from '~/utils/debug';
import Sound from '~/scenes/sound';

type VirtualJoystickPlugin = Phaser.Plugins.BasePlugin & {
  add: (Scene, any) => VirtualJoystickPlugin;
  on: (event: string, callback: Function, context: Scene) => VirtualJoystickPlugin;
  createCursorKeys: () => Phaser.Types.Input.Keyboard.CursorKeys;
}

let aPressed = false;
let xPressed = false;
let bPressed = false;

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
      zero: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO),
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
    const duration = WEAPON_PLAYER_TYPES[player.weaponType].LEVELS[player.weaponLevel].DURATION
    const up = this.cursor.up?.isDown || this.input.gamepad?.pad1?.leftStick.y < 0 || this.keys.w?.isDown;
    const right = this.cursor.right?.isDown || this.input.gamepad?.pad1?.leftStick.x > 0 || this.keys.d?.isDown;
    const down = this.cursor.down?.isDown || this.input.gamepad?.pad1?.leftStick.y > 0 || this.keys.s?.isDown;
    const left = this.cursor.left?.isDown || this.input.gamepad?.pad1?.leftStick.x < 0 || this.keys.a?.isDown;
    const prevWeapon = Phaser.Input.Keyboard.JustDown(this.keys.k) || this.input.gamepad?.pad1?.B && !bPressed;
    const nextWeapon = Phaser.Input.Keyboard.JustDown(this.keys.l) || this.input.gamepad?.pad1?.X && !xPressed;
    const shortFireWeapon = WEAPON_PLAYER_TYPES[player.weaponType].LEVELS[player.weaponLevel].DURATION === -1;
    const fire = Phaser.Input.Keyboard.JustDown(this.keys.space) || this.input.gamepad?.pad1?.A && !aPressed;
    const longFire = Phaser.Input.Keyboard.DownDuration(this.keys.space, duration) || this.input.gamepad?.pad1?.A;

    // ACCELERAZIONE E ANIMAZIONE ORIZONTALE
    if (left) {
      player.setAccelerationX(-speed);
    } else if (right) {
      player.setAccelerationX(speed);
    }

    // ACCELERAZIONE E ANIMAZIONE VERTICALE
    if (up) {
      player.setAccelerationY(-speed);
    } else if (down) {
      player.setAccelerationY(speed);
    }

    if (!up && !down && !left && !right) {
      player.setAccelerationY(0);
      player.setAccelerationX(0);
    }

    // TASTI AUMENTO DIMINUZIONE LIVELLO ARMI PER DEBUG
    if (Phaser.Input.Keyboard.JustDown(this.keys.m) && debug) {
      player.increaseLevelWeapon();

    } else if (Phaser.Input.Keyboard.JustDown(this.keys.n) && debug) {
      player.decreaseLevelWeapon();
    }


    if (prevWeapon) {
      player.prevWeapon();
      bPressed = true;
    }

    if (nextWeapon) {
      player.nextWeapon();
      xPressed = true;
    }

    //  PLAYER SHOOT FUNCTION
    if (shortFireWeapon) {

      if (fire) {
        playerWeaponsGroup.fire(player.fireXposition, player.fireYposition, player.weaponType, player.weaponLevel);
        aPressed = true;
      }

    } else {

      if (longFire) {
          playerWeaponsGroup.fire(player.fireXposition, player.fireYposition, player.weaponType, player.weaponLevel);
        }

    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.one) && debug) {
      sceneChangeEmitter.emit('sky-boss-is-dead');
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.two) && debug) {
      sceneChangeEmitter.emit('space-boss-is-dead');
    }

    // SHIELD UP (DEBUG)
    if (Phaser.Input.Keyboard.JustDown(this.keys.z) && debug) {
      player.shieldUp();
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.zero)) {
      const sound = this.scene.get('sound') as Sound;
      sound.on = !sound.on;
      console.log('Sound is on', sound.on);
    }

    // reset pressed state at the end of update cycle
    if (!this.input.gamepad?.pad1?.A) aPressed = false;
    if (!this.input.gamepad?.pad1?.B) bPressed = false;
    if (!this.input.gamepad?.pad1?.X) xPressed = false;

  }
}

