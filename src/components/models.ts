import { SKILL } from 'src/data/SKILL'
import { v4 } from 'uuid'

export type DndStat = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA'

// subtypes used in various parts of the monster
export interface DndDice {
  HD: number
  type: number
  modifier: number
}

export interface MonsterSave {
  proficient: boolean
  override: boolean
  overrideValue: number
}

export interface MonsterSpeed {
  id: string
  type?: string // type can be nulled in the picker text entry
  speed: number
  note: string
}

export interface MonsterSkill {
  key: keyof typeof SKILL
  skill: {
    stat: DndStat
    label: string
  }
  proficient: boolean
  expertise: boolean
  override: boolean
  overrideValue: number
}

export interface MonsterCrAnnotation {
  maxDamage: number
  maxSave: number
  maxModifier: number
  multitarget: boolean
  ehpMultiplier: number
  ehpModifier: number
  acModifier: number
  include: boolean
  automatic: boolean
}

export interface MonsterTrait {
  name: string
  id: string
  description: string
  limitedUse: {
    count: number
    rate: string
  }
  customPreamble: boolean
  crAnnotation: MonsterCrAnnotation
}

export interface DndSpell {
  name: string
  damage: number
  multitarget: boolean
  class: string[]
  levelDisplay: string
  level: number
  srd: boolean
  custom: boolean
}

export interface DndAtWillSpell {
  id: string
  count: number
  rate: string
  spells: string[]
}

// the big one is the monster definition
export interface Monster {
  name: string
  useArticleInToken: boolean
  saveVersion: number
  size: string
  type?: string
  alignment?: string
  languages: string
  AC: number
  ACType: string
  CR: number
  proficiency: number
  proficiencyOverride: boolean
  HP: DndDice
  hpModifierOverride: boolean
  hpDieTypeOverride: boolean
  stats: {
    STR: number
    DEX: number
    CON: number
    INT: number
    WIS: number
    CHA: number
  }
  saves: {
    STR: MonsterSave
    DEX: MonsterSave
    CON: MonsterSave
    INT: MonsterSave
    WIS: MonsterSave
    CHA: MonsterSave
  }
  speeds: MonsterSpeed[]
  skills: MonsterSkill[]
  resistances: string[] | null
  immunities: string[] | null
  vulnerabilities: string[] | null
  conditions: string[] | null
  senses: {
    blindsight: number
    darkvision: number
    tremorsense: number
    truesight: number
  }
  passivePerception: {
    override: boolean
    overrideValue: number | null
  }
  traits: MonsterTrait[]
  spellcasting: {
    stat: DndStat
    save: {
      override: boolean
      overrideValue: number
    }
    modifier: {
      override: boolean
      overrideValue: number
    }
    attack: {
      override: boolean
      overrideValue: number
    }
    class: string | null
    level: number
    slots: number[]
    atWill: DndAtWillSpell[]
    standard: string[]
    notes: string
    atWillNotes: string
    useCustomPreamble: boolean
    customPreamble: string
  }
}

export interface Spells {
  customSpells: Record<string, DndSpell>
}

export function defaultCrAnnotation(): MonsterCrAnnotation {
  return {
    maxDamage: 0,
    maxSave: 0,
    maxModifier: 0,
    multitarget: false,
    ehpMultiplier: 1,
    ehpModifier: 0,
    acModifier: 0,
    include: false,
    automatic: true,
  }
}

export function defaultTrait(): MonsterTrait {
  return {
    name: 'New Trait',
    id: v4(),
    description: '',
    limitedUse: {
      count: 0,
      rate: 'DAY',
    },
    customPreamble: false,
    crAnnotation: defaultCrAnnotation(),
  }
}
