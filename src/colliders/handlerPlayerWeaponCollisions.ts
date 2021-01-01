import Player from '~/sprites/player/player';
import EnemyWeapon from '~/sprites/enemies/enemy-weapon';

export default (player: Player, weapon: EnemyWeapon ) => {
    player.takeHit(weapon.damage);
    weapon.explode();
}