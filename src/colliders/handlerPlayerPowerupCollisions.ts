import { Powerup } from '~/sprites_and_groups/powerups';
import Player from '~/sprites_and_groups/player';

export default (player: Player, powerup: Powerup) => {
  console.log(powerup.getData('powerupValues'));
  player.upgradeWeapon();
  powerup.kill();
}