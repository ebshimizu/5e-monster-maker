import ALL from './spells.json';

const ALL_ARRAY = Object.values(ALL);

const SPELLS_BY_LEVEL = {};
for (const level of Array(10).keys()) {
  SPELLS_BY_LEVEL[level] = ALL_ARRAY.filter((s) => s.level === level).map(
    (s) => s.name
  );
}

// add some fields for the autocomplete element
for (const idx in ALL_ARRAY) {
  ALL_ARRAY[idx].text = ALL_ARRAY[idx].name;
  ALL_ARRAY[idx].value = ALL_ARRAY[idx].name;
}

export const AT_WILL_DEFAULT_RATES = {
  DAY: 'day',
  DAY_EACH: 'day each',
  AT_WILL: 'at will',
};

export default {
  ALL,
  ALL_ARRAY,
  SPELLS_BY_LEVEL,
};
