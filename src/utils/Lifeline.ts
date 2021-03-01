import Game from "~/scenes/game";
import Enemy from "~/sprites/enemies/enemy";

export default class Lifeline {
  private style: Phaser.GameObjects.Graphics;
  private line: Phaser.Geom.Line;
  private sprite: Enemy;
  private shifted: boolean | undefined;
  private colors = [0x00ff3d, 0xffff00, 0xff0000];

  constructor(scene: Game, sprite: Enemy, shifted?: boolean) {
    this.sprite = sprite;
    this.shifted = shifted;
    this.style = scene.add.graphics({ lineStyle: { width: 3, color: this.colors[0] } });
    this.line = new Phaser.Geom.Line();
  }

  kill() {
    this.style.clear();
  }
  update() {
    this.style.clear();
    const larg = (this.sprite.width * this.sprite.scale);
    if (this.shifted) {
      const y = this.sprite.y + (this.sprite.height * this.sprite.scale) - 20;
      this.line.x1 = this.sprite.x - (larg / 2);
      this.line.y1 = y;
      this.line.x2 = this.sprite.x + (larg * this.sprite.energy) / this.sprite.maxEnergy - (larg / 2);
      this.line.y2 = y;
    } else {
      const y = this.sprite.y + (this.sprite.height * this.sprite.scale) - 20;
      this.line.x1 = this.sprite.x;
      this.line.y1 = y;
      this.line.x2 = this.sprite.x + (larg * this.sprite.energy) / this.sprite.maxEnergy;
      this.line.y2 = y;
    }
    const ratio = this.sprite.energy / this.sprite.maxEnergy
    const color = (ratio > 0.7) ? this.colors[0] : (ratio > 0.3) ? this.colors[1] : this.colors[2];
    this.style.lineStyle(3, color);
    this.style.strokeLineShape(this.line);
  }
}