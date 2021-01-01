import PlayerWeapon from '~/sprites/player/player-weapon';
import Enemy from '~/sprites/enemies/enemy';

export default (enemy: Enemy, weapon: PlayerWeapon ) => {
  enemy.takeHit(weapon.damage)
  weapon.kill();
}