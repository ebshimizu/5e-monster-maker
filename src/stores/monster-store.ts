import { defineStore } from 'pinia'
import { Monster, MonsterSave } from 'src/components/models'
import { avgHP, statModifier } from 'src/components/rendering/mathRendering'
import { CR } from 'src/data/CR'
import { DICE } from 'src/data/DICE'
import { HD_FOR_SIZE } from 'src/data/SIZE'

export const MONSTER_VERSION = 5

export const useMonsterStore = defineStore('monster', {
  state: (): Monster => ({
    name: 'My New Monster',
    saveVersion: MONSTER_VERSION,
    size: 'Medium',
    type: 'humanoid',
    alignment: '',
    languages: '',
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
    hpDieTypeOverride: false,
    stats: {
      STR: 10,
      DEX: 10,
      CON: 10,
      INT: 10,
      WIS: 10,
      CHA: 10,
    },
    saves: {
      STR: {
        proficient: false,
        override: false,
        overrideValue: 0,
      },
      DEX: {
        proficient: false,
        override: false,
        overrideValue: 0,
      },
      CON: {
        proficient: false,
        override: false,
        overrideValue: 0,
      },
      INT: {
        proficient: false,
        override: false,
        overrideValue: 0,
      },
      WIS: {
        proficient: false,
        override: false,
        overrideValue: 0,
      },
      CHA: {
        proficient: false,
        override: false,
        overrideValue: 0,
      },
    },
  }),
  getters: {
    statsWithModifiers: (state) => {
      const statKeys = Object.keys(state.stats) as (keyof typeof state.stats)[]

      return statKeys.map((k) => {
        return {
          stat: k,
          score: state.stats[k],
          modifier: statModifier(state.stats[k]),
        }
      })
    },
    avgHp: (state) => {
      return avgHP(state.HP)
    },
  },
  actions: {
    setCR(value: number) {
      this.CR = value

      // automatically update proficiency too
      if (!this.proficiencyOverride) {
        this.proficiency = CR[this.CR].proficiency
      }
    },
    toggleProficiencyOverride() {
      this.proficiencyOverride = !this.proficiencyOverride

      if (!this.proficiencyOverride) {
        this.proficiency = CR[this.CR].proficiency
      }
    },
    setSize(value: string) {
      this.size = value

      if (!this.hpDieTypeOverride && value in HD_FOR_SIZE) {
        // value is in hd for size so value is a key
        this.HP.type = HD_FOR_SIZE[value as keyof typeof HD_FOR_SIZE]
      }
    },
    toggleDieTypeOverride() {
      this.hpDieTypeOverride = !this.hpDieTypeOverride

      this.setSize(this.size)
    },
    setHpModifier(
      hdCount: number | string | null,
      con: number | string | null
    ) {
      this.HP.HD = parseInt(`${hdCount}`)
      this.stats.CON = parseInt(`${con}`)

      if (!this.hpModifierOverride) {
        this.HP.modifier = statModifier(this.stats.CON) * this.HP.HD
      }
    },
    toggleHpModifierOverride() {
      this.hpModifierOverride = !this.hpModifierOverride

      // toggle refresh if needed
      this.setHpModifier(this.HP.HD, this.stats.CON)
    },
    setAcByCr() {
      this.AC = CR[this.CR].ac
    },
    setHdByCr() {
      const crObj = CR[this.CR]
      const hpMax = crObj.hpMax
      const gainPerHd = (this.HP.type + 1) / 2 + statModifier(this.stats.CON)

      const hd = Math.max(Math.floor(hpMax / gainPerHd), 1)
      const modifier = hd * statModifier(this.stats.CON)

      this.HP.HD = hd
      this.HP.modifier = modifier
    },
  },
  persist: {
    // this should be changed to app.monster after parity reached, as it will then read all of the
    // existing data correctly
    key: 'dev.monster',
  },
})
