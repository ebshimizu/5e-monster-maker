import { DICE } from 'src/data/DICE'
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

export interface DndLimitedUse {
  count: number
  rate: string
}

export interface MonsterTrait {
  name: string
  id: string
  description: string
  limitedUse: DndLimitedUse
  customPreamble: boolean
  crAnnotation: MonsterCrAnnotation
}

export interface ActionEffect {
  case: string
  effect: string
}

export interface MonsterAction {
  name: string
  id: string
  description: string
  recharge: string
  legendaryOnly: boolean
  limitedUse: DndLimitedUse
  stat: DndStat | 'none'
  save: {
    override: boolean
    overrideValue: number
  }
  range: string
  effects: ActionEffect[]
  customPreamble: boolean
  bonusAction: boolean
  crAnnotation: MonsterCrAnnotation
}

export interface LairAction {
  id: string
  description: string
  crAnnotation: MonsterCrAnnotation
}

export interface DndSpell {
  name: string
  damage: number
  multitarget: boolean
  class: string[]
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

export interface AdditionalAttackDamage {
  id: string
  dice: number
  count: number
  type: string
  note: string
}

export interface Multiattack {
  id: string
  attacks: string[]
  actions: string[]
}

export interface DndAttack {
  id: string
  name: string
  distance: 'MELEE' | 'RANGED' | 'BOTH'
  kind: 'WEAPON' | 'SPELL'
  modifier: {
    override: boolean
    overrideValue: number
    stat: DndStat
    proficient: boolean
  }
  range: {
    standard: number
    long: number
    reach: number
  }
  targets: number
  damage: {
    dice: number
    count: number
    modifier: {
      override: boolean
      overrideValue: number
      stat: DndStat
    }
    type: string
  }
  alternateDamage: {
    dice: number
    count: number
    modifier: {
      override: boolean
      overrideValue: number
      stat: DndStat
    }
    type: string
    condition: string
    active: boolean
  }
  additionalDamage: AdditionalAttackDamage[]
  save: number | undefined
  description: string
  legendaryOnly: boolean
  useCustomRenderer: boolean
  customRenderer: string
}

export interface LegendaryAction {
  actionId: string
  cost: number
}

export interface MonsterReaction {
  name: string
  id: string
  description: string
  limitedUse: DndLimitedUse
  trigger: string
}

export interface CrAttackInfo {
  name: string
  damage: number
  toHit: number
  save: number | undefined
  type: 'Attack' | 'Multiattack' | 'Lair Action'
}

export interface CrActionInfo {
  name: string
  damage: number
  toHit: number
  save: number | undefined
  limited: boolean
  uses: number
  type: 'Action' | 'LimitedMultiattack'
}

export interface CrTraitInfo {
  name: string
  damage: number
  limited: boolean
  uses: number
  save: number
  toHit: number
  remove: boolean
  type: 'Trait'
}

export interface CrLegendaryInfo {
  name: string
  damage: number
  limited: boolean
  uses: number
  save: number | undefined
  toHit: number
  cost: number
  type: 'Legendary'
}

export interface CrSpellInfo {
  name: string
  damage: number
  save: number
  type: 'Spell'
}

export interface CrDamageInfo {
  attacks: CrAttackInfo[]
  actions: CrActionInfo[]
  legendary: CrLegendaryInfo[]
  traits: CrTraitInfo[]
  spells: CrSpellInfo[]
  lairActions: CrAttackInfo[]
  legendaryCount: number
}

// these arrays can be swapped with the SwapButtons component
export type SwappableField =
  | 'actions'
  | 'traits'
  | 'attacks'
  | 'reactions'
  | 'lairActions'
  | 'regionalEffects'

// the big one is the monster definition
export interface Monster {
  name: string
  nickname: string
  saveVersion: number
  useArticleInToken: boolean
  alphaTraits: boolean
  size: string
  type?: string
  alignment?: string
  languages: string
  AC: number
  ACType: string
  CR: number
  lairCr: number
  lairCrNote: string
  useCrDisplayOverride: boolean
  crOverride: string
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
  resistances: string[]
  immunities: string[]
  vulnerabilities: string[]
  conditions: string[]
  senses: {
    blindsight: number
    darkvision: number
    tremorsense: number
    truesight: number
  }
  sensesNotes: string
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
    class: string | undefined
    level: number
    slots: number[]
    atWill: DndAtWillSpell[]
    standard: string[]
    notes: string
    atWillNotes: string
    useCustomClassPreamble: boolean
    customClassPreamble: string
    useCustomInnatePreamble: boolean
    customInnatePreamble: string
  }
  attacks: DndAttack[]
  actions: MonsterAction[]
  multiattacks: Multiattack[]
  multiattackOptions: {
    useCustomRenderer: boolean
    customMultiattackRenderer: string
    postscript: string
  }
  legendaryActions: {
    count: number
    actions: LegendaryAction[]
    useCustomPreamble: boolean
    customPreamble: string
  }
  mythicActions: {
    triggerName: string
    triggerRecharge: string
    triggerDescription: string
    preamble: string
    actions: LegendaryAction[]
  }
  reactions: MonsterReaction[]
  useCustomLairActionPreamble: boolean
  lairActionPreamble: string
  lairActions: LairAction[]
  regionalEffects: { id: string; description: string }[]
  regionalEffectDescription: string
  inventory: string
  autoEstimateDefenseCr: boolean
}

