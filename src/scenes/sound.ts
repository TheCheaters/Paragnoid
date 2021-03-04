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

    this.load.audio(S.ATMOSPHERE, S.ATMOSPHERE_PATH);
    this.load.audio(S.AUDIO_EXPLOSION, S.AUDIO_EXPLOSION_PATH);
    this.load.audio(S.BASS, S.BASS_PATH);
    this.load.audio(S.BONUS, S.BONUS_PATH);
    this.load.audio(S.BUILD1, S.BUILD1_PATH);
    this.load.audio(S.BUILD2, S.BUILD2_PATH);
    this.load.audio(S.BUILD3, S.BUILD3_PATH);
    this.load.audio(S.DESTROYER_1, S.DESTROYER_1_PATH);
    this.load.audio(S.DESTROYER_2, S.DESTROYER_2_PATH);
    this.load.audio(S.GAMEOVER_LOUD, S.GAMEOVER_LOUD_PATH);
    this.load.audio(S.GAMEOVER, S.GAMEOVER_PATH);
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
        volume: 1,
      });
    }, 1000);

    const sounds = [
      S.AUDIO_EXPLOSION,
      S.BASS,
      S.BONUS,
      S.BUILD1,
      S.BUILD2,
      S.BUILD3,
      S.DESTROYER_1,
      S.DESTROYER_2,
      S.GAMEOVER_LOUD,
      S.GAMEOVER,
      S.GMENTERT_LOUD,
      S.LASER,
      S.LASER2,
      S.LASER3,
      S.LASER34,
      S.LASERDOT,
      S.MISSILE,
    ];

    sounds.forEach(sound => {

      eventManager.on(`play-${sound}`, () =>{
        if (this.on) {
          this.sound.play(sound);
          console.log('playing:', sound);
        }
      });
    });
  }
}