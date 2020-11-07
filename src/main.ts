import Phaser from 'phaser';
import Game from '~/scenes/game';
import Background from '~/scenes/background';

declare const process: {
  env: {
    NODE_ENV: string
  }
}

const config: Phaser.Types.Core.GameConfig & { pixelArt: boolean } = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	pixelArt: true,
	physics: {
		default: 'arcade',
		arcade: {
			debug: process.env.NODE_ENV === 'development'
		}
},
	scene: [Background, Game]
};

new Phaser.Game(config);
