export interface Open5eAction {
  name: string
  desc: string
  attack_bonus?: number
  damage_dice?: string
}

export interface Open5eMonster {
  slug: string
  name: string
  size: string
  type: string
  subtype: string
  group: null | string
  alignment: string
  armor_class: number
  armor_desc: string
  hit_points: number
  hit_dice: string
  speed: Record<string, number>
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
  strength_save: number | null
  dexterity_save: number | null
  constitution_save: number | null
  intelligence_save: number | null
  wisdom_save: number | null
  charisma_save: number | null
  perception: number
  skills: Record<string, number>
  damage_vulnerabilities: string
  damage_resistances: string
  damage_immunities: string
  condition_immunities: string
  senses: string
  languages: string
  challenge_rating: string
  actions: Open5eAction[] | ''
  reactions: Open5eAction[] | ''
  legendary_desc: string
  legendary_actions: Open5eAction[] | ''
  special_abilities: Open5eAction[] | ''
  spell_list: string[]
  img_main?: string
  document__slug: string
  document__title: string
  document__license_url: string
}

export interface Open5eMonsterResponse {
  count: number
  next: string | null
  previous: string | null
  results: Open5eMonster[]
}
