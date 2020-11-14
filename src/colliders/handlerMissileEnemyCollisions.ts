import { PlayerWeapon } from '~/sprites_and_groups/weapon';
import { Enemy } from '~/sprites_and_groups/enemies';
import Game from '~/scenes/game';

export default (gameScene: Game) => (enemy: Enemy, missile: PlayerWeapon ) => {
  const {x, y} = enemy;
  enemy.energy = enemy.energy - missile.energy;
  missile.kill();
  if (enemy.energy <= 0) {
    gameScene.score += enemy.getData('score');
    gameScene.scoreText.setText(`Score: ${gameScene.score}`);
    gameScene.explosions?.addExplosion(x, y);
    enemy.kill();
  }
}