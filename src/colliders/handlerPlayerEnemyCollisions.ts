import Player from '~/sprites/player/player';
import { Enemy } from '~/sprites/enemies/enemies';

export default (player: Player, enemy: Enemy) => {
    player.takeHit(1000);
    enemy.explode();
}