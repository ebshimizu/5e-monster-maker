import {
  processSharedTokens,
  renderBonus,
  download,
  renderTraitLimitedUse,
  listJoin,
  statModifier,
  rechargeOrLimited,
  renderSaves,
  renderSkills,
  renderSenses,
  renderMultiattacks,
  duplicateLegendary,
} from './util';

import { CR } from '../data/CR';
import { RANGE } from '../data/ATTACK';
import { STAT_FULL } from '../data/STAT';
import N2W from 'number-to-words';

export function saveToLatex(store, file, twoCol = false) {
  download(renderLatex(store, twoCol), file, 'text/latex');
}

// basically the same, just need to process dice rolls a little different
function processLatexTokens(text, store) {
  // some replacement fun times
  const dice = RegExp(/\{(\d+)d(\d+)[ ]*([+-][ ]*\d+)?\}/gi);
  text = text.replace(dice, (match, count, dice, modifier) => {
    const cleanModifier =
      modifier && modifier !== '' ? parseInt(modifier.replace(' ', '')) : 0;
    return `\\DndDice{${count}d${dice}${
      modifier ? renderBonus(cleanModifier) : ''
    }}`;
  });

  return processSharedTokens(text, store);
}

function renderLatexTrait(trait, store) {
  return `\\DndMonsterAction{${trait.name}${renderTraitLimitedUse(
    trait
  )}}\n  ${processLatexTokens(trait.description, store)}`;
}

function renderLatexAtWill(monster, store) {
  const spellcasting = monster.spellcasting;
  return `\\DndMonsterAction{Innate Spellcasting}
  The ${monster.name}'s innate spellcasting ability is ${
    STAT_FULL[spellcasting.stat]
  } (spell save DC ${store.getters.spellSave}, ${renderBonus(
    store.getters.spellAttackModifier
  )} to hit with spell attacks). ${spellcasting.atWillNotes}
  It can cast the following spells, requiring no material components:
  \\begin{DndMonsterSpells}
    ${spellcasting.atWill
      .map((s) => {
        return `\\DndInnateSpellLevel${
          s.count > 0 ? `[${s.count}]` : ''
        }{${s.spells.join(', ')}}`;
      })
      .join('\n    ')}
  \\end{DndMonsterSpells}
  `;
}

function renderLatexStandard(monster, store) {
  const spellcasting = monster.spellcasting;
  const allSpells = store.state.spells;

  const renderedRows = [];
  const cantrips = spellcasting.standard.filter((id) => {
    return allSpells[id].level === 0;
  });
  if (cantrips.length > 0)
    renderedRows.push(`\\DndMonsterSpellLevel{${cantrips.join(', ')}}`);

  for (let i = 0; i < spellcasting.slots.length; i++) {
    if (spellcasting.slots[i] > 0) {
      const level = i + 1;
      const spells = spellcasting.standard.filter((id) => {
        return allSpells[id].level === level;
      });
      if (spells.length === 0) continue;

      renderedRows.push(
        `\\DndMonsterSpellLevel[${level}][${
          spellcasting.slots[i]
        }]{${spells.join(', ')}}`
      );
    }
  }

  return `\\DndMonsterAction{Spellcasting}
  The ${monster.name} is a ${N2W.toOrdinal(
    spellcasting.level
  )}-level spellcaster.
  Its spellcasting ability is ${STAT_FULL[spellcasting.stat]} (spell save DC ${
    store.getters.spellSave
  }, ${renderBonus(
    store.getters.spellAttackModifier
  )} to hit with spell attacks). ${spellcasting.notes}
  The ${monster.name} has the following${
    monster.spellcasting.class ? ` ${monster.spellcasting.class}` : ''
  } spells prepared:
  \\begin{DndMonsterSpells}
    ${renderedRows.join('\n    ')}
  \\end{DndMonsterSpells}
  `;
}

