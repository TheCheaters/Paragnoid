import { Scene } from 'phaser';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';
import * as I from '~/configurations/images.json';
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
    this.load.image(I.SPACECRAFT, I.SPACECRAFT_ASSET_PATH);
    Object.keys(EXPLOSION_TYPES).forEach((E) => {
      const EXPLOSION = E as ExplosionType;
      const { EXPLOSION_ASSET_PATH, EXPLOSION_FRAME_SIZE } = EXPLOSION_TYPES[EXPLOSION]
      this.load.spritesheet(EXPLOSION, EXPLOSION_ASSET_PATH, {
        frameWidth: EXPLOSION_FRAME_SIZE,
        frameHeight: EXPLOSION_FRAME_SIZE,
      });
    });

    this.load.image(I.INFOPANEL_OVER, I.INFOPANEL_OVER_PATH);
    this.load.image(I.LASER, I.LASER_ASSET_PATH);
    this.load.image(I.SPACE, I.SPACE_ASSET_PATH);
    this.load.image(I.HORIZON, I.HORIZON_ASSET_PATH);
    this.load.image(I.BATTERY, I.BATTERY_ASSET_PATH);
    this.load.multiatlas(I.NUVOLE, I.NUVOLE_JSON_ASSET_PATH, I.NUVOLE_ASSET_PATH);
    this.load.multiatlas(I.PLANETS, I.PLANETS_JSON_ASSET_PATH, I.PLANETS_ASSET_PATH);
    this.load.multiatlas(I.ENEMIES, I.ENEMIES_JSON_ASSET_PATH, I.ENEMIES_ASSET_PATH);
    this.load.multiatlas(I.WEAPONS, I.WEAPONS_JSON_ASSET_PATH, I.WEAPONS_ASSET_PATH);
    this.load.multiatlas(I.COMPONENTS, I.COMPONENTS_JSON_ASSET_PATH, I.COMPONENTS_ASSET_PATH);
    this.load.atlas(I.FLARES, I.FLARES_ASSET_PATH, I.FLARES_JSON_ASSET_PATH);
    this.load.atlas(I.POWERUPS, I.POWERUPS_ASSET_PATH, I.POWERUPS_JSON_ASSET_PATH);

    this.load.spritesheet(I.POWERUP, I.POWERUP_ASSET_PATH, {
      frameWidth: 60,
      frameHeight: 60
    });

    this.load.bitmapFont(I.PV_FONT_NAME, I.PV_FONT_PATH, I.PV_FONT_XML_PATH);
    this.load.bitmapFont(I.LR_FONT_NAME, I.LR_FONT_PATH, I.LR_FONT_XML_PATH);
    this.load.image(I.SATELLITES, I.SATELLITES_ASSET_PATH);

  }

  create() {
    this.scene.start('sound');
  }

}