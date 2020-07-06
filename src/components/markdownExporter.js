import {
  avgRoll,
  renderBonus,
  renderModifier,
  renderSaves,
  renderSkills,
  renderSenses,
  renderTraitLimitedUse,
  processTokens
} from './util';
import { CR } from '../data/CR';
import N2W from 'number-to-words';
import { STAT_FULL } from '../data/STAT';

function renderMarkdownTrait(trait, store) {
  return `> **${trait.name}${renderTraitLimitedUse(trait)}.** ${processTokens(trait.description, store)}`;
}

function renderMarkdownSpellcasting(store) {
  const spellcasting = store.state.monster.spellcasting;
  const allSpells = store.state.spells.ALL;

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

  return `> **Spellcasting.** The ${store.state.monster.name} is a ${N2W.toOrdinal(spellcasting.level)}-level spellcaster. Its spellcasting ability is ${STAT_FULL[spellcasting.stat]} (spell save DC ${store.getters.spellSave}, ${renderBonus(store.getters.spellAttackModifier)} to hit with spell attacks). ${spellcasting.notes} The ${store.state.monster.name} has the following${spellcasting.class ? ` ${spellcasting.class}` : ''} spells prepared:
>
${renderedRows.join('\n')}`;
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
  const saves = `\n> - **Saving Throws** ${renderSaves(store)}`;
  const skills = monster.skills.length === 0 ? '' : `\n> - **Skills** ${renderSkills(store)}`
  const vuln = monster.vulnerabilities.length === 0 ? '' : `\n> - **Damage Vulnerabilities** ${monster.vulnerabilities.join(', ')}`;
  const resist = monster.resistances.length === 0 ? '' : `\n> - **Damage Resistances** ${monster.resistances.join(', ')}`;
  const immune = monster.immunities.length === 0 ? '' : `\n> - **Damage Immunities** ${monster.immunities.join(', ')}`;
  const condition = monster.conditions.length === 0 ? '' : `\n> - **Condition Immunities** ${monster.conditions.join(', ')}`;
  const spellcasting = renderMarkdownSpellcasting(store);

  return `___${twoCol ? '___' : ''}
> ## ${monster.name}
>*${monster.size} ${monster.type}, ${monster.alignment}*
> ___
> - **Armor Class** ${monster.AC} ${monster.ACType === '' ? '' : `(${monster.ACType})`}
> - **Hit Points** ${avgRoll(monster.HP.HD, monster.HP.type)} (${monster.HP.HD}d${monster.HP.type}${renderBonus(monster.HP.modifier)})
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
${monster.traits.map(t => renderMarkdownTrait(t, store)).join('\n>\n')}${monster.spellcasting.standard.length === 0 ? '' : `\n>\n${spellcasting}`}
  `
}