function renderLatexAttacks(store) {
  const renderedAttacks = [];

  for (const attack of store.state.monster.attacks) {
    const showRange = attack.distance !== RANGE.MELEE;
    const showReach = attack.distance !== RANGE.RANGED;
    const distance =
      attack.distance === RANGE.BOTH ? 'both' : attack.distance.toLowerCase();
    const type = attack.kind.toLowerCase();
    const damageBonus = attack.damage.modifier.override
      ? attack.damage.modifier.overrideValue
      : statModifier(store.state.monster.stats[attack.damage.modifier.stat]);
    const altBonus = attack.alternateDamage.modifier.override
      ? attack.alternateDamage.modifier.overrideValue
      : statModifier(
          store.state.monster.stats[attack.alternateDamage.modifier.stat]
        );

    // library only has one plus damage field so we'll just kinda fill that out manually
    const additionalDamage = attack.additionalDamage.map((ad) => {
      return `\\DndDice{${ad.count}d${ad.dice}} ${ad.type}${ad.note}`;
    });

    renderedAttacks.push(`\\DndMonsterAttack[
      name=${attack.name},
      distance=${distance},
      type=${type},
      mod=${renderBonus(store.getters.fullToHitBonus(attack.modifier))},
      ${!showReach ? '%' : ''}reach=${attack.range.reach},
      ${!showRange ? '%' : ''}range=${attack.range.standard}/${
      attack.range.long
    },
      targets=${N2W.toWords(attack.targets)} target${
      attack.targets === 1 ? '' : 's'
    },
      dmg=\\DndDice{${attack.damage.count}d${attack.damage.dice}${renderBonus(
      damageBonus
    )}},
      dmg-type=${attack.damage.type},
      ${additionalDamage.length === 0 ? '%' : ''}plus-dmg={${listJoin(
      additionalDamage,
      ', '
    )}},
      ${!attack.alternateDamage.active ? '%' : ''}or-dmg=\\DndDice{${
      attack.alternateDamage.count
    }d${attack.alternateDamage.dice}${renderBonus(altBonus)}},
      ${!attack.alternateDamage.active ? '%' : ''}or-dmg-when={${
      attack.alternateDamage.condition
    }},
      extra={${processLatexTokens(attack.description, store)}}
    ]`);
  }

  return renderedAttacks.join('\n\n  ');
}

function renderLatexActions(store) {
  const actions = store.state.monster.actions.filter((a) => !a.legendaryOnly);

  return actions
    .map((a) => {
      return `\\DndMonsterAction{${a.name}${rechargeOrLimited(a)}}
    ${processLatexTokens(a.description, store)}
    `;
    })
    .join('\n  ');
}

function renderLatexLengendary(store) {
  const monster = store.state.monster;
  const preamble = `The ${monster.name} can take ${
    monster.legendaryActions.count
  } legendary action${
    monster.legendaryActions.count === 1 ? '' : 's'
  }, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature's turn. The ${
    monster.name
  } regains spent legendary actions at the start of its turn.`;

  const actions = monster.legendaryActions.actions.map((la) => {
    return {
      cost: la.cost,
      ...store.getters.attackOrActionFromId(la.actionId),
    };
  });

  const formattedActions = actions.map((a) => {
    const cost = a.cost > 1 ? ` Costs ${a.cost} Actions)` : '';

    const description = a.legendaryOnly
      ? processLatexTokens(a.description, store)
      : duplicateLegendary(a, store);

    return `\\DndMonsterLegendaryAction{${a.name}${cost}}{${description}}`;
  });

  return `\\DndMonsterSection{Legendary Actions}
  ${preamble}
  \\begin{DndMonsterLegendaryActions}
    ${formattedActions.join('\n  ')}
  \\end{DndMonsterLegendaryActions}`;
}

function renderLatexReactions(store) {
  const reactions = store.state.monster.reactions;

  const formattedReactions = reactions.map((r) => {
    return `\\DndMonsterAction{${r.name}}
    ${processLatexTokens(r.description, store)}`;
  });

  return `\\DndMonsterSection{Reactions}
    ${formattedReactions.join('\n  ')}
  `;
}

