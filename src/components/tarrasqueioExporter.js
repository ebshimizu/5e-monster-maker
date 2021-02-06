import { CR } from '../data/CR';
import { STAT_FULL } from '../data/STAT';
import N2W from 'number-to-words';
import {
  avgRoll,
  download,
  duplicateLegendary,
  formatInnateSpellLabel,
  processTokens,
  rechargeOrLimited,
  renderAdditionalDamage,
  renderAttackDamage,
  renderAttackReach,
  renderBonus,
  renderMultiattacks,
  renderSenses,
  renderTraitLimitedUse,
  statModifier,
} from './util';

const statMap = {
  STR: 'strength',
  DEX: 'dexterity',
  CON: 'constitution',
  INT: 'intelligence',
  WIS: 'wisdom',
  CHA: 'charisma',
};

export function saveTioJson(monster, filename, store) {
  download(
    JSON.stringify(format(monster, store), null, 2),
    filename,
    'application/json'
  );
}

// does not account for versatile
function attackDamageDice(attack) {
  const base = `${attack.damage.count}d${attack.damage.dice}`;

  const extra =
    attack.additionalDamage.length > 0
      ? `+${attack.additionalDamage
          .map((ad) => `${ad.count}d${ad.dice}`)
          .join('+')}`
      : '';

  return base + extra;
}

