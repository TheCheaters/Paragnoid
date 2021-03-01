import { Scene } from 'phaser';
import eventManager from '~/emitters/event-manager';
import { TimeLineScenes } from '~/game_timeline/timeline';
import Timeline from '~/game_timeline/timeline';

export default class Level extends Scene {
  private levelName: TimeLineScenes;
  private nextLevelName: TimeLineScenes;
  private timeline!: Timeline;

  constructor(levelName: TimeLineScenes, nextLevelName: TimeLineScenes) {
    super({ key: levelName, active: false });
    this.levelName = levelName;
    this.nextLevelName = nextLevelName;
  }
  create() {
    console.log('create Level');
    this.timeline = new Timeline(this);
    this.startTimeline();
  }

  startTimeline() {
    this.timeline.start(this.levelName);
    eventManager.on(`${this.levelName}-is-over`, () => {
      console.log(`Starting Level ${this.nextLevelName}`);
      this.stopTimeline();
      this.scene.start(this.nextLevelName);
    });
  }


  stopTimeline() {
    this.timeline.stop();
  }
}