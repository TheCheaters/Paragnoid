import PlayerWeapon from '~/sprites/weapons/PlayerWeapon';
import { Enemy } from '~/sprites/enemies/enemies';

export default (enemy: Enemy, weapon: PlayerWeapon ) => {
  enemy.takeHit(weapon.damage)
  weapon.kill();
}