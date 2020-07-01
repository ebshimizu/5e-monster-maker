export const DAMAGE_TYPE = {
  ACID: 'acid',
  BLUDGEONING: 'bludgeoning',
  BLUDEGONING_NM: 'non-magical bludgeoning',
  BLUDGEONING_NM_NA: 'non-magical, non-adamintine bludgeoning',
  BLUDGEONING_NM_NS: 'non-magical, non-silvered bludgeoning',
  COLD: 'cold',
  TRAPS: 'traps',
  SPELLS: 'spells',
  FIRE: 'fire',
  FORCE: 'force',
  LIGHTNING: 'lightning',
  NECROTIC: 'necrotic',
  PIERCING: 'piercing',
  PIERCING_NM: 'non-magical piercing',
  PIERCING_NM_NA: 'non-magical, non-adamantine piercing',
  PIERCING_NM_NS: 'non-magical, non-silvered piercing',
  MAGIC_GOOD: 'magical weapons wielded by good creatures',
  MAGIC_EVIL: 'magical weapons wielded by evil creatures',
  MAGIC_NEUTRAL: 'magical weapons wielded by neutral creatures',
  MAGIC_LAWFUL: 'magical weapons wielded by lawful creatures',
  MAGIC_CHAOTIC: 'magical weapons wielded by chaotic creatures',
  POISON: 'poison',
  PSYCHIC: 'psychic',
  RADIANT: 'radiant',
  RANGED: 'ranged attacks',
  MELEE: 'melee attacks',
  SLASHING: 'slashing',
  SLASHING_NM: 'non-magical slashing',
  SLASHING_NM_NA: 'non-magical, non-adamantine slashing',
  SLASHING_NM_SN: 'non-magical, non-silvered slashing',
  THUNDER: 'thunder',
  ALL_PHYSICAL_NM: 'non-magical slashing, piercing, and bludgeoning'
};

export const DAMAGE_TYPE_SELECT = Object.values(DAMAGE_TYPE).sort();

export default DAMAGE_TYPE;
