import Game from "~/scenes/game";
import Enemy from "~/sprites/enemies/enemy";
import Player from "~/sprites/player/player";

export default class Lifeline {
  private style: Phaser.GameObjects.Graphics;
  private line: Phaser.Geom.Line;
  private sprite: Player | Enemy;
  private shifted: boolean | undefined;

  constructor(scene: Game, sprite: Player | Enemy, shifted?: boolean) {
    this.sprite = sprite;
    this.shifted = shifted;
    this.style = scene.add.graphics({ lineStyle: { width: 5, color: 0x00ff3d } });
    this.line = new Phaser.Geom.Line();
  }

  kill() {
    this.style.clear();
  }
  update() {
    this.style.clear();
    const larg = (this.sprite.width * this.sprite.scale);
    if (this.shifted) {
      const y = this.sprite.y + (this.sprite.height * this.sprite.scale) + 5;
      this.line.x1 = this.sprite.x - (larg / 2);
      this.line.y1 = y;
      this.line.x2 = this.sprite.x + (larg * this.sprite.energy) / this.sprite.maxEnergy - (larg / 2);
      this.line.y2 = y;
    } else {
      const y = this.sprite.y + (this.sprite.height * this.sprite.scale) + 5;
      this.line.x1 = this.sprite.x;
      this.line.y1 = y;
      this.line.x2 = this.sprite.x + (larg * this.sprite.energy) / this.sprite.maxEnergy;
      this.line.y2 = y;
    }
    this.style.strokeLineShape(this.line);
  }
}