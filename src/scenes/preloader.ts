import { Scene } from 'phaser';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';
import * as C from '~/constants.json';
import EXPLOSION_TYPES from '~/sprites/explosions/explosions_types.json';
type ExplosionType = keyof typeof EXPLOSION_TYPES;

export default class Preload extends Scene {

  constructor() {
    super({
      key: 'preloader',
      active: true,
    });
  }

  preload() {
    this.add.text(this.scale.width / 2, this.scale.height / 2, 'Loading Images' ).setOrigin(0.5);

    this.load.plugin('rexVirtualJoystick', VirtualJoystickPlugin, true);
    this.load.image(C.SPACECRAFT, C.SPACECRAFT_ASSET_PATH);
    Object.keys(EXPLOSION_TYPES).forEach((E) => {
      const EXPLOSION = E as ExplosionType;
      const { EXPLOSION_ASSET_PATH, EXPLOSION_FRAME_SIZE } = EXPLOSION_TYPES[EXPLOSION]
      this.load.spritesheet(EXPLOSION, EXPLOSION_ASSET_PATH, {
        frameWidth: EXPLOSION_FRAME_SIZE,
        frameHeight: EXPLOSION_FRAME_SIZE,
      });
    });

    this.load.image(C.INFOPANEL_OVER, C.INFOPANEL_OVER_PATH);
    this.load.image('laser', 'assets/particles/laser.png');
    this.load.image(C.SPACE, C.SPACE_ASSET_PATH);
    this.load.image(C.HORIZON, C.HORIZON_ASSET_PATH);
    this.load.image(C.BATTERY, C.BATTERY_ASSET_PATH);
    this.load.multiatlas(C.NUVOLE, C.NUVOLE_JSON_ASSET_PATH, C.NUVOLE_ASSET_PATH);
    this.load.multiatlas(C.PLANETS, C.PLANETS_JSON_ASSET_PATH, C.PLANETS_ASSET_PATH);
    this.load.multiatlas(C.ENEMIES, C.ENEMIES_JSON_ASSET_PATH, C.ENEMIES_ASSET_PATH);
    this.load.multiatlas(C.WEAPONS, C.WEAPONS_JSON_ASSET_PATH, C.WEAPONS_ASSET_PATH);
    this.load.multiatlas(C.COMPONENTS, C.COMPONENTS_JSON_ASSET_PATH, C.COMPONENTS_ASSET_PATH);
    this.load.atlas(C.FLARES, C.FLARES_ASSET_PATH, C.FLARES_JSON_ASSET_PATH);
    this.load.atlas(C.POWERUPS, C.POWERUPS_ASSET_PATH, C.POWERUPS_JSON_ASSET_PATH);

    this.load.spritesheet(C.POWERUP, C.POWERUP_ASSET_PATH, {
      frameWidth: 60,
      frameHeight: 60
    });

    this.load.bitmapFont(C.PV_FONT_NAME, C.PV_FONT_PATH, C.PV_FONT_XML_PATH);
    this.load.bitmapFont(C.LR_FONT_NAME, C.LR_FONT_PATH, C.LR_FONT_XML_PATH);
    this.load.image(C.SATELLITES, C.SATELLITES_ASSET_PATH);

  }

  create() {
    this.scene.start('sound');
  }

}