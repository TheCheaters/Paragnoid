import { PlayerWeapon } from '~/sprites_and_groups/weapon';
import { Enemy } from '~/sprites_and_groups/enemies';
import Game from '~/scenes/game';
import { AUDIO_EXPLOSION } from '~/constants.json';
import { HIT_ENEMY } from '~/constants.json';

export default (gameScene: Game) => (enemy: Enemy, weapon: PlayerWeapon ) => {
  const {x, y} = enemy;
  enemy.energy = enemy.energy - weapon.DAMAGE;
  weapon.kill();
  if (enemy.energy <= 0) {
    gameScene.score += enemy.getData('score');
    gameScene.scoreText.setText(`Score: ${gameScene.score}`);
    gameScene.explosions?.addExplosion(x, y);
    gameScene.sound.add(AUDIO_EXPLOSION, { loop: false }).play();
    enemy.kill();
  } else {
    gameScene.sound.add (HIT_ENEMY, { loop: false }).play();
  }
}