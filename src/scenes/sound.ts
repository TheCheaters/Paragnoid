import { Scene } from 'phaser';
import eventManager from '~/emitters/event-manager';
import WEAPON_PLAYER_TYPES from '~/sprites/player/weapons_player_types.json';
import WEAPON_ENEMY_TYPES from '~/sprites/enemies/weapons_enemy_types.json';
import * as S from '~/configurations/sounds.json';
import WEAPON_SATELLITE_TYPES from '~/sprites/satellites/weapons_satellite_types.json';

type WeaponPlayerType = keyof typeof WEAPON_PLAYER_TYPES;
type WeaponEnemyType = keyof typeof WEAPON_ENEMY_TYPES;
type WeaponSatelliteType = keyof typeof WEAPON_SATELLITE_TYPES;


export default class Intro extends Scene {
  text!: Phaser.GameObjects.Text;
  constructor() {
    super({
      key: 'sound',
      active: false,
    });
  }

  preload() {
    this.text = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Loading Sound' ).setOrigin(0.5);

    this.load.audio(S.ATMOSPHERE, S.ATMOSPHERE_PATH);
    this.load.audio(S.AUDIO_EXPLOSION, S.AUDIO_EXPLOSION_PATH);
    this.load.audio(S.BONUS, S.BONUS_PATH);
    this.load.audio(S.BUILD1, S.BUILD1_PATH);
    this.load.audio(S.BUILD2, S.BUILD2_PATH);
    this.load.audio(S.BUILD3, S.BUILD3_PATH);
    this.load.audio(S.BUILDSP1, S.BUILDSP1_PATH);
    this.load.audio(S.DESTROYER_1, S.DESTROYER_1_PATH);
    this.load.audio(S.DESTROYER_2, S.DESTROYER_2_PATH);
    this.load.audio(S.GAMEOVER_LOUD, S.GAMEOVER_LOUD_PATH);
    this.load.audio(S.GMENTERT_LOUD, S.GMENTERT_LOUD_PATH);
    this.load.audio(S.LASER, S.LASER_PATH);
    this.load.audio(S.LASER2, S.LASER2_PATH);
    this.load.audio(S.LASER3, S.LASER3_PATH);
    this.load.audio(S.LASER34, S.LASER34_PATH);
    this.load.audio(S.LASERDOT, S.LASERDOT_PATH);
    this.load.audio(S.MISSILE, S.MISSILE_PATH);
  }

  create() {

    setTimeout(() => {
      this.text.destroy();
      this.scene.launch('intro');
      this.sound.play(S.ATMOSPHERE, {
        volume: 0,
      });
    }, 1000);

    const sounds = [
      S.AUDIO_EXPLOSION,
      S.BONUS,
      S.BUILD1,
      S.BUILD2,
      S.BUILD3,
      S.BUILDSP1,
      S.DESTROYER_1,
      S.DESTROYER_2,
      S.GAMEOVER_LOUD,
      S.GMENTERT_LOUD,
      S.LASER,
      S.LASER2,
      S.LASER3,
      S.LASER34,
      S.LASERDOT,
      S.MISSILE,
    ];

    const configs = {
      [S.AUDIO_EXPLOSION]: { volume: 0.1 },
      [S.BONUS]:           { volume: 0.2 },
      [S.BUILD1]:          { volume: 0.4 },
      [S.BUILD2]:          { volume: 0.4 },
      [S.BUILD3]:          { volume: 0.4 },
      [S.BUILDSP1]:        { volume: 0.8 },
      [S.DESTROYER_1]:     { volume: 0.6 },
      [S.DESTROYER_2]:     { volume: 0.6 },
      [S.GAMEOVER_LOUD]:   { volume: 0.4 },
      [S.GMENTERT_LOUD]:   { volume: 0.4 },
      [S.LASER]:           { volume: 0.1 },
      [S.LASER2]:          { volume: 0.1 },
      [S.LASER3]:          { volume: 0.1 },
      [S.LASER34]:         { volume: 0.1 },
      [S.LASERDOT]:        { volume: 0.4 },
      [S.MISSILE]:         { volume: 0.2 },
    }

    sounds.forEach(sound => {
      eventManager.on(`play-${sound}`, () =>{
        this.sound.play(sound, configs[sound]);
      });
    });
  }
}