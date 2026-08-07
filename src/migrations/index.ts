import * as migration_20260807_214902_initial from './20260807_214902_initial';

export const migrations = [
  {
    up: migration_20260807_214902_initial.up,
    down: migration_20260807_214902_initial.down,
    name: '20260807_214902_initial'
  },
];
