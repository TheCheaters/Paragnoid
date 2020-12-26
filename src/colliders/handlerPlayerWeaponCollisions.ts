import Player from '~/sprites/player/player';
import EnemyWeapon from '~/sprites/weapons/enemyWeapon';

export default (player: Player, weapon: EnemyWeapon ) => {
    player.takeHit(weapon.damage);
    weapon.explode();
}