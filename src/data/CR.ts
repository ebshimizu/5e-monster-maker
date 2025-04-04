const rawCR = [
  {
    cr: '0',
    proficiency: 2,
    ac: 13,
    hpMin: 1,
    hpMax: 6,
    attack: 3,
    dprMin: 0,
    dprMax: 1,
    saveDc: 13,
    numeric: 0,
    xp: 0,
  },
  {
    cr: '1/8',
    proficiency: 2,
    ac: 13,
    hpMin: 7,
    hpMax: 35,
    attack: 3,
    dprMin: 2,
    dprMax: 3,
    saveDc: 13,
    numeric: 0.125,
    xp: 25,
  },
  {
    cr: '1/4',
    proficiency: 2,
    ac: 13,
    hpMin: 36,
    hpMax: 49,
    attack: 3,
    dprMin: 4,
    dprMax: 5,
    saveDc: 13,
    numeric: 0.25,
    xp: 50,
  },
  {
    cr: '1/2',
    proficiency: 2,
    ac: 13,
    hpMin: 50,
    hpMax: 70,
    attack: 3,
    dprMin: 6,
    dprMax: 8,
    saveDc: 13,
    numeric: 0.5,
    xp: 100,
  },
  {
    cr: '1',
    proficiency: 2,
    ac: 13,
    hpMin: 71,
    hpMax: 85,
    attack: 3,
    dprMin: 9,
    dprMax: 14,
    saveDc: 13,
    numeric: 1,
    xp: 200,
  },
  {
    cr: '2',
    proficiency: 2,
    ac: 13,
    hpMin: 86,
    hpMax: 100,
    attack: 3,
    dprMin: 15,
    dprMax: 20,
    saveDc: 13,
    numeric: 2,
    xp: 450,
  },
  {
    cr: '3',
    proficiency: 2,
    ac: 13,
    hpMin: 101,
    hpMax: 115,
    attack: 4,
    dprMin: 21,
    dprMax: 26,
    saveDc: 13,
    numeric: 3,
    xp: 700,
  },
  {
    cr: '4',
    proficiency: 2,
    ac: 14,
    hpMin: 116,
    hpMax: 130,
    attack: 5,
    dprMin: 27,
    dprMax: 32,
    saveDc: 14,
    numeric: 4,
    xp: 1100,
  },
  {
    cr: '5',
    proficiency: 3,
    ac: 15,
    hpMin: 131,
    hpMax: 145,
    attack: 6,
    dprMin: 33,
    dprMax: 38,
    saveDc: 15,
    numeric: 5,
    xp: 1800,
  },
  {
    cr: '6',
    proficiency: 3,
    ac: 15,
    hpMin: 146,
    hpMax: 160,
    attack: 6,
    dprMin: 39,
    dprMax: 44,
    saveDc: 15,
    numeric: 6,
    xp: 2300,
  },
  {
    cr: '7',
    proficiency: 3,
    ac: 15,
    hpMin: 161,
    hpMax: 175,
    attack: 6,
    dprMin: 45,
    dprMax: 50,
    saveDc: 15,
    numeric: 7,
    xp: 2900,
  },
  {
    cr: '8',
    proficiency: 3,
    ac: 16,
    hpMin: 176,
    hpMax: 190,
    attack: 7,
    dprMin: 51,
    dprMax: 56,
    saveDc: 16,
    numeric: 8,
    xp: 3900,
  },
  {
    cr: '9',
    proficiency: 4,
    ac: 16,
    hpMin: 191,
    hpMax: 205,
    attack: 7,
    dprMin: 57,
    dprMax: 62,
    saveDc: 16,
    numeric: 9,
    xp: 5000,
  },
  {
    cr: '10',
    proficiency: 4,
    ac: 17,
    hpMin: 206,
    hpMax: 220,
    attack: 7,
    dprMin: 63,
    dprMax: 68,
    saveDc: 16,
    numeric: 10,
    xp: 5900,
  },
  {
    cr: '11',
    proficiency: 4,
    ac: 17,
    hpMin: 221,
    hpMax: 235,
    attack: 8,
    dprMin: 69,
    dprMax: 74,
    saveDc: 17,
    numeric: 11,
    xp: 7200,
  },
  {
    cr: '12',
    proficiency: 4,
    ac: 17,
    hpMin: 236,
    hpMax: 250,
    attack: 8,
    dprMin: 75,
    dprMax: 80,
    saveDc: 18,
    numeric: 12,
    xp: 8400,
  },
  {
    cr: '13',
    proficiency: 5,
    ac: 18,
    hpMin: 251,
    hpMax: 265,
    attack: 8,
    dprMin: 81,
    dprMax: 86,
    saveDc: 18,
    numeric: 13,
    xp: 10000,
  },
  {
    cr: '14',
    proficiency: 5,
    ac: 18,
    hpMin: 266,
    hpMax: 280,
    attack: 8,
    dprMin: 87,
    dprMax: 92,
    saveDc: 18,
    numeric: 14,
    xp: 11500,
  },
  {
    cr: '15',
    proficiency: 5,
    ac: 18,
    hpMin: 281,
    hpMax: 295,
    attack: 8,
    dprMin: 93,
    dprMax: 98,
    saveDc: 18,
    numeric: 15,
    xp: 13000,
  },
  {
    cr: '16',
    proficiency: 5,
    ac: 18,
    hpMin: 296,
    hpMax: 310,
    attack: 9,
    dprMin: 99,
    dprMax: 104,
    saveDc: 18,
    numeric: 16,
    xp: 15000,
  },
  {
    cr: '17',
    proficiency: 6,
    ac: 19,
    hpMin: 311,
    hpMax: 325,
    attack: 10,
    dprMin: 105,
    dprMax: 110,
    saveDc: 19,
    numeric: 17,
    xp: 18000,
  },
  {
    cr: '18',
    proficiency: 6,
    ac: 19,
    hpMin: 326,
    hpMax: 340,
    attack: 10,
    dprMin: 111,
    dprMax: 116,
    saveDc: 19,
    numeric: 18,
    xp: 20000,
  },
  {
    cr: '19',
    proficiency: 6,
    ac: 19,
    hpMin: 341,
    hpMax: 355,
    attack: 10,
    dprMin: 117,
    dprMax: 122,
    saveDc: 19,
    numeric: 19,
    xp: 22000,
  },
  {
    cr: '20',
    proficiency: 6,
    ac: 19,
    hpMin: 356,
    hpMax: 400,
    attack: 10,
    dprMin: 123,
    dprMax: 140,
    saveDc: 19,
    numeric: 20,
    xp: 25000,
  },
  {
    cr: '21',
    proficiency: 7,
    ac: 19,
    hpMin: 401,
    hpMax: 445,
    attack: 11,
    dprMin: 141,
    dprMax: 158,
    saveDc: 20,
    numeric: 21,
    xp: 33000,
  },
  {
    cr: '22',
    proficiency: 7,
    ac: 19,
    hpMin: 446,
    hpMax: 490,
    attack: 11,
    dprMin: 159,
    dprMax: 176,
    saveDc: 20,
    numeric: 22,
    xp: 41000,
  },
  {
    cr: '23',
    proficiency: 7,
    ac: 19,
    hpMin: 491,
    hpMax: 535,
    attack: 11,
    dprMin: 177,
    dprMax: 194,
    saveDc: 20,
    numeric: 23,
    xp: 50000,
  },
  {
    cr: '24',
    proficiency: 7,
    ac: 19,
    hpMin: 536,
    hpMax: 580,
    attack: 12,
    dprMin: 195,
    dprMax: 212,
    saveDc: 21,
    numeric: 24,
    xp: 62000,
  },
  {
    cr: '25',
    proficiency: 8,
    ac: 19,
    hpMin: 581,
    hpMax: 625,
    attack: 12,
    dprMin: 213,
    dprMax: 230,
    saveDc: 21,
    numeric: 25,
    xp: 75000,
  },
  {
    cr: '26',
    proficiency: 8,
    ac: 19,
    hpMin: 626,
    hpMax: 670,
    attack: 12,
    dprMin: 231,
    dprMax: 248,
    saveDc: 21,
    numeric: 26,
    xp: 90000,
  },
  {
    cr: '27',
    proficiency: 8,
    ac: 19,
    hpMin: 671,
    hpMax: 715,
    attack: 13,
    dprMin: 249,
    dprMax: 266,
    saveDc: 22,
    numeric: 27,
    xp: 105000,
  },
  {
    cr: '28',
    proficiency: 8,
    ac: 19,
    hpMin: 716,
    hpMax: 760,
    attack: 13,
    dprMin: 267,
    dprMax: 284,
    saveDc: 22,
    numeric: 28,
    xp: 120000,
  },
  {
    cr: '29',
    proficiency: 9,
    ac: 19,
    hpMin: 760,
    hpMax: 805,
    attack: 13,
    dprMin: 285,
    dprMax: 302,
    saveDc: 22,
    numeric: 29,
    xp: 135000,
  },
  {
    cr: '30',
    proficiency: 9,
    ac: 19,
    hpMin: 805,
    hpMax: 850,
    attack: 14,
    dprMin: 303,
    dprMax: 320,
    saveDc: 23,
    numeric: 30,
    xp: 155000,
  },
]

