import _ from 'lodash'
import { defineStore } from 'pinia'
import { Spells } from 'src/components/models'
import SRD_SPELLS from 'src/data/spells.json'

export const useSpellsStore = defineStore('spells', {
  state: (): Spells => ({
    customSpells: {},
  }),
  getters: {
    allSpells: (state) => {
      return {
        ...SRD_SPELLS,
        ...state.customSpells,
      }
    },
  },
  persist: {
    // TODO: change to match custom spell location from v1
    key: 'dev.spells',
  },
})