// Define the monster archive
export interface MonsterArchive {
  monsters: Record<string, MonsterEntry>
}

// Define a monster entry with necessary metadata.
export interface MonsterEntry {
  created_at: Date,
  updated_at: Date,
  monster: Monster
}

// uhhhhhh
// how do i template
// templates are ... augmented regular things so let's see...
export interface TemplateMetadata<T> {
  type: T
  icon: string
  templateName: string
}

// templates have no id because they're not instantiated
export type RemoveId<T> = {
  [Property in keyof T as Exclude<Property, 'id'>]: T[Property]
}

export interface AttackTemplate
  extends RemoveId<DndAttack>,
    TemplateMetadata<'Attack'> {}

export interface ActionTemplate
  extends RemoveId<MonsterAction>,
    TemplateMetadata<'Action'> {}

export interface TraitTemplate
  extends RemoveId<MonsterTrait>,
    TemplateMetadata<'Trait'> {}

export interface ReactionTemplate
  extends RemoveId<MonsterReaction>,
    TemplateMetadata<'Reaction'> {}

// extend this as needed for other action types
export type DndTemplate =
  | AttackTemplate
  | ActionTemplate
  | TraitTemplate
  | ReactionTemplate

export interface Templates {
  customTemplates: Record<string, DndTemplate>
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
    include: true,
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

export function defaultAction(): MonsterAction {
  return {
    name: 'New Action',
    id: v4(),
    description: '',
    recharge: '',
    limitedUse: {
      count: 0,
      rate: 'DAY',
    },
    save: {
      override: false,
      overrideValue: 0,
    },
    range: '',
    stat: 'none',
    effects: [],
    legendaryOnly: false,
    customPreamble: false,
    bonusAction: false,
    crAnnotation: defaultCrAnnotation(),
  }
}

export function defaultAttack(): DndAttack {
  return {
    id: v4(),
    name: 'New Attack',
    distance: 'MELEE',
    kind: 'WEAPON',
    modifier: {
      override: false,
      overrideValue: 0,
      stat: 'STR',
      proficient: true,
    },
    range: {
      standard: 20,
      long: 60,
      reach: 5,
    },
    targets: 1,
    damage: {
      dice: DICE.d6,
      count: 1,
      modifier: {
        override: false,
        overrideValue: 0,
        stat: 'STR',
      },
      type: 'slashing',
    },
    alternateDamage: {
      dice: DICE.d6,
      count: 1,
      modifier: {
        override: false,
        overrideValue: 0,
        stat: 'STR',
      },
      type: 'slashing',
      condition: '',
      active: false,
    },
    additionalDamage: [],
    save: 0,
    description: '',
    legendaryOnly: false,
    useCustomRenderer: false,
    customRenderer: '',
  }
}
