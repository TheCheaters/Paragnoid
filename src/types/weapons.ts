import WEAPON_SATELLITE_TYPES from '~/sprites/satellites/weapons_satellite_types.json';
import WEAPON_ENEMY_TYPES from '~/sprites/enemies/weapons_enemy_types.json';
import WEAPON_PLAYER_TYPES from '~/sprites/player/weapons_player_types.json';
export type WeaponPlayerType    = keyof typeof WEAPON_PLAYER_TYPES;
export type WeaponEnemyType     = keyof typeof WEAPON_ENEMY_TYPES;
export type WeaponSatelliteType = keyof typeof WEAPON_SATELLITE_TYPES;
export type WeaponTypeName      = WeaponPlayerType | WeaponEnemyType | WeaponSatelliteType;

export type Level = {
  ANGLE:               number[],
  TEXTURE_NAME:        string;
  FRAME_NAME:          string;
  GRAVITY_X:           number;
  GRAVITY_Y:           number;
  VERTICAL_OFFSET:     number;
  DURATION:            number;
}

export type WeaponType = {
  DAMAGE:           number;
  FIRE_SPEED:       number;
  TEXTURE_NAME:     string;
  LEVELS:           Level[];
  FRAME_NAME:       string;
  AUDIO_NAME:       string;
  AUDIO_ASSET_PATH: string;
  WIDTH:            number;
  HEIGHT:           number;
  SCALE:            number;
  EXPLODES:         boolean;
  PARTICLES:        'LASER' | 'SMOKE';
  FOLLOW:           boolean;
}

export type PlayerWeaponType = WeaponType & {
  LEVELS: Level[]
}

export type PlayerWeaponTypes = {
    [key in WeaponPlayerType]: PlayerWeaponType
}

export type WeaponTypes = {
    [key in WeaponTypeName]?: WeaponType
}
