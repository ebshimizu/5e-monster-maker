import { defineStore } from 'pinia'
import {
  defaultAttack,
  defaultTrait,
  DndStat,
  Monster,
} from 'src/components/models'
import {
  avgHP,
  bonusForAttack,
  bonusForAttackDamage,
  bonusForSkill,
  statModifier,
} from 'src/components/rendering/mathRendering'
import { CR } from 'src/data/CR'
import { DICE } from 'src/data/DICE'
import { HD_FOR_SIZE } from 'src/data/SIZE'
import { SKILL } from 'src/data/SKILL'
import { v4 as uuidv4 } from 'uuid'
import { useSpellsStore } from './spells-store'

export const MONSTER_VERSION = 5

export const useMonsterStore = defineStore('monster', {
  state: (): Monster => ({
    name: 'My New Monster',
    useArticleInToken: false,
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
    speeds: [
      {
        id: uuidv4(),
        type: 'walk',
        speed: 30,
        note: '',
      },
    ],
    skills: [],
    resistances: [],
    immunities: [],
    vulnerabilities: [],
    conditions: [],
    senses: {
      blindsight: 0,
      darkvision: 0,
      tremorsense: 0,
      truesight: 0,
    },
    passivePerception: {
      override: false,
      overrideValue: 0,
    },
    traits: [],
    spellcasting: {
      stat: 'INT',
      save: {
        override: false,
        overrideValue: 0,
      },
      modifier: {
        override: false,
        overrideValue: 0,
      },
      attack: {
        override: false,
        overrideValue: 0,
      },
      class: undefined,
      level: 1,
      slots: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      atWill: [],
      standard: [],
      notes: '',
      atWillNotes: '',
      useCustomClassPreamble: false,
      customClassPreamble: '',
      useCustomInnatePreamble: false,
      customInnatePreamble: '',
    },
    attacks: [],
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
    computedPassivePerception: (state) => {
      // check if perception is in the skills
      const perception = state.skills.find((s) => s.key === 'PERCEPTION')
      let passive = 10
      if (perception) {
        passive += bonusForSkill(state, perception)
      } else {
        passive += statModifier(state.stats.WIS)
      }

      return passive
    },
    defaultSpellSave: (state) => {
      return (stat: keyof typeof state.stats) =>
        8 + state.proficiency + statModifier(state.stats[stat])
    },
    defaultSpellAttackModifier: (state) => {
      return (stat: keyof typeof state.stats) => {
        return state.proficiency + statModifier(state.stats[stat])
      }
    },
    defaultSpellModifier: (state) => {
      return (stat: DndStat) => {
        return statModifier(state.stats[stat])
      }
    },
    spellSave(): number {
      if (this.spellcasting.save.override) {
        return this.spellcasting.save.overrideValue
      } else {
        return this.defaultSpellSave(this.spellcasting.stat)
      }
    },
    spellAttackModifier(): number {
      if (this.spellcasting.attack.override) {
        return this.spellcasting.attack.overrideValue
      } else {
        return this.defaultSpellAttackModifier(this.spellcasting.stat)
      }
    },
    spellAbilityModifier(): number {
      if (this.spellcasting.modifier.override) {
        return this.spellcasting.modifier.overrideValue
      } else {
        return this.defaultSpellModifier(this.spellcasting.stat)
      }
    },
    attackModifier: (state) => {
      return (id: string): number => {
        const attack = state.attacks.find((a) => a.id === id)

        if (attack) {
          return bonusForAttack(state, attack)
        }

        return 0
      }
    },
    attackDamageModifier: (state) => {
      return (id: string): number => {
        const attack = state.attacks.find((a) => a.id === id)

        if (attack) {
          return bonusForAttackDamage(state, attack)
        }

        return 0
      }
    },
    knownSpellsOfLevel() {
      const spells = useSpellsStore()

      return (level: number) => {
        const allSpells = spells.allSpells

        return this.spellcasting.standard.filter(
          (id) => allSpells[id].level === level
        )
      }
    },
    spellsBySlot(): {
      level: number
      slots: number
      spells: string[]
    }[] {
      const slots = this.spellcasting.slots
      const ret = []
      for (const idx in slots) {
        if (slots[idx] > 0) {
          const spells = this.knownSpellsOfLevel(parseInt(idx) + 1)
          if (spells.length === 0) continue

          const level = parseInt(idx) + 1

          ret.push({
            level,
            slots: slots[idx],
            spells,
          })
        }
      }

      return ret
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
    addSpeed() {
      this.speeds.push({
        id: uuidv4(),
        type: 'walk',
        speed: 30,
        note: '',
      })
    },
    deleteSpeed(id: string) {
      const index = this.speeds.findIndex((s) => s.id === id)

      if (index !== -1) {
        this.speeds.splice(index, 1)
      }
    },
    addSkill(skillName: keyof typeof SKILL) {
      this.skills.push({
        skill: SKILL[skillName],
        key: skillName,
        proficient: false,
        expertise: false,
        override: false,
        overrideValue: 0,
      })
    },
    deleteSkill(skillName: keyof typeof SKILL) {
      const index = this.skills.findIndex((s) => s.key === skillName)

      if (index !== -1) {
        this.skills.splice(index, 1)
      }
    },
    addTrait() {
      this.traits.push(defaultTrait())
    },
    deleteTrait(id: string) {
      const index = this.traits.findIndex((t) => t.id === id)

      if (index !== -1) {
        this.traits.splice(index, 1)
      }
    },
    updateSpellsAtLevel(level: number, spells: string[]) {
      // first get the list of spells at the current level
      const spellsAtLevel = this.knownSpellsOfLevel(level)

      // if a spell isn't in the given list, remove it
      for (const spell of spellsAtLevel) {
        // if the spell isn't in the incoming list remove it
        if (spells.find((name) => name === spell) == null) {
          this.spellcasting.standard.splice(
            this.spellcasting.standard.indexOf(spell),
            1
          )
        }
      }

      // append new spells
      for (const spell of spells) {
        // if the spell isn't in the current list, add it
        if (spellsAtLevel.find((name) => name === spell) == null) {
          this.spellcasting.standard.push(spell)
        }
      }
    },
    addInnateSpellList() {
      this.spellcasting.atWill.push({
        id: uuidv4(),
        count: 1,
        rate: 'DAY',
        spells: [],
      })
    },
    deleteInnateSpellList(id: string) {
      const index = this.spellcasting.atWill.findIndex((aw) => aw.id === id)

      if (index !== -1) this.spellcasting.atWill.splice(index, 1)
    },
    addNewAttack() {
      this.attacks.push(defaultAttack())
    },
    deleteAttack(id: string) {
      const index = this.attacks.findIndex((a) => a.id === id)

      if (index !== -1) {
        this.attacks.splice(index, 1)
      }
    },
    addAdditionalDamage(id: string) {
      const attack = this.attacks.find((a) => a.id === id)

      if (attack) {
        attack.additionalDamage.push({
          id: uuidv4(),
          dice: DICE.d6,
          count: 1,
          type: '',
          note: '',
        })
      }
    },
    deleteAdditionalDamage(id: string, addId: string) {
      const attack = this.attacks.find((a) => a.id === id)

      if (attack) {
        const index = attack.additionalDamage.findIndex((a) => a.id === addId)

        if (index !== -1) {
          attack.additionalDamage.splice(index, 1)
        }
      }
    },
  },
  persist: {
    // this should be changed to app.monster after parity reached, as it will then read all of the
    // existing data correctly
    key: 'dev.monster',
  },
})
