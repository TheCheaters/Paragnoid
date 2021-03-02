import Player from '~/sprites/player/player';
import Enemy from '~/sprites/enemies/enemy';
export default (player: Player, enemy: Enemy) => {
    player?.takeHit(1000);
    enemy.takeHit(player.energy);
}