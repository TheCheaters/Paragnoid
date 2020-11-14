import Player from '~/sprites_and_groups/player';
import { EnemyWeapon } from '~/sprites_and_groups/weapon';
import { Enemy } from '~/sprites_and_groups/enemies';
import Game from '~/scenes/game';

export default (gameScene: Game) => (player: Player, enemyOrEnemyWeapon: Enemy | EnemyWeapon ) => {
    const {x, y} = enemyOrEnemyWeapon;
    const {x:a, y:b} = player;
    const respawnTime = 500;

    gameScene.explosions?.addExplosion(x, y);
    gameScene.explosions?.addExplosion(a, b);
    enemyOrEnemyWeapon.kill();

    if (gameScene.lives.extraLifesPlayer > 0){
      gameScene.colliderPlayerEnemy.active = false;
      gameScene.colliderPlayerWeapons.active = false;
      gameScene.lives.extraLifesPlayer -= 1;
      gameScene.lives.destroyLives();

      gameScene.tweens.addCounter({
        from: 255,
        to: 0,
        duration: respawnTime,
        ease: Phaser.Math.Easing.Sine.InOut,
        repeat: 3,
        yoyo: true,
        onUpdate: tween => {
          const valoreFrame = tween.getValue()
          player.setTint(Phaser.Display.Color.GetColor(valoreFrame, valoreFrame, valoreFrame));
             },
        onStart: () => {
          gameScene.colliderEnemyWeapons.active = true;
        },
        onComplete: () => {
          gameScene.colliderPlayerEnemy.active = true;
          gameScene.colliderPlayerWeapons.active = true;
          gameScene.colliderEnemyWeapons.active = true;
        }
      });
    } else {
      player.kill();
      gameScene.scene.start('gameover');
     }
  }