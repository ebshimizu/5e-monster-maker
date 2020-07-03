import ALL from './spells.json'

const all = Object.values(ALL);

const SPELLS_BY_LEVEL = {}
for (const level of Array(10).keys) {
  SPELLS_BY_LEVEL[level] = all.filter(s => s.level === level).map(s => s.name);
}

export default {
  ALL,
  SPELLS_BY_LEVEL
}