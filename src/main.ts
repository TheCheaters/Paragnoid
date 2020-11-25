import Phaser from 'phaser';
import Intro from '~/scenes/intro';
import Background from '~/scenes/background';
import Game from '~/scenes/game';
import GameOver from '~/scenes/gameover';
import Preloader from '~/scenes/preloader';

declare const process: {
	env: {
		NODE_ENV: string
	}
}

type extraConfig = {
	pixelArt: boolean
}

const config: Phaser.Types.Core.GameConfig & extraConfig = {
	type: Phaser.AUTO,
	scale: {
		mode: Phaser.Scale.FIT,
		parent: 'phaser',
		width: 1200,
		height: 600,
		min: {
				width: 800,
				height: 400
		},
		max: {
				width: 2400,
				height: 1200
		}
	},
	pixelArt: true,
	physics: {
		default: 'arcade',
		arcade: {
			debug: process.env.NODE_ENV === 'development',
			useTree: false
		}
	},
	scene: [Preloader, Background, Intro, Game, GameOver],
};

new Phaser.Game(config);
