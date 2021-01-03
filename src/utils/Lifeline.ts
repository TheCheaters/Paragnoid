import Game from "~/scenes/game";
import Enemy from "~/sprites/enemies/enemy";
import Player from "~/sprites/player/player";

colors: {

}

export default class Lifeline {
  private style: Phaser.GameObjects.Graphics;
  private line: Phaser.Geom.Line;
  private sprite: Player | Enemy;

  constructor(scene: Game, sprite: Player | Enemy) {
    this.sprite = sprite;
    this.style = scene.add.graphics({ lineStyle: { width: 5, color: 0x00ff3d } });
    this.line = new Phaser.Geom.Line();
  }

  kill() {
    this.style.clear();
  }
  update() {
    this.style.clear();
    const y = this.sprite.y + (this.sprite.height * this.sprite.scale) + 5;
    this.line.x1 = this.sprite.x;
    this.line.y1 = y;
    this.line.x2 = this.sprite.x + ((this.sprite.width * this.sprite.scale) * this.sprite.energy) / this.sprite.maxEnergy;
    this.line.y2 = y;
    this.style.strokeLineShape(this.line);
  }
}