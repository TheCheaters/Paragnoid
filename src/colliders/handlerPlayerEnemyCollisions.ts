import Player from '~/sprites_and_groups/player';
import { Enemy } from '~/sprites_and_groups/enemies';

export default (player: Player, enemy: Enemy) => {
    enemy.explode();
    player.die();
}