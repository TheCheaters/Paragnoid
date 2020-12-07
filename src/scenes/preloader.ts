import { Scene } from 'phaser';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';
import * as C from '~/constants.json';
import ENEMY_TYPES from '~/sprites/enemies/enemy_types.json';
import WEAPON_ENEMY_TYPES from '~/sprites/weapons/weapons_enemy_types.json';
import WEAPON_PLAYER_TYPES from '~/sprites/weapons/weapons_player_types.json';

type EnemyType = keyof typeof ENEMY_TYPES;
type WeaponPlayerType = keyof typeof WEAPON_PLAYER_TYPES;
type WeaponEnemyType = keyof typeof WEAPON_ENEMY_TYPES;

export default class Preload extends Scene {

  constructor() {
    super({
      key: 'preloader',
      active: true,
    });
  }

  preload() {
    this.load.plugin('rexVirtualJoystick', VirtualJoystickPlugin, true);
    this.load.spritesheet(C.SPACECRAFT, C.SPACECRAFT_ASSET_PATH, {
      frameWidth: C.SPACECRAFT_FRAME_WIDTH,
      frameHeight: C.SPACECRAFT_FRAME_HEIGH,
    });
    this.load.image(C.INFOPANEL_OVER, C.INFOPANEL_OVER_PATH);
    this.load.image(C.SPACE, C.SPACE_ASSET_PATH);
    this.load.image(C.SUN, C.SUN_ASSET_PATH);
    this.load.image(C.HORIZON, C.HORIZON_ASSET_PATH);
    this.load.multiatlas(C.NUVOLE, C.NUVOLE_JSON_ASSET_PATH, C.NUVOLE_ASSET_PATH);
    this.load.image(C.BLUE_PARTICLE, C.BLUE_PARTICLE_ASSET_PATH);
    this.load.atlas(C.FLARES, C.FLARES_ASSET_PATH, C.FLARES_JSON_ASSET_PATH);
    this.load.spritesheet(C.EXPLOSION, C.EXPLOSION_ASSET_PATH, {
      frameWidth: 60,
      frameHeight: 60
    });

    this.load.spritesheet(C.POWERUP, C.POWERUP_ASSET_PATH, {
      frameWidth: 60,
      frameHeight: 60
    });
    this.load.image(C.SATELLITE, C.SATELLITE_ASSET_PATH);

    // Carica tutti gli sprite di Enemies
    Object.keys(ENEMY_TYPES).forEach((E) => {
      const ENEMY = E as EnemyType;
      this.load.image(ENEMY_TYPES[ENEMY].TEXTURE_NAME, ENEMY_TYPES[ENEMY].SPRITE_ASSET_PATH);
    });

    // Carica tutti gli sprite e i suoni di Weapons
    Object.keys(WEAPON_ENEMY_TYPES).forEach((W) => {
      const WEAPON = W as WeaponEnemyType;
      this.load.image(WEAPON_ENEMY_TYPES[WEAPON].TEXTURE_NAME, WEAPON_ENEMY_TYPES[WEAPON].SPRITE_ASSET_PATH);
      this.load.audio(WEAPON_ENEMY_TYPES[WEAPON].AUDIO_NAME, WEAPON_ENEMY_TYPES[WEAPON].AUDIO_ASSET_PATH);
    });

    //Carica tutti gli sprite ed i suoni del Player
    Object.keys(WEAPON_PLAYER_TYPES).forEach((P) =>{
      const PLAYER = P as WeaponPlayerType;
      this.load.image(WEAPON_PLAYER_TYPES[PLAYER].TEXTURE_NAME, WEAPON_PLAYER_TYPES[PLAYER].SPRITE_ASSET_PATH);
      this.load.audio(WEAPON_PLAYER_TYPES[PLAYER].AUDIO_NAME, WEAPON_PLAYER_TYPES[PLAYER].AUDIO_ASSET_PATH);
    });

    this.load.audio(C.HIT_ENEMY, C.HIT_ENEMY_ASSET_PATH);
    this.load.audio(C.AUDIO_EXPLOSION, C.AUDIO_EXPLOSION_ASSET_PATH);
    this.load.audio(C.AUDIO_OVER, C.AUDIO_OVER_PATH);
    this.load.bitmapFont(C.PV_FONT_NAME, C.PV_FONT_PATH, C.PV_FONT_XML_PATH);
    this.load.bitmapFont(C.LR_FONT_NAME, C.LR_FONT_PATH, C.LR_FONT_XML_PATH);

  }

  create() {
    this.scene.start('intro');
  }

}