import Phaser from 'phaser';
import Intro from '~/scenes/intro';
import Background from '~/scenes/background';
import Game from '~/scenes/game';

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
	scene: [Background, Intro, Game],
};

new Phaser.Game(config);
