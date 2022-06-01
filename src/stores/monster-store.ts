import { defineStore } from 'pinia';
import { Monster } from 'src/components/models';
import DICE from 'src/data/DICE';

export const MONSTER_VERSION = 4;

export const useMonsterStore = defineStore('monster', {
  state: (): Monster => ({
    name: 'My New Monster',
    saveVersion: MONSTER_VERSION,
    size: 'Medium',
    type: 'humanoid',
    alignment: '',
    AC: 10,
    ACType: '',
    CR: 0,
    proficiency: 4,
    HP: {
      HD: 1,
      type: DICE.d8,
      modifier: 0,
    },
    stats: {
      STR: 10,
      DEX: 10,
      CON: 10,
      INT: 10,
      WIS: 10,
      CHA: 10,
    },
  }),
  actions: {},
  persist: true,
});
