import Phaser from 'phaser';

import SpacecraftScene from '~/scenes/spacecraft-scene';
import Space from '~/scenes/space-background';

const config: Phaser.Types.Core.GameConfig & { pixelArt: boolean } = {
	type: Phaser.AUTO,
	width: 1600,
	height: 1200,
	pixelArt: true,
	physics: {
		default: 'arcade',
		arcade: {
			debug: false
		}
},
	scene: [Space, SpacecraftScene]
};

new Phaser.Game(config);
