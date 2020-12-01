import Player from '~/sprites_and_groups/player';
import { EnemyWeapon } from '~/sprites_and_groups/weapon';

export default (player: Player, weapon: EnemyWeapon ) => {
    player.takeHit(weapon.DAMAGE);
    weapon.explode();
}