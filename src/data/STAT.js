export const STAT = {
  STR: 'STR',
  DEX: 'DEX',
  CON: 'CON',
  INT: 'INT',
  WIS: 'WIS',
  CHA: 'CHA',
}

export const STAT_FULL = {
  [STAT.STR]: 'Strength',
  [STAT.DEX]: 'Dexterity',
  [STAT.CON]: 'Constitution',
  [STAT.INT]: 'Intelligence',
  [STAT.WIS]: 'Wisdom',
  [STAT.CHA]: 'Charisma',
}

export const STAT_SELECT = Object.values(STAT).sort();

export default STAT;