import { Scene } from 'phaser';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js';
import * as C from '~/constants.json';
import WEAPON_SATELLITE_TYPES from '~/sprites/weapons/weapons_satellite_types.json';
import ENEMY_TYPES from '~/sprites/enemies/enemy_types.json';
import WEAPON_ENEMY_TYPES from '~/sprites/weapons/weapons_enemy_types.json';
import WEAPON_PLAYER_TYPES from '~/sprites/weapons/weapons_player_types.json';
import EXPLOSION_TYPES from '~/sprites/explosions/explosions_types.json';
type EnemyType = keyof typeof ENEMY_TYPES;
type WeaponPlayerType = keyof typeof WEAPON_PLAYER_TYPES;
type WeaponEnemyType = keyof typeof WEAPON_ENEMY_TYPES;
type WeaponSatelliteType = keyof typeof WEAPON_SATELLITE_TYPES;
type ExplosionType = keyof typeof EXPLOSION_TYPES;

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
    Object.keys(EXPLOSION_TYPES).forEach((E) => {
      const EXPLOSION = E as ExplosionType;
      const { EXPLOSION_ASSET_PATH, EXPLOSION_FRAME_SIZE } = EXPLOSION_TYPES[EXPLOSION]
      this.load.spritesheet(EXPLOSION, EXPLOSION_ASSET_PATH, {
        frameWidth: EXPLOSION_FRAME_SIZE,
        frameHeight: EXPLOSION_FRAME_SIZE,
      });
    });

    this.load.image(C.INFOPANEL_OVER, C.INFOPANEL_OVER_PATH);
    this.load.image(C.SPACE, C.SPACE_ASSET_PATH);
    this.load.image(C.SUN, C.SUN_ASSET_PATH);
    this.load.image(C.HORIZON, C.HORIZON_ASSET_PATH);
    this.load.multiatlas(C.NUVOLE, C.NUVOLE_JSON_ASSET_PATH, C.NUVOLE_ASSET_PATH);
    this.load.multiatlas(C.ENEMIES, C.ENEMIES_JSON_ASSET_PATH, C.ENEMIES_ASSET_PATH);
    this.load.multiatlas(C.WEAPONS, C.WEAPONS_JSON_ASSET_PATH, C.WEAPONS_ASSET_PATH);
    this.load.image(C.BLUE_PARTICLE, C.BLUE_PARTICLE_ASSET_PATH);
    this.load.atlas(C.FLARES, C.FLARES_ASSET_PATH, C.FLARES_JSON_ASSET_PATH);

    this.load.spritesheet(C.POWERUP, C.POWERUP_ASSET_PATH, {
      frameWidth: 60,
      frameHeight: 60
    });
    this.load.image(C.SATELLITE, C.SATELLITE_ASSET_PATH);

    // Carica tutti gli sprite e i suoni di Weapons
    Object.keys(WEAPON_ENEMY_TYPES).forEach((W) => {
      const WEAPON = W as WeaponEnemyType;
      this.load.audio(WEAPON_ENEMY_TYPES[WEAPON].AUDIO_NAME, WEAPON_ENEMY_TYPES[WEAPON].AUDIO_ASSET_PATH);
    });

    //Carica tutti gli sprite ed i suoni del Player
    Object.keys(WEAPON_PLAYER_TYPES).forEach((P) =>{
      const PLAYER = P as WeaponPlayerType;
      this.load.image(WEAPON_PLAYER_TYPES[PLAYER].TEXTURE_NAME, WEAPON_PLAYER_TYPES[PLAYER].SPRITE_ASSET_PATH);
      this.load.audio(WEAPON_PLAYER_TYPES[PLAYER].AUDIO_NAME, WEAPON_PLAYER_TYPES[PLAYER].AUDIO_ASSET_PATH);
    });

    //Carica tutti gli sprite ed i suoni dei Satelliti
    Object.keys(WEAPON_SATELLITE_TYPES).forEach((S) => {
      const SATELLITE = S as WeaponSatelliteType;
      this.load.image(WEAPON_SATELLITE_TYPES[SATELLITE].TEXTURE_NAME, WEAPON_SATELLITE_TYPES[SATELLITE].SPRITE_ASSET_PATH);
      this.load.image(WEAPON_SATELLITE_TYPES[SATELLITE].AUDIO_NAME, WEAPON_SATELLITE_TYPES[SATELLITE].AUDIO_ASSET_PATH);
    })

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