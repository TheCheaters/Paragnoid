import { Scene, Time } from 'phaser';
import { PlayerWeapon, EnemyWeapon } from '~/scenes/weapons';
import WeaponGroup from '~/scenes/weaponGroup';
import Enemies, { Enemy } from '~/scenes/enemies';
import Player from '~/scenes/player';
import Explosions from '~/scenes/explosions';
import timeline from '~/scenes/timeline';

import { KEYS, DIRECTIONS } from '~/globals';
import Timeline from '~/scenes/timeline';
import Lives from './Lives';

export const SPACECRAFT             = 'spacecraft';
export const SPACECRAFT_ASSET_PATH  = 'assets/spacecraft.png';
export const SPACECRAFT_ACC_X_DELTA = 10;
export const SPACECRAFT_DEC_X_DELTA = 5;
export const SPACECRAFT_ACC_Y_DELTA = 15;
export const SPACECRAFT_DEC_Y_DELTA = 15;

export const MISSILE            = 'missile';
export const MISSILE_ASSET_PATH = 'assets/missile.png';
export const AUDIO_MISSILE      = 'audiomissile';
export const AUDIO_MISSILE_PATH = 'assets/missile.mp3';

export const ENEMY            = 'enemy';
export const ENEMY_ASSET_PATH = 'assets/enemy.png';

export const EXPLOSION            = 'explosion';
export const EXPLOSION_ASSET_PATH = 'assets/explosion.png';

export const INFOPANEL_OVER       = 'infopanel';
export const INFOPANEL_OVER_PATH  = 'assets/game-over.png';
export const AUDIO_OVER           = 'audioover';
export const AUDIO_OVER_PATH      = 'assets/gameover.mp3';

export const FONT_NAME            = 'portable_vengeance';
export const FONT_PATH            = 'assets/fonts/portable_vengeance/portable_vengeance.png';
export const FONT_XML_PATH        = 'assets/fonts/portable_vengeance/portable_vengeance.xml';

export default class Game extends Scene {
  public player!: Player;
  public enemies?: Enemies;
  public playerWeaponsGroup!: WeaponGroup;
  public enemyWeaponsGroup!: WeaponGroup;
  private explosions?: Explosions;
  private cursor?: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private infoPanel;
  private missileActive = true;
  private playerActive = true;
  public VelocityX = 0;
  public VelocityY = 0;
  public colliderPlayerEnemy;
  public colliderPlayerWeapons;
  public colliderEnemyWeapons;
  private lastHorizontalKeyPressed: KEYS.LEFT | KEYS.RIGHT | null = null;
  private lastVerticalKeyPressed: KEYS.UP | KEYS.DOWN | null = null;
  private score = 0;
  private scoreText!: Phaser.GameObjects.DynamicBitmapText;
  //public livesPlayer;
  public lives!: Lives;

  //public extraLifesPlayer = 3;
  private timeline!: Timeline;

  constructor() {
    super({
      key: 'game',
      active: false,
    });
  }

  preload() {
    this.load.spritesheet(SPACECRAFT, SPACECRAFT_ASSET_PATH, {
      frameWidth: 50,
      frameHeight: 22
    });
    this.load.image(MISSILE, MISSILE_ASSET_PATH);
    this.load.image(INFOPANEL_OVER, INFOPANEL_OVER_PATH);
    this.load.audio(AUDIO_MISSILE, AUDIO_MISSILE_PATH);
    this.load.audio(AUDIO_OVER, AUDIO_OVER_PATH);
    this.load.spritesheet(ENEMY, ENEMY_ASSET_PATH, {
      frameWidth: 34,
      frameHeight: 28
    });
    this.load.spritesheet(EXPLOSION, EXPLOSION_ASSET_PATH, {
      frameWidth: 60,
      frameHeight: 60
    });
    this.load.bitmapFont(FONT_NAME, FONT_PATH, FONT_XML_PATH);

  }
  create() {
    this.sound.add(AUDIO_MISSILE, {loop: false});

    this.player = new Player(this, 100, 450, SPACECRAFT);
    this.lives = new Lives (this, SPACECRAFT);
    Phaser.Actions.SetXY(this.lives.livesPlayer.getChildren(), this.lives.firstLifeIconX, 25, 50);
    Phaser.Actions.SetScale(this.lives.livesPlayer.getChildren(), 0.8, 0.8);
    Phaser.Actions.SetOrigin(this.lives.livesPlayer.getChildren(), 0.5, 0.5);
   
    this.playerWeaponsGroup = new WeaponGroup(this, MISSILE, PlayerWeapon);
    this.enemyWeaponsGroup = new WeaponGroup(this, MISSILE, EnemyWeapon);
    this.enemies = new Enemies(this, ENEMY);
    this.explosions = new Explosions(this, EXPLOSION);
    this.timeline = new Timeline(this);

    
    this.scoreText = this.add.dynamicBitmapText(16, 16, FONT_NAME, 'Score: 0', 14 );
    this.colliderPlayerEnemy = this.physics.add.collider(this.player, this.enemies, this.handlerPlayerEnemyCollisions.bind(this));
    this.colliderPlayerWeapons = this.physics.add.collider(this.player, this.enemyWeaponsGroup, this.handlerPlayerEnemyCollisions.bind(this));
    this.colliderEnemyWeapons = this.physics.add.collider (this.enemies, this.playerWeaponsGroup, this.handlerMissileEnemyCollisions.bind(this));

    // assegna comandi
    this.cursor = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    
    this.timeline.start();

  }

