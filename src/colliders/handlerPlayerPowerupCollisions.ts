import { Powerup } from '~/sprites_and_groups/powerups';
import Player from '~/sprites_and_groups/player';

export default (player: Player, powerUp: Powerup) => {
  player.usePowerUp(powerUp.powerUpType);
  powerUp.kill();
}