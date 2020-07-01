export const DICE = {
  d4: 4,
  d6: 6,
  d8: 8,
  d10: 10,
  d12: 12,
  d20: 20
};

export const DICE_SELECT = Object.keys(DICE).map(k => { return { text: k, value: DICE[k] } });

export default DICE