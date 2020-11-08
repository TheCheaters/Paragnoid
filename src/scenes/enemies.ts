import { Scene } from "phaser";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  public energy: number;
  public score: number;
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, 'enemy');
    this.energy = 100;
    this.score = 10;
  }
  
  make(x: number, y: number) {
    this.energy = 100;
    this.body.immovable = true;
    this.body.enable = true;
    this.body.reset(x, y);

    this.setActive(true);
    this.setVisible(true);

    this.setVelocityX(-350);
  }

  kill() {
    this.body.enable = false;
    this.setActive(false);
    this.setVisible(false);
    this.setVelocity(0);
  }

	preUpdate(time: number, delta: number) {
		super.preUpdate(time, delta);
    this.anims.play('enemy', true);

		if (this.x < -100) {
			this.setActive(false);
			this.setVisible(false);
		}
	}

}

export default class Enemies extends Phaser.Physics.Arcade.Group {
  constructor(scene: Scene, texture: string) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 30,
      key: texture,
      setXY: { x: 500, y: 1000 },
      active: false,
      visible: false,
      classType: Enemy
    });

    scene.anims.create ({
      key: texture,
      frames: scene.anims.generateFrameNumbers (texture, {
        start: 0,
        end: 1
      }),
      frameRate: 2
    });

    scene.time.addEvent({ delay: 2000, callback: this.makeEnemy, callbackScope: this, loop: true });

  }

  makeEnemy() {
    const y = Phaser.Math.Between(0, 600);
    const x = 900;
    const laser = this.getFirstDead(false);

    if (laser) {
      laser.make(x, y);
    }   
  }
}

export class EnemyWeapon1 extends Phaser.Physics.Arcade.Sprite {
  energy = 90;
  enemyWeapon1Active = 1; 
  constructor (scene: Scene, x:number, y:number)
    {
        super(scene, x, y, 'enemyweapon1');

        this.setScale(0.5);
    }

    fire (x:number, y:number)
    {
        this.body.enable = true;
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);

        this.setVelocityX(200);
    }
    stop ()
    {
        this.setActive(false);
        this.setVisible(false);

        this.setVelocityX(0);

        this.body.enable = false;
    }
    preUpdate (time:number, delta:number)
    {
        super.preUpdate(time, delta);
        if (this.x >= 800)
        {
            this.stop();            
        }
    }
}

export class EnemyWeaponsGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene: Scene, texture: string) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 5,
      setXY: { x: 1000, y: 2000 },
      key: texture,
      active: false,
      visible: false,
      classType: EnemyWeapon1
    });

  }

  fireBullet(x: number, y: number) {
    const EnemyWeapon1 = this.getFirstDead(false);

    if (EnemyWeapon1) {
      EnemyWeapon1.fire(x, y);
    }
  }
}