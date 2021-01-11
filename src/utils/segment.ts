import { Scene } from "phaser";
import Game from '~/scenes/game';
import { DEFAULT } from '~/sprites/enemies/weapons_enemy_types.json';
import { LEFT_KILL_ZONE, RIGHT_KILL_ZONE } from '~/constants.json';

export default class Segment extends Phaser.GameObjects.Line {
 public level !: number
 constructor(scene: Scene, startX: number, startY: number, endX: number, endY: number, level: number){
    super(scene, startX, startY, endX, endY);
 }

// punto medio non serve si può usare la funzione GetMidPoint


}