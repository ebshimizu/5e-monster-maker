export function avgHP(HP) {
  return Math.floor(HP.HD * ((HP.type + 1) / 2) + HP.modifier)
}

export function statModifier(score) {
  return Math.floor((score - 10) / 2);
}

export function renderModifier(score) {
  const mod = statModifier(score);
  return `${mod >= 0 ? '+' : ''}${mod}`;
}

export function isNumber(value) {
  return !isNaN(parseInt(value)) ? true : "Not a Number"
}