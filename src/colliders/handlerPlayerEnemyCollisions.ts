import Player from '~/sprites/player/player';
import Enemy from '~/sprites/enemies/enemy';
import { IMMORTAL } from '~/constants.json';
export default (player: Player, enemy: Enemy) => {
    if (!IMMORTAL) player.takeHit(1000);
    enemy.takeHit(player.energy);
}