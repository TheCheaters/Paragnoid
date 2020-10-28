import Phaser from 'phaser';

import SceneOne from './scenes/scene_one';

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
		debug: true
		gravity: {y: 300}
		}
},
	scene: [SceneOne]
};

new Phaser.Game(config);
