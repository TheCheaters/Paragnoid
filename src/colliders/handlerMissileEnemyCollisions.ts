import { PlayerWeapon } from '~/sprites/weapons/weapon';
import { Enemy } from '~/sprites/enemies/enemies';

export default (enemy: Enemy, weapon: PlayerWeapon ) => {
  enemy.takeHit(weapon.DAMAGE)
  weapon.kill();
}