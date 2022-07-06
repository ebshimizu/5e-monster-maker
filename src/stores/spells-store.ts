import _ from 'lodash'
import N2W from 'number-to-words'
import { defineStore } from 'pinia'
import { Spells } from 'src/components/models'
import SRD_SPELLS from 'src/data/spells.json'
import { useI18n } from 'vue-i18n'

export interface SpellOption {
  value: string
  label: string
  level: number
  levelDisplay: string
  classDisplay: string
}

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
    allSpellOptions: (state) => {
      const allSpells = {
        ...SRD_SPELLS,
        ...state.customSpells,
      }

      const opts = Object.values(allSpells).map((s) => {
        // oh right localization uhhhhh, idk how to go about that in this specific part of the app
        const classes = s.class.join(', ')

        return {
          value: s.name,
          label: s.name,
          level: s.level,
          levelDisplay: `${N2W.toOrdinal(s.level)} Level`,
          classDisplay: classes,
        }
      })

      return opts
    },
    // spellOptionsByLevel:
  },
  persist: {
    // TODO: change to match custom spell location from v1
    key: 'dev.spells',
  },
})
