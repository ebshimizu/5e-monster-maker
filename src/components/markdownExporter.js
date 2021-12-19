// this file is a mess
// the homebrew markdown format is rather sensitive to whitespace and newlines so uh, maybe don't
// automatically code format this file for your own sanity
import {
  avgRoll,
  renderBonus,
  renderModifier,
  renderSaves,
  renderSkills,
  renderSenses,
  renderTraitLimitedUse,
  processTokens,
  formatInnateSpellLabel,
  renderMultiattacks,
  renderAttackReach,
  renderAttackDamage,
  renderAdditionalDamage,
  rechargeOrLimited,
  duplicateLegendary
} from './util';
import { CR } from '../data/CR';
import N2W from 'number-to-words';
import { STAT_FULL } from '../data/STAT';

function renderMarkdownTrait(trait, store) {
  return `> ***${trait.name}${renderTraitLimitedUse(trait)}.*** ${processTokens(trait.description, store)}`;
}

function renderMarkdownInnate(store) {
  const monster = store.state.monster;
  const spellcasting = store.state.monster.spellcasting;

  return `> ***Innate Spellcasting.*** The ${monster.name}'s spellcasting ability is ${STAT_FULL[spellcasting.stat]} (spell save DC ${store.getters.spellSave}, ${renderBonus(store.getters.spellAttackModifier)} to hit with spell attacks). ${spellcasting.atWillNotes} It can cast the following spells, requiring no material components:
> 
${spellcasting.atWill.map((s) => { return `> ${formatInnateSpellLabel(s)} *${s.spells.join(', ')}*  `}).join('\n')}`;
}

function renderMarkdownSpellcasting(store) {
  const spellcasting = store.state.monster.spellcasting;
  const allSpells = store.state.spells;

  const renderedRows = [];
  const cantrips = spellcasting.standard.filter((id) => {
    return allSpells[id].level === 0;
  });

  if (cantrips.length > 0)
    renderedRows.push(`> Cantrips (at will): *${cantrips.join(', ')}*  `);

  for (let i = 0; i < spellcasting.slots.length; i++) {
    if (spellcasting.slots[i] > 0) {
      const level = i + 1;
      const spells = spellcasting.standard.filter((id) => {
        return allSpells[id].level === level;
      });
      if (spells.length === 0) continue;

      renderedRows.push(`> ${N2W.toOrdinal(level)} level (${spellcasting.slots[i]} slots): *${spells.join(', ')}*  `);
    }
  }

  return `> ***Spellcasting.*** The ${store.state.monster.name} is a ${N2W.toOrdinal(spellcasting.level)}-level spellcaster. Its spellcasting ability is ${STAT_FULL[spellcasting.stat]} (spell save DC ${store.getters.spellSave}, ${renderBonus(store.getters.spellAttackModifier)} to hit with spell attacks). ${spellcasting.notes} The ${store.state.monster.name} has the following${spellcasting.class ? ` ${spellcasting.class}` : ''} spells prepared:
>
${renderedRows.join('\n')}`;
}

function renderMarkdownAttacks(store) {
  const renderedAttacks = [];
  
  for (const attack of store.state.monster.attacks) {
    const toHit = renderBonus(store.getters.fullToHitBonus(attack.modifier));
    const damage = renderAttackDamage(attack.damage, store);
    const altDamage = attack.alternateDamage.active ? `, or ${renderAttackDamage(attack.alternateDamage, store)} ${attack.alternateDamage.type} damage ${attack.alternateDamage.condition}` : '';
    const plusDamage = attack.additionalDamage.length > 0 ? ` plus ${renderAdditionalDamage(attack.additionalDamage)}` : '';

    renderedAttacks.push(`> ***${attack.name}***. *${attack.distance} ${attack.kind} Attack:* ${toHit} to hit, ${renderAttackReach(attack)}, ${N2W.toWords(attack.targets)} target${attack.targets === 1 ? '' : 's'}. *Hit*: ${damage} ${attack.damage.type} damage${altDamage}${plusDamage}. ${processTokens(attack.description, store)}`);
  }

  return renderedAttacks.join('\n>\n');
}

