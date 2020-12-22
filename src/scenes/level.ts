import { Scene } from 'phaser';
import sceneChangeEmitter from '~/emitters/scene-change-emitter';
import { TimeLineScenes } from '~/game_timeline/timeline';
import Timeline from '~/game_timeline/timeline';
import Background from '~/scenes/background';

export default class Level extends Scene {
  private levelName: TimeLineScenes;
  private nextLevelName: TimeLineScenes;
  private timeline!: Timeline;
  private background!: Background;
  camera!: Phaser.Cameras.Scene2D.Camera
  constructor(levelName: TimeLineScenes, nextLevelName: TimeLineScenes) {
    super({ key: levelName, active: false });
    this.levelName = levelName;
    this.nextLevelName = nextLevelName;
  }
  create() {
    console.log('create Level');
    this.background = this.scene.get('background') as Background;
    this.timeline = new Timeline(this);
    this.startTimeline();
  }

  startTimeline() {
    this.timeline.start(this.levelName);
    this.background.launchEnemyWawe(this.levelName);
    sceneChangeEmitter.on(`${this.levelName}-boss-is-dead`, () => {
      console.log(`Starting Level ${this.nextLevelName}`);
      this.stopTimeline();
      this.background.stopEnemyWave();
      this.scene.start(this.nextLevelName);
    });
  }

  stopTimeline() {
    this.timeline.stop();
  }
}