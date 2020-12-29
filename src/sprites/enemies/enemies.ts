import { Scene } from "phaser";
import ENEMY_TYPES from '~/sprites/enemies/enemy_types.json';
import Enemy, { Make } from '~/sprites/enemies/enemy';
export default class Enemies extends Phaser.Physics.Arcade.Group {
  constructor(scene: Scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 70,
      key: ENEMY_TYPES.DEFAULT.TEXTURE_NAME,
      setXY: {x: -500, y: -500},
      active: false,
      visible: false,
      classType: Enemy
    });

  }

  makeEnemy({ enemyType, enemyBehavior, enemyPath, enemyFlip }: Make) {
    const enemy = this.getFirstDead(false) as Enemy;
    if (enemy) enemy.make({ enemyType, enemyBehavior, enemyPath, enemyFlip });
  }

  getChildrenAlive(){

    const enemiesAlive: Phaser.GameObjects.GameObject[] = [];
    this.children.iterate((child => {
        if (child.active) {
          enemiesAlive.push(child);
        }
    }))
     return enemiesAlive;
  }

}
