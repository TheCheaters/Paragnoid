import Phaser from 'phaser';

import Game from '~/scenes/game';
import Background from '~/scenes/background';

const config: Phaser.Types.Core.GameConfig & { pixelArt: boolean } = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	pixelArt: true,
	physics: {
		default: 'arcade',
		arcade: {
			// debug: true
		}
},
	scene: [Background, Game]
};

new Phaser.Game(config);