function renderMarkdownActions(store) {
  const actions = store.state.monster.actions.filter((a) => !a.legendaryOnly);

  const renderedActions = actions.map(a => {
    const mdDesc = a.description.replace(/\n/g, '\n> ');
    return `> ***${a.name}${rechargeOrLimited(a)}.*** ${processTokens(mdDesc, store)}`;
  });
  return renderedActions.join('\n>\n');
}

function renderMarkdownLegendary(store) {
  const monster = store.state.monster;
  const preamble = `> ### Legendary Actions
> The ${monster.name} can take ${monster.legendaryActions.count} legendary action${monster.legendaryActions.count === 1 ? '' : 's'}, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature's turn. The ${monster.name} regains spent legendary actions at the start of its turn.`;

  const actions = monster.legendaryActions.actions.map((la) => {
    return {
      cost: la.cost,
      ...store.getters.attackOrActionFromId(la.actionId),
    };
  });

  const formattedActions = actions.map((a) => {
    const cost = a.cost > 1 ? ` (Costs ${a.cost} Actions)` : '';

    const description = a.legendaryOnly
      ? processTokens(a.description, store)
      : duplicateLegendary(a, store);

    return `> ***${a.name}${cost}.*** ${description}`;
  });

  return `${preamble}
>
${formattedActions.join('\n>\n')}`;
}

function renderMythicTrait(store) {
  return `> ***${store.state.monster.mythicActions.triggerName} (${store.state.monster.mythicActions.triggerRecharge}).*** ${processTokens(store.state.monster.mythicActions.triggerDescription, store)}`;
}

function renderMarkdownMythic(store) {
  const monster = store.state.monster;
  const preamble = `> ### Mythic Actions
> ${monster.mythicActions.preamble}`;

  const actions = monster.mythicActions.actions.map((la) => {
    return {
      cost: la.cost,
      ...store.getters.attackOrActionFromId(la.actionId),
    };
  });

  const formattedActions = actions.map((a) => {
    const cost = a.cost > 1 ? ` (Costs ${a.cost} Actions)` : '';

    const description = a.legendaryOnly
      ? processTokens(a.description, store)
      : duplicateLegendary(a, store);

    return `> ***${a.name}${cost}.*** ${description}`;
  });

  return `${preamble}
>
${formattedActions.join('\n>\n')}`;
}

function renderMarkdownReactions(store) {
  const reactions = store.state.monster.reactions;

  const formattedReactions = reactions.map((r) => {
    return `> ***${r.name}.*** ${processTokens(r.description, store)}`;
  });

  return `> ### Reactions\n${formattedReactions.join('\n>\n')}`;
}

function renderMarkdownLairActions(store) {
  const lairActions = store.state.monster.lairActions;
  const name = store.state.monster.name;
  const preamble = `> ### Lair Actions
> When fighting inside its lair, the ${name} can take lair actions. On initiative count 20 (losing initiative ties), the ${name} takes a lair action to cause one of the following effects:`;

  const formattedLair = lairActions.map((r) => {
    return `> - ${processTokens(r.description, store)}`
  });

  return `${preamble}\n${formattedLair.join('\n')}`
}

function renderMarkdownRegionalEffects(store) {
  const effects = store.state.monster.regionalEffects;
  const preamble = `> ### Regional Effects
> ${processTokens(store.state.monster.regionalEffectDescription, store)}`

  const formattedEffects = effects.map((e) => {
    return `> - ${processTokens(e.description, store)}`
  })

  return `${preamble}\n${formattedEffects.join('\n')}`
}

