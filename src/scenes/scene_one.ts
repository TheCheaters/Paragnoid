import { Physics, Scene } from 'phaser';

export default class SceneOne extends Scene {
  private platforms?: Phaser.Physics.Arcade.StaticGroup;
  private player?: Phaser.Physics.Arcade.Sprite;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private stars?: Phaser.Physics.Arcade.Group;
  private bombs?: Phaser.Physics.Arcade.Group;
  private score = 0;
  private scoreText?: Phaser.GameObjects.Text;
  private gameOver = false;

  constructor() {
    super('scene-one')
  }
  preload() {
  }
  create() {
  }

  private handleCollectStar(player: Phaser.GameObjects.GameObject, s: Phaser.GameObjects.GameObject) {
  }

  private handlerHitBomb(player: Phaser.GameObjects.GameObject, b: Phaser.GameObjects.GameObject) {
  }

  update() {
  }
}