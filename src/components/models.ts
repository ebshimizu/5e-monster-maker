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

// the big one is the monster definition
export interface Monster {
  name: string
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
}