function renderLatexLairActions(store) {
  const lairActions = store.state.monster.lairActions;
  const name = store.state.monster.name;
  const preamble = `\\DndMonsterSection{Lair Actions}
    When fighting inside its lair, the ${name} can take lair actions. On initiative count 20 (losing initiative ties), the ${name} takes a lair action to cause one of the following effects:`;

  const formattedLairActions = lairActions.map((a) => {
    return `\\item ${processLatexTokens(a.description, store)}`;
  });

  return `${preamble}
    \\begin{itemize}
      ${formattedLairActions.join('\n')}
    \\end{itemize}`;
}

// exporter for the rpgtex template
// https://github.com/rpgtex/DND-5e-LaTeX-Template
export function renderLatex(store, twoCol = false) {
  const monster = store.state.monster;
  const saves = renderSaves(store);

  return `\\begin{DndMonster}[${twoCol ? 'width=\\textwidth + 8pt' : ''}]{${
    monster.name
  }}
  ${twoCol ? '\\begin{multicols}{2}' : ''}
  \\DndMonsterType{${monster.size} ${monster.type}, ${monster.alignment}}
  \\DndMonsterBasics[
    armor-class = {${monster.AC}${
    monster.ACType === '' ? '' : ` (${monster.ACType})`
  }},
    hit-points = {\\DndDice{${monster.HP.HD}d${monster.HP.type}${renderBonus(
    monster.HP.modifier
  )}}},
    speed = {${monster.speeds
      .map((s) => `${s.speed} ft. ${s.type} ${s.note === '' ? '' : s.note}`)
      .join(', ')}}
  ]

  \\DndMonsterAbilityScores[
    str = ${monster.stats.STR},
    dex = ${monster.stats.DEX},
    con = ${monster.stats.CON},
    int = ${monster.stats.INT},
    wis = ${monster.stats.WIS},
    cha = ${monster.stats.CHA},
  ]

  \\DndMonsterDetails[
    ${saves === '' ? '%' : ''}saving-throws = {${saves}},
    ${monster.skills.length === 0 ? '%' : ''}skills = {${renderSkills(store)}},
    ${
      monster.vulnerabilities.length === 0 ? '%' : ''
    }damage-vulnerabilities = {${monster.vulnerabilities.join(', ')}},
    ${
      monster.resistances.length === 0 ? '%' : ''
    }damage-resistances = {${monster.resistances.join(', ')}},
    ${
      monster.immunities.length === 0 ? '%' : ''
    }damage-immunities = {${monster.immunities.join(', ')}},
    ${
      monster.conditions.length === 0 ? '%' : ''
    }condition-immunities = {${monster.conditions.join(', ')}},
    senses = {${renderSenses(store)}},
    languages = {${monster.languages}},
    challenge = {${CR[monster.CR].cr}},
  ]

  % Traits
  ${monster.traits
    .map((t) => {
      return renderLatexTrait(t, store);
    })
    .join('\n')}

  % Spellcasting
  ${
    monster.spellcasting.atWill.length > 0
      ? renderLatexAtWill(monster, store)
      : ''
  }

  ${
    monster.spellcasting.standard.length > 0
      ? renderLatexStandard(monster, store)
      : ''
  }

  % Actions
  \\DndMonsterSection{Actions}
  ${
    monster.multiattacks.length > 0
      ? `\\DndMonsterAction{Multiattack}\n  ${renderMultiattacks(store)}`
      : ''
  }

  ${renderLatexAttacks(store)}

  ${renderLatexActions(store)}

  ${monster.legendaryActions.count > 0 ? renderLatexLengendary(store) : ''}

  ${monster.reactions.length > 0 ? renderLatexReactions(store) : ''}

  ${monster.lairActions.length > 0 ? renderLatexLairActions(store) : ''}

  ${twoCol ? '\\end{multicols}' : ''}
\\end{DndMonster}`;
}
