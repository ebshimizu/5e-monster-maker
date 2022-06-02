import { defineStore } from 'pinia'
import { Monster } from 'src/components/models'
import { DICE } from 'src/data/DICE'

export const MONSTER_VERSION = 5

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
    proficiencyOverride: false,
    HP: {
      HD: 1,
      type: DICE.d8,
      modifier: 0,
    },
    hpModifierOverride: false,
    stats: {
      STR: 10,
      DEX: 10,
      CON: 10,
      INT: 10,
      WIS: 10,
      CHA: 10,
    },
    languages: '',
  }),
  actions: {},
  persist: {
    // this should be changed to app.monster after parity reached, as it will then read all of the
    // existing data correctly
    key: 'dev.monster',
  },
})