// formatted for the Homebrewery system
// https://homebrewery.naturalcrit.com/
export function renderMarkdown(store, twoCol = false) {
  const monster = store.state.monster;
  const s = {};
  for (const stat in monster.stats) {
    s[stat] = {
      score: monster.stats[stat],
      bonus: renderModifier(monster.stats[stat])
    }
  }
  // odd check, but who knows
  const hasNonLegendaryActions = store.state.monster.actions.filter((a) => !a.legendaryOnly).length > 0;

  const saves = `\n> - **Saving Throws** ${renderSaves(store)}`;
  const skills = monster.skills.length === 0 ? '' : `\n> - **Skills** ${renderSkills(store)}`
  const vuln = monster.vulnerabilities.length === 0 ? '' : `\n> - **Damage Vulnerabilities** ${monster.vulnerabilities.join(', ')}`;
  const resist = monster.resistances.length === 0 ? '' : `\n> - **Damage Resistances** ${monster.resistances.join(', ')}`;
  const immune = monster.immunities.length === 0 ? '' : `\n> - **Damage Immunities** ${monster.immunities.join(', ')}`;
  const condition = monster.conditions.length === 0 ? '' : `\n> - **Condition Immunities** ${monster.conditions.join(', ')}`;
  const traits = monster.traits.length === 0 ? '' : `${monster.traits.map(t => renderMarkdownTrait(t, store)).join('\n>\n')}\n>\n`;
  const mythicTrait = monster.mythicActions.actions.length === 0 ? '' : `${renderMythicTrait(store)}\n>\n`
  const spellcasting = renderMarkdownSpellcasting(store);
  const innate = renderMarkdownInnate(store);
  const multi = monster.multiattacks.length === 0 ? '' : `\n> ***Multiattack.*** ${renderMultiattacks(store)}\n>`;
  const attacks = monster.attacks.lenght === 0 ? '' : `\n${renderMarkdownAttacks(store)}\n>`;
  const actions = !hasNonLegendaryActions ? '' : `\n${renderMarkdownActions(store)}\n>`;
  const legendary = monster.legendaryActions.actions.length === 0 ? '' : `\n${renderMarkdownLegendary(store)}\n>`;
  const mythic = monster.mythicActions.actions.length === 0 ? '' : `\n${renderMarkdownMythic(store)}\n>`;
  const reactions = monster.reactions.length === 0 ? '' : `\n${renderMarkdownReactions(store)}\n>`;
  const lair = monster.lairActions.length === 0 ? '' : `\n${renderMarkdownLairActions(store)}\n`
  const regional = monster.regionalEffects.length === 0 ? '' : `\n${renderMarkdownRegionalEffects(store)}`

  return `___${twoCol ? '___' : ''}
> ## ${monster.name}
>*${monster.size} ${monster.type}, ${monster.alignment}*
> ___
> - **Armor Class** ${monster.AC} ${monster.ACType === '' ? '' : `(${monster.ACType})`}
> - **Hit Points** ${avgRoll(monster.HP.HD, monster.HP.type) + monster.HP.modifier} (${monster.HP.HD}d${monster.HP.type}${renderBonus(monster.HP.modifier)})
> - **Speed** ${monster.speeds.map((s) => `${s.speed} ft. ${s.type}${s.note === '' ? '' : s.note}`).join(', ')}
>___
>|STR|DEX|CON|INT|WIS|CHA|
>|:---:|:---:|:---:|:---:|:---:|:---:|
>|${s.STR.score} (${s.STR.bonus})|${s.DEX.score} (${s.DEX.bonus})|${s.CON.score} (${s.CON.bonus})|${s.INT.score} (${s.INT.bonus})|${s.WIS.score} (${s.WIS.bonus})|${s.CHA.score} (${s.CHA.bonus})|
>___${saves !== '' ? saves : ''}${skills}${vuln}${resist}${immune}${condition}
> - **Senses** ${renderSenses(store)}
> - **Languages** ${monster.languages}
> - **Challenge** ${CR[monster.CR].cr} (${CR[monster.CR].xp.toLocaleString()})
>___
${traits}${mythicTrait}${monster.spellcasting.standard.length === 0 ? '' : `${spellcasting}\n>\n`}${monster.spellcasting.atWill.length === 0 ? '' : `${innate}\n>\n`}>
> ### Actions${multi}${attacks}${actions}${legendary}${mythic}${reactions}${lair}${regional}`;
}