export function avgHP(HP) {
  return Math.floor(HP.HD * ((HP.type + 1) / 2) + HP.modifier)
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

export function renderBonus(number) {
  return `${number >= 0 ? '+' : ''}${number}`
}