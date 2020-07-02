import DICE from '../data/DICE';
import DAMAGE_TYPE from '../data/DAMAGE_TYPE';
import { RANGE } from '../data/ATTACK';
import { v4 as uuidv4 } from 'uuid';

export function avgHP(HP) {
  return Math.floor(HP.HD * ((HP.type + 1) / 2) + HP.modifier);
}

export function avgRoll(count, dice) {
  if (dice === 1) return count;

  return Math.floor(count * ((dice + 1) / 2));
}

export function statModifier(score) {
  return Math.floor((score - 10) / 2);
}

export function renderModifier(score) {
  return renderBonus(statModifier(score));
}

export function isNumber(value) {
  return !isNaN(parseInt(value)) ? true : 'Not a Number';
}

export function saveModifier(score, proficiency) {
  return statModifier(score) + proficiency;
}

export function renderBonus(number, spaces = false) {
  return `${spaces ? ' ' : ''}${number >= 0 ? '+' : ''}${
    spaces ? ' ' : ''
  }${number}`;
}

export function newAttackAdditionalDamage() {
  return {
    id: uuidv4(),
    dice: DICE.d6,
    count: 1,
    type: DAMAGE_TYPE.FIRE,
    note: '',
  };
}

export function newAttack() {
  return {
    name: 'New Attack',
    id: uuidv4(),
    distance: RANGE.MELEE,
    kind: 'Weapon',
    modifier: {
      override: false,
      overrideValue: 0,
      stat: 'STR',
      proficient: true,
    },
    range: {
      standard: 0,
      long: 0,
      reach: 5,
    },
    targets: 1,
    damage: {
      dice: DICE.d8,
      count: 1,
      modifier: {
        override: false,
        overrideValue: 0,
        stat: 'STR',
      },
      type: DAMAGE_TYPE.SLASHING,
    },
    alternateDamage: {
      dice: DICE.d10,
      count: 1,
      modifier: {
        override: false,
        overrideValue: 0,
        stat: 'STR',
      },
      type: DAMAGE_TYPE.SLASHING,
      condition: '',
      active: false,
    },
    additionalDamage: [],
    save: 0,
    description: '',
  };
}