export const CR = rawCR.map((cr, index) => {
  return { index, ...cr }
})

export const CR_SELECT = CR.map((cr, idx) => {
  return { label: cr.cr, value: idx }
})

export const LAIR_CR_SELECT = [{ label: '-', value: -1 }, ...CR_SELECT]

// the cr retrieval functions are a disaster let's fix that
function getCrByRange(
  value: number,
  field: Exclude<keyof (typeof rawCR)[number], 'cr'>
) {
  // check if the value is between index.field and index + 1.field
  for (let i = 0; i < CR.length - 1; i++) {
    if (CR[i][field] <= value && value < CR[i + 1][field]) {
      return CR[i]
    }
  }

  // if it wasn't like in a range, then it can only be min or max so...
  if (value <= CR[0][field]) return CR[0]
  else return CR[CR.length - 1]
}

export function getCrByString(crString: string) {
  const maybeCr = CR.find((cr) => cr.cr === crString)

  return maybeCr
}

export function getCrByDamage(damage: number) {
  return getCrByRange(damage, 'dprMin')
}

export function getCrByDc(dc: number) {
  return getCrByRange(dc, 'saveDc')
}

export function getCrByAttack(attack: number) {
  return getCrByRange(attack, 'attack')
}

export function getCrByNumber(number: number) {
  return getCrByRange(number, 'numeric')
}

export function getCrByHp(hp: number) {
  return getCrByRange(hp, 'hpMin')
}

export function getCrByAc(ac: number) {
  return getCrByRange(ac, 'ac')
}
