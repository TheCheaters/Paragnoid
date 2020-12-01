import { PlayerWeapon } from '~/sprites_and_groups/weapon';
import { Enemy } from '~/sprites_and_groups/enemies';

export default (enemy: Enemy, weapon: PlayerWeapon ) => {
  enemy.takeHit(weapon.DAMAGE)
  weapon.kill();
}