import { Scene } from 'phaser';
import eventManager from '~/emitters/event-manager';
import WEAPON_PLAYER_TYPES from '~/sprites/player/weapons_player_types.json';
import WEAPON_ENEMY_TYPES from '~/sprites/enemies/weapons_enemy_types.json';
import * as C from '~/constants.json';
import WEAPON_SATELLITE_TYPES from '~/sprites/satellites/weapons_satellite_types.json';

type WeaponPlayerType = keyof typeof WEAPON_PLAYER_TYPES;
type WeaponEnemyType = keyof typeof WEAPON_ENEMY_TYPES;
type WeaponSatelliteType = keyof typeof WEAPON_SATELLITE_TYPES;


export default class Intro extends Scene {
  public on = true;
  text!: Phaser.GameObjects.Text;
  constructor() {
    super({
      key: 'sound',
      active: false,
    });
  }

  preload() {
    this.text = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Loading Sound' ).setOrigin(0.5);

    Object.keys(WEAPON_ENEMY_TYPES).forEach((W) => {
      const WEAPON = W as WeaponEnemyType;
      this.load.audio(WEAPON_ENEMY_TYPES[WEAPON].AUDIO_NAME, WEAPON_ENEMY_TYPES[WEAPON].AUDIO_ASSET_PATH);
    });

    Object.keys(WEAPON_PLAYER_TYPES).forEach((P) =>{
      const PLAYER = P as WeaponPlayerType;
      this.load.audio(WEAPON_PLAYER_TYPES[PLAYER].AUDIO_NAME, WEAPON_PLAYER_TYPES[PLAYER].AUDIO_ASSET_PATH);
    });

    Object.keys(WEAPON_SATELLITE_TYPES).forEach((S) => {
      const SATELLITE = S as WeaponSatelliteType;
      this.load.audio(WEAPON_SATELLITE_TYPES[SATELLITE].AUDIO_NAME, WEAPON_SATELLITE_TYPES[SATELLITE].AUDIO_ASSET_PATH);
    })

    this.load.audio(C.HIT_ENEMY, C.HIT_ENEMY_ASSET_PATH);
    this.load.audio(C.SOUND, C.SOUND_PATH);
    this.load.audio(C.AUDIO_EXPLOSION, C.AUDIO_EXPLOSION_ASSET_PATH);


  }

  create() {

    setTimeout(() => {
      this.text.destroy();
      this.scene.launch('intro');
      this.sound.play(C.SOUND);
    }, 1000);

    Object.keys(WEAPON_ENEMY_TYPES).forEach((W) => {
      const WEAPON = W as WeaponEnemyType;
      const { AUDIO_NAME } = WEAPON_ENEMY_TYPES[WEAPON];
      eventManager.on(`play-${AUDIO_NAME}`, () =>{
        if (this.on) this.sound.play(AUDIO_NAME);
      })
    });

    Object.keys(WEAPON_PLAYER_TYPES).forEach((P) =>{
      const PLAYER = P as WeaponPlayerType;
      const { AUDIO_NAME } = WEAPON_PLAYER_TYPES[PLAYER];
      eventManager.on(`play-${AUDIO_NAME}`, () =>{
        if (this.on) this.sound.play(AUDIO_NAME);
      })
    });

    Object.keys(WEAPON_SATELLITE_TYPES).forEach((S) => {
      const SATELLITE = S as WeaponSatelliteType;
      const { AUDIO_NAME } = WEAPON_SATELLITE_TYPES[SATELLITE];
      eventManager.on(`play-${AUDIO_NAME}`, () =>{
        if (this.on) this.sound.play(AUDIO_NAME);
      })
    })
    const explosionSound = this.sound.add(C.AUDIO_EXPLOSION, { loop: false })
    eventManager.on(`play-${C.AUDIO_EXPLOSION}`, () =>{
      if (this.on) explosionSound.play();
    })

    const hitEnemySound = this.sound.add(C.HIT_ENEMY, { loop: false })
    eventManager.on(`play-${C.HIT_ENEMY}`, () =>{
      if (this.on) hitEnemySound.play();
    })

  }

}