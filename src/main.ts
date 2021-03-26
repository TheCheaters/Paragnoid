import Phaser from 'phaser';
import Intro from '~/scenes/intro';
import Sound from '~/scenes/sound';
import Space from '~/scenes/space';
import Sky from '~/scenes/sky';
import UI from '~/scenes/ui';
import Game from '~/scenes/game';
import GameOver from '~/scenes/gameover';
import Preloader from '~/scenes/preloader';
import KeyController from '~/scenes/keys_controller';
import debug from '~/utils/debug';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '~/configurations/game.json';

declare const process: {
	env: {
		NODE_ENV: string
	}
}

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	input: {
		gamepad: true,
	},
	scale: {
		mode: Phaser.Scale.FIT,
		parent: 'phaser',
		width: SCREEN_WIDTH,
		height: SCREEN_HEIGHT,
	},
	physics: {
		default: 'arcade',
		arcade: {
			debug,
			useTree: false
		}
	},
	scene: [Preloader, Sound, Space, Sky, UI, Game, Intro, GameOver, KeyController],
};

new Phaser.Game(config);
