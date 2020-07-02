import DICE from "../data/DICE";
import DAMAGE_TYPE from "../data/DAMAGE_TYPE";
import { v4 as uuidv4 } from 'uuid';

export function avgHP(HP) {
  return Math.floor(HP.HD * ((HP.type + 1) / 2) + HP.modifier)
}

export function avgRoll(count, dice) {
  if (dice === 1)
    return count;

  return Math.floor(count * ((dice + 1) / 2))
}

export function statModifier(score) {
  return Math.floor((score - 10) / 2);
}

export function renderModifier(score) {
  return renderBonus(statModifier(score));
}

export function isNumber(value) {
  return !isNaN(parseInt(value)) ? true : "Not a Number"
}

export function saveModifier(score, proficiency) {
  return statModifier(score) + proficiency;
}

export function renderBonus(number, spaces = false) {
  return `${spaces ? ' ' : ''}${number >= 0 ? '+' : ''}${spaces ? ' ' : ''}${number}`
}

export function newAttackAdditionalDamage() {
  return {
    id: uuidv4(),
    dice: DICE.d6,
    count: 1,
    type: DAMAGE_TYPE.FIRE,
    note: ''
  }
}