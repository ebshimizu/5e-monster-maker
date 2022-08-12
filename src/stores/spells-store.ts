import N2W from 'number-to-words'
import { defineStore } from 'pinia'
import { DndSpell, Spells } from 'src/components/models'
import SRD_SPELLS from 'src/data/spells.json'

export interface SpellOption {
  value: string
  label: string
  level: number
  class: string[]
  classDisplay: string
}

export const useSpellsStore = defineStore('spells', {
  state: (): Spells => ({
    customSpells: {},
  }),
  getters: {
    allSpells: (state): Record<string, DndSpell> => {
      return {
        ...SRD_SPELLS,
        ...state.customSpells,
      }
    },
    allSpellOptions: (state): SpellOption[] => {
      const allSpells = {
        ...SRD_SPELLS,
        ...state.customSpells,
      }

      const opts = Object.values(allSpells).map((s) => {
        // oh right localization uhhhhh, idk how to go about that in this specific part of the app
        // the right way to do this is probably yet another layer of composition where the localization happens
        // in the lifted out computed value. i should do that
        const classes = s.class.join(', ')

        return {
          value: s.name,
          label: s.name,
          level: s.level,
          levelDisplay:
            s.level === 0 ? 'Cantrip' : `${N2W.toOrdinal(s.level)} Level`,
          class: s.class,
          classDisplay: classes,
        }
      })

      return opts
    },
    spellOptionsByLevel() {
      return (level: number, className?: string) => {
        return this.allSpellOptions.filter((s) => {
          if (className != null) {
            return (
              s.class.find(
                (c) => c.toLowerCase() === className.toLowerCase()
              ) != null && s.level === level
            )
          }

          return s.level === level
        })
      }
    },
  },
  actions: {
    addSpell(spell: DndSpell) {
      // hey it might've gotten through validation
      if (!(spell.name in this.customSpells)) {
        this.customSpells[spell.name] = spell
      }
    },
    deleteSpell(name: string) {
      delete this.customSpells[name]
    },
    updateFromV1() {
      // if the old app key exists, we should copy that over and then delete it
      const oldCustom = localStorage.getItem('app.customSpells')

      if (oldCustom != null) {
        // need to reformat with new key
        const old = JSON.parse(oldCustom)

        // remove unused fields and assign to new format
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        old.forEach((s: any) => {
          delete s.levelDisplay

          this.customSpells[s.name] = s as DndSpell
        })

        // delete the old key
        localStorage.removeItem('app.customSpells')
      }
    },
  },
  persist: {
    // TODO: change to match custom spell location from v1
    key: 'app.spells',
  },
})