  handlerPlayerEnemyCollisions(...args) {
    // this.physics.pause();
    const player = args[0] as Player;
    const enemyOrEnemyWeapon = args[1] as Enemy | EnemyWeapon;
    const {x, y} = enemyOrEnemyWeapon;
    const {x:a,y:b} = player;
    const respawnTime = 1000;
    this.explosions?.addExplosion(x, y);
    this.explosions?.addExplosion(a, b);
    enemyOrEnemyWeapon.kill();
    //player.kill();
    //this.missileActive = false;
    //this.playerActive = false;
    if (this.lives.extraLifesPlayer!==0){
      this.lives.extraLifesPlayer -= 1;
      //this.lives.livesPlayer.destroy();
      var firstLifeIconX = 800 - 10 - (3 * 50);
      Phaser.Actions.SetXY(this.lives.livesPlayer.getChildren(), firstLifeIconX, 25, 50);
      
      this.tweens.addCounter({
        from: 255,
        to: 0,
        duration: respawnTime,
        ease: Phaser.Math.Easing.Sine.InOut,
        repeat: 3,
        yoyo: true,        
        onUpdate: tween => {
          const valoreFrame = tween.getValue()
          this.player.setTint(Phaser.Display.Color.GetColor(valoreFrame, valoreFrame, valoreFrame));
             },
        onStart: tween => {
          this.missileActive = false;
          this.colliderPlayerEnemy.active = false;
          this.colliderPlayerWeapons.active = false; 
          this.colliderEnemyWeapons.active = false;            
        },
        onComplete: tween => {
          this.missileActive = true;
          this.colliderPlayerEnemy.active = true;
          this.colliderPlayerWeapons.active = true; 
          this.colliderEnemyWeapons.active = true;
        }     
      })
    } else {
    player.kill(); 
      this.infoPanel = this.add.image(400, 300, INFOPANEL_OVER);
    this.sound.add(AUDIO_OVER, {loop: false}).play();
    this.missileActive === false;
    this.playerActive = false;   
  }
  }

  handlerMissileEnemyCollisions(...args) {
    const enemy = args[0] as Enemy;
    const missile = args[1] as PlayerWeapon;
    const {x, y} = enemy;
    enemy.energy = enemy.energy - missile.energy;
    missile.kill();
    if (enemy.energy <= 0) {
      this.score += enemy.getData('score');
      this.scoreText.setText(`Score: ${this.score}`);
      this.explosions?.addExplosion(x, y);
      enemy.kill();
    }
  }

  update() {

    if (this.player && this.cursor) {

      const up = this.cursor.up?.isDown;
      const right = this.cursor.right?.isDown;
      const down = this.cursor.down?.isDown;
      const left = this.cursor.left?.isDown;
      
      // ACCELERAZIONE E ANIMAZIONE ORIZONTALE
      if (left && this.playerActive) {
        this.VelocityX -= SPACECRAFT_ACC_X_DELTA;
        this.player.anims.play(DIRECTIONS.GO_LEFT, true);
        this.lastHorizontalKeyPressed = KEYS.LEFT;
      } else if (right && this.playerActive) {
        this.VelocityX += SPACECRAFT_ACC_X_DELTA;
        this.player.anims.play(DIRECTIONS.GO_RIGHT, true);
        this.lastHorizontalKeyPressed = KEYS.RIGHT;
      }

      // ACCELERAZIONE E ANIMAZIONE VERTICALE
      if (up && this.playerActive) {
        this.VelocityY -= SPACECRAFT_ACC_Y_DELTA;
        this.player.anims.play(DIRECTIONS.GO_UP, true);
        this.lastVerticalKeyPressed = KEYS.UP;
      } else if (down && this.playerActive) {
        this.VelocityY += SPACECRAFT_ACC_Y_DELTA;
        this.player.anims.play(DIRECTIONS.GO_DOWN, true);
        this.lastVerticalKeyPressed = KEYS.DOWN;
      }

      if (!up && !down && !left && !right) {
        this.player.anims.play(DIRECTIONS.STOP, true);
      }

      // DECELERAZIONE ORIZONTALE
      if (this.lastHorizontalKeyPressed === KEYS.RIGHT && this.VelocityX > 0 && !right) {
        this.VelocityX -= SPACECRAFT_DEC_X_DELTA;
      }

      if (this.lastHorizontalKeyPressed === KEYS.LEFT && this.VelocityX < 0 && !left) {
        this.VelocityX += SPACECRAFT_DEC_X_DELTA;
      }

      // DECELERAZIONE VERTICALE
      if (this.lastVerticalKeyPressed === KEYS.DOWN && this.VelocityY > 0 && !down) {
        this.VelocityY -= SPACECRAFT_DEC_Y_DELTA;
      }

      if (this.lastVerticalKeyPressed === KEYS.UP && this.VelocityY < 0 && !up) {
        this.VelocityY += SPACECRAFT_DEC_Y_DELTA;
      }

      // SPOSTAMENTO SPRITE
      this.player.setVelocityX(this.VelocityX);
      this.player.setVelocityY(this.VelocityY);

      if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && this.playerWeaponsGroup && this.playerActive) {
        this.playerWeaponsGroup.fireBullet(this.player.x, this.player.y, 'player');
        
      }

    /*this.livesPlayer = this.add.group();
    var firstLifeIconX = 800 - 10 - (this.extraLifesPlayer * 50); //larghezza schermo da rendere parametrica
    for (var i=0; i<this.extraLifesPlayer; i++){
      var life = this.livesPlayer.create(firstLifeIconX + (50 * i), 50, 'spacecraft');
      //this.scoreText = this.add.dynamicBitmapText(600, 300, FONT_NAME, this.extraLifesPlayer.toString(), 60 );
      life.setScale(0.8);
      life.setOrigin(0.5, 0.5);
    } */}
  }
}