// Tarrasque.io also uses JSON so we'll corral the 5emm monster data into tarrasque's format
function format(monster, store) {
  const tio = {};

  // basics
  tio.name = monster.name;
  tio.size = monster.size;
  tio.type = monster.type;
  tio.subtype = ''; // 5emm doesn't have a subtype field
  tio.alignment = monster.alignment;
  tio.armor_class = monster.AC;
  tio.armor_type = monster.ACType;
  tio.hit_points =
    avgRoll(monster.HP.HD, monster.HP.type) + monster.HP.modifier;
  tio.hit_dice = `${monster.HP.HD}d${monster.HP.type}${renderBonus(
    monster.HP.modifier
  )}`;
  tio.speed = monster.speeds
    .map((s) => `${s.speed} ft. ${s.type}${s.note === '' ? '' : s.note}`)
    .join(', ');

  tio.speed_json = {};
  monster.speeds.forEach((s) => {
    tio.speed_json[s.type] = s.speed;
  });

  // stats
  for (const stat in monster.stats) {
    tio[statMap[stat]] = monster.stats[stat];

    // save, only add if proficient or overridden
    const save = monster.saves[stat];
    const key = `${statMap[stat]}_save`;

    if (save.override) {
      tio[key] = save.overrideValue;
    } else if (save.proficient) {
      tio[key] = store.getters.defaultSaveBonus(stat);
    }
  }

  // skills
  // convert to lower case and replace ' ' with '_' (idk if this is how it actually works)S
  for (const skill of monster.skills) {
    const key = skill.skill.key.toLowerCase().replace(' ', '_');

    if (skill.override) {
      tio[key] = skill.overrideValue;
    } else {
      tio[key] = store.getters.defaultSkillBonus(skill);
    }
  }

  // immunities, resistances, senses, languages
  tio.damage_vulnerabilities = monster.vulnerabilities.join(', ');
  tio.damage_resistances = monster.resistances.join(', ');
  tio.damage_immunities = monster.immunities.join(', ');
  tio.condition_immunities = monster.immunities.join(', ');
  tio.senses = renderSenses(store);

  tio.languages = monster.languages;
  tio.challenge_rating = CR[monster.CR].cr;

  // traits
  // tarrasque.io calls these special abilities
  tio.special_abilities = [];
  for (const trait of monster.traits) {
    // name includes uses
    const name = `${trait.name}${renderTraitLimitedUse(trait)}`;

    tio.special_abilities.push({
      name,
      desc: processTokens(trait.description, store),
      attack_bonus: trait.crAnnotation.maxModifier,
    });
  }

  // actions includes multiattack, regular attack, and extra actions
  tio.actions = [];

  // tarrasque io likes to have multiattack first looks like
  if (monster.multiattacks.length > 0) {
    tio.actions.push({
      name: 'Multiattack',
      desc: renderMultiattacks(store),
      attack_bonus: 0,
    });
  }

  // attacks next
  for (const attack of monster.attacks) {
    const toHit = renderBonus(store.getters.fullToHitBonus(attack.modifier));
    const damage = renderAttackDamage(attack.damage, store);
    const altDamage = attack.alternateDamage.active
      ? `, or ${renderAttackDamage(attack.alternateDamage, store)} ${
          attack.alternateDamage.type
        } damage ${attack.alternateDamage.condition}`
      : '';
    const plusDamage =
      attack.additionalDamage.length > 0
        ? ` plus ${renderAdditionalDamage(attack.additionalDamage)}`
        : '';

    tio.actions.push({
      name: attack.name,
      desc: `${attack.distance} ${
        attack.kind
      } Attack: ${toHit} to hit, ${renderAttackReach(attack)}, ${N2W.toWords(
        attack.targets
      )} target${attack.targets === 1 ? '' : 's'}. Hit: ${damage} ${
        attack.damage.type
      } damage${altDamage}${plusDamage}. ${processTokens(
        attack.description,
        store
      )}`,
      attack_bonus: store.getters.fullToHitBonus(attack.modifier),
      damage_dice: attackDamageDice(attack),
      damage_bonus: attack.damage.modifier.override
        ? damage.modifier.overrideValue
        : statModifier(monster.stats[attack.damage.modifier.stat]),
    });
  }

  // generic actions
  // I don't currently have a "damage dice" field for this so we're gonna leave it blank and hope it doesn't explode
  const regularActions = monster.actions.filter((a) => !a.legendaryOnly);

  for (const action of regularActions) {
    const name = `${action.name}${rechargeOrLimited(action)}`;
    tio.actions.push({
      name,
      desc: processTokens(action.description, store),
      attack_bonus: action.crAnnotation.maxModifier,
      // todo: damage dice?
    });
  }

  // legendary actions
  if (monster.legendaryActions.actions.length > 0) {
    tio.legendary_desc = `The ${monster.name} can take ${
      monster.legendaryActions.count
    } legendary action${
      monster.legendaryActions.count === 1 ? '' : 's'
    }, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature's turn. The ${
      monster.name
    } regains spent legendary actions at the start of its turn.`;

    const legendaryActions = monster.legendaryActions.actions.map((la) => {
      return {
        cost: la.cost,
        ...store.getters.attackOrActionFromId(la.actionId),
      };
    });

    tio.legendary_actions = [];
    for (const la of legendaryActions) {
      const cost = la.cost > 1 ? ` (Costs ${la.cost} Actions)` : '';
      const desc = la.legendaryOnly
        ? processTokens(la.description, store)
        : duplicateLegendary(la, store);

      tio.legendary_actions.push({
        name: la.name + cost,
        desc,
        attack_bonus: 0,
      });
    }
  }

  // spellcasting
  // this counts as a special ability
  // we're just gonna basically copy-pasta the markdown exporter for the description...
  let spellList = [];
  const spellcasting = monster.spellcasting;
  const allSpells = store.state.spells;
  if (spellcasting.standard.length > 0) {
    const renderedRows = [];
    const cantrips = spellcasting.standard.filter((id) => {
      return allSpells[id].level === 0;
    });

    if (cantrips.length > 0) {
      renderedRows.push(`Cantrips (at will): ${cantrips.join(', ')}  `);
      spellList = spellList.concat(cantrips.map((c) => c.toLowerCase()));
    }

    for (let i = 0; i < spellcasting.slots.length; i++) {
      if (spellcasting.slots[i] > 0) {
        const level = i + 1;
        const spells = spellcasting.standard.filter((id) => {
          return allSpells[id].level === level;
        });
        if (spells.length === 0) continue;

        spellList = spellList.concat(spells.map((s) => s.toLowerCase()));
        renderedRows.push(
          `${N2W.toOrdinal(level)} level (${
            spellcasting.slots[i]
          } slots): ${spells.join(', ')}  `
        );
      }
    }

    const renderedSpellcasting = `The ${monster.name} is a ${N2W.toOrdinal(
      spellcasting.level
    )}-level spellcaster. Its spellcasting ability is ${
      STAT_FULL[spellcasting.stat]
    } (spell save DC ${store.getters.spellSave}, ${renderBonus(
      store.getters.spellAttackModifier
    )} to hit with spell attacks). ${spellcasting.notes} The ${
      monster.name
    } has the following${
      spellcasting.class ? ` ${spellcasting.class}` : ''
    } spells prepared:\n• ${renderedRows.join('\n• ')}`;

    tio.special_abilities.push({
      name: 'Spellcasting',
      desc: renderedSpellcasting,
      attack_bonus: 0,
    });
  }

  // innate
  // more pasta
  if (spellcasting.atWill.length > 0) {
    const atWillRendered = spellcasting.atWill
      .map((s) => {
        // do a little sneaky sneak
        spellList = spellList.concat(s.spells.map((c) => c.toLowerCase()));
        return `${formatInnateSpellLabel(s)} ${s.spells.join(', ')}`;
      })
      .join('\n• ');

    tio.special_abilities.push({
      name: 'Innate Spellcasting',
      desc: `The ${monster.name}'s spellcasting ability is ${
        STAT_FULL[spellcasting.stat]
      } (spell save DC ${store.getters.spellSave}, ${renderBonus(
        store.getters.spellAttackModifier
      )} to hit with spell attacks). ${
        spellcasting.atWillNotes
      } It can cast the following spells, requiring no material components:\n• ${atWillRendered}`,
      attack_bonus: 0,
    });
  }

  if (spellList.length > 0) tio.spellList = spellList;

  tio.group = 'Custom (5e Monster Maker)';
  return tio;
}
