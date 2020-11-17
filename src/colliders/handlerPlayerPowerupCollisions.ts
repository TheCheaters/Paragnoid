import { Powerup } from '~/sprites_and_groups/powerups';
import Player from '~/sprites_and_groups/player';

import Game from '~/scenes/game';

export default (gameScene: Game) => (player: Player, powerup: Powerup) => {
  console.log(powerup.getData('powerupValues'));
  powerup.kill();
}