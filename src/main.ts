import Phaser from 'phaser';

import SpacecraftScene from '~/scenes/spacecraft-scene';
import Space from '~/scenes/space-background';

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
		debug: false
		}
},
	scene: [Space, SpacecraftScene]
};

new Phaser.Game(config);
