import Player from '~/sprites/player/player';
import EnemyWeapon from '~/sprites/weapons/enemyWeapon';
import { IMMORTAL } from '~/constants.json';

export default (player: Player, weapon: EnemyWeapon ) => {
    if (!IMMORTAL) player.takeHit(weapon.damage);
    weapon.explode();
}