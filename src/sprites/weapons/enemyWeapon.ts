import Weapon from '~/sprites/weapons/weapon';
import WEAPON_ENEMY_TYPES from '~/sprites/weapons/weapons_enemy_types.json';
import Game from '~/scenes/game';

type WeaponEnemyType = keyof typeof WEAPON_ENEMY_TYPES;

export default class EnemyWeapon extends Weapon {
  fireEnemy(x: number, y: number, angle: number, follow: number, weaponType: WeaponEnemyType) {
    this.setWeaponTexture(WEAPON_ENEMY_TYPES[weaponType].TEXTURE_NAME, WEAPON_ENEMY_TYPES[weaponType].FRAME_NAME);
    this.damage = (WEAPON_ENEMY_TYPES[weaponType].DAMAGE);
    this.fireSpeed = -(WEAPON_ENEMY_TYPES[weaponType].FIRE_SPEED);
    this.body.enable = true;
    this.body.reset(x + 2, y + 20);
    this.setActive(true);
    this.setVisible(true);
    this.scene.sound.play(this.audioName);
    if (follow === 0){
      this.setVelocityX(this.fireSpeed*Math.cos(Phaser.Math.DegToRad(angle)));
      this.setVelocityY(this.fireSpeed*Math.sin(Phaser.Math.DegToRad(angle)));
      this.setRotation(Phaser.Math.DegToRad(angle));
    }
    if (follow === 1){
      const { player } = this.scene as Game;
      this.setVelocityX(this.fireSpeed*Math.cos(Phaser.Math.DegToRad(angle)));
      this.setVelocityY(this.fireSpeed*Math.sin(Phaser.Math.DegToRad(angle)));
      this.scene.physics.moveToObject(this, player, -this.fireSpeed);
      this.setRotation(Phaser.Math.Angle.Between(player.x, player.y,this.x, this.y));
    }
  }
}
