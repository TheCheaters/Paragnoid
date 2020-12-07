import { Powerup } from '~/sprites/powerups/powerups';
import Player from '~/sprites/player/player';

export default (player: Player, powerUp: Powerup) => {
  player.usePowerUp(powerUp.powerUpType);
  powerUp.kill();
}