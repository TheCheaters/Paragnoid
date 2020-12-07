import Player from '~/sprites/player/player';
import { EnemyWeapon } from '~/sprites/weapons/weapon';

export default (player: Player, weapon: EnemyWeapon ) => {
    player.takeHit(weapon.DAMAGE);
    weapon.explode();
}