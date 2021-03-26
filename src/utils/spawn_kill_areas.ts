import { SCREEN_WIDTH, SCREEN_HEIGHT, CAMERA_WIDTH, CAMERA_HEIGHT, KILL_GAP, SPAWN_GAP } from '~/configurations/game.json';

const rightLimit = (CAMERA_WIDTH - SCREEN_WIDTH) / 2;
const leftLimit = ((CAMERA_WIDTH - SCREEN_WIDTH) / 2) + CAMERA_WIDTH;

const topLimit = (CAMERA_HEIGHT - SCREEN_HEIGHT) / 2;
const bottomLimit = ((CAMERA_HEIGHT - SCREEN_HEIGHT) / 2) + CAMERA_HEIGHT;

const LEFT_SPAWN_ZONE = -1 * (rightLimit + SPAWN_GAP);
const LEFT_KILL_ZONE = -1 * (rightLimit + KILL_GAP);

const RIGHT_SPAWN_ZONE = leftLimit + SPAWN_GAP;
const RIGHT_KILL_ZONE = leftLimit + KILL_GAP;

const TOP_SPAWN_ZONE = -1 * (topLimit + SPAWN_GAP);
const TOP_KILL_ZONE = -1 * (topLimit + KILL_GAP);

const BOTTOM_SPAWN_ZONE = bottomLimit + SPAWN_GAP;
const BOTTOM_KILL_ZONE = bottomLimit + KILL_GAP;

console.log('LEFT_SPAWN_ZONE', LEFT_SPAWN_ZONE);
console.log('LEFT_KILL_ZONE', LEFT_KILL_ZONE);
console.log('RIGHT_SPAWN_ZONE', RIGHT_SPAWN_ZONE);
console.log('RIGHT_KILL_ZONE', RIGHT_KILL_ZONE);
console.log('TOP_SPAWN_ZONE', TOP_SPAWN_ZONE);
console.log('TOP_KILL_ZONE', TOP_KILL_ZONE);
console.log('BOTTOM_SPAWN_ZONE', BOTTOM_SPAWN_ZONE);
console.log('BOTTOM_KILL_ZONE', BOTTOM_KILL_ZONE);

export {
  LEFT_SPAWN_ZONE,
  LEFT_KILL_ZONE,
  RIGHT_SPAWN_ZONE,
  RIGHT_KILL_ZONE,
  TOP_SPAWN_ZONE,
  TOP_KILL_ZONE,
  BOTTOM_SPAWN_ZONE,
  BOTTOM_KILL_ZONE,
}