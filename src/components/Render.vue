<template>
  <v-sheet width="100%" elevation="6" color="gray darken-2" class="pa-2">
    <h2>{{ monster.name }}</h2>
    <div class="type">
      {{ monster.size }} {{ monster.type }}, {{ monster.alignment }}
    </div>
    <v-divider></v-divider>
    <div class="skill">
      <span class="name">Armor Class</span> {{ monster.AC
      }}{{ monster.ACType === '' ? '' : ` (${monster.ACType})` }}
    </div>
    <div class="skill"><span class="name">Hit Points</span> {{ hp }}</div>
    <div class="skill"><span class="name">Speed</span> {{ speed }}</div>
    <v-divider></v-divider>
    <v-row>
      <v-col v-for="stat in stats" :key="stat.stat">
        <div class="stat-name">{{ stat.stat }}</div>
        <div class="stat">
          <div class="score">{{ stat.score }}</div>
          <div class="modifier">({{ stat.modifier }})</div>
        </div>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <div class="skill"><span class="name">Saving Throws</span> {{ saves }}</div>
    <div class="skill"><span class="name">Skills</span> {{ skills }}</div>
    <div class="skill" v-show="this.monster.resistances.length > 0">
      <span class="name">Damage Resistances</span> {{ resistances }}
    </div>
    <div class="skill" v-show="this.monster.immunities.length > 0">
      <span class="name">Damage Immunities</span> {{ immunities }}
    </div>
    <div class="skill" v-show="this.monster.vulnerabilities.length > 0">
      <span class="name">Damage Vulnerabilities</span> {{ vulnerabilities }}
    </div>
    <div class="skill" v-show="this.monster.conditions.length > 0">
      <span class="name">Condition Immunities</span> {{ conditions }}
    </div>
    <div class="skill"><span class="name">Senses</span> {{ senses }}</div>
    <div class="skill">
      <span class="name">Languages</span> {{ monster.languages }}
    </div>
    <v-divider></v-divider>
    <div class="traits">
      <div class="trait" v-for="trait in monster.traits" :key="trait.id">
        <span class="name">{{ trait.name }}{{ limitedUse(trait) }}.</span>
        {{ processTokens(trait.description) }}
      </div>
    </div>
    <div
      v-if="monster.spellcasting.atWill.length > 0"
      class="innate-spellcasting"
    >
      <span class="name">Innate Spellcasting.</span> The {{ monster.name }}'s
      innate spellcasting ability is {{ statFull(monster.spellcasting.stat) }}
      {{ spellStats() }}
      {{ monster.spellcasting.atWillNotes }}
      It can innately cast the following spells, requiring no material
      components:
      <div class="spell-list">
        <div
          class="spell-row"
          v-for="innate in monster.spellcasting.atWill"
          :key="innate.id"
        >
          <span class="spell-label">{{ formatInnateSpellLabel(innate) }} </span>
          <span class="spell-list-entries">{{ innate.spells.join(', ') }}</span>
        </div>
      </div>
    </div>
    <div v-if="monster.spellcasting.standard.length > 0" class="spellcasting">
      <span class="name">Spellcasting.</span> The {{ monster.name }} is a
      {{ casterLevel }} spellcaster. Its spellcasting ability is
      {{ statFull(monster.spellcasting.stat) }} {{ spellStats() }}.
      {{ monster.spellcasting.notes }}
      The {{ monster.name }} has the following{{
        monster.spellcasting.class ? ` ${monster.spellcasting.class}` : ''
      }}
      spells prepared:
      <div class="spell-list">
        <div class="spell-row" v-if="cantrips.length > 0">
          <span class="spell-label">Cantrips (at will): </span>
          <span class="spell-list-entries">{{ cantrips }}</span>
        </div>
        <div v-if="monster.spellcasting.class === 'Warlock'">
          <div class="spell-row">
            <span class="spell-label">{{ warlockLabel }}: </span>
            <span class="spell-list-entries">{{
              monster.spellcasting.standard.join(', ')
            }}</span>
          </div>
        </div>
        <template v-else>
          <div class="spell-row" v-for="slot in spellsBySlot" :key="slot.level">
            <span class="spell-label">{{ slot.levelRender }} </span>
            <span class="spell-list-entries">{{ slot.spells }}</span>
          </div>
        </template>
      </div>
    </div>
    <h3 class="section mt-2">Actions</h3>
    <v-divider></v-divider>
    <div class="multiattack" v-if="monster.multiattacks.length > 0">
      <span class="name">Multiattack.</span>
      {{ renderMultiattacks(monster.multiattacks) }}
    </div>
    <div class="attack" v-for="attack in monster.attacks" :key="attack.id">
      <span class="name">{{ attack.name }}. </span>
      <span class="distance"
        >{{ attack.distance }} {{ attack.kind }} Attack:
      </span>
      <span class="to-hit">{{ toHit(attack.modifier) }}</span> to hit,
      <span
        ><span class="reach">{{ attackReach(attack) }}, </span>
        {{ targets(attack.targets) }}. <span class="hit">Hit: </span>
        {{ baseDamage(attack.damage) }} {{ attack.damage.type }} damage</span
      >
      <span v-if="attack.alternateDamage.active"
        >, or {{ baseDamage(attack.alternateDamage) }}
        {{ attack.alternateDamage.type }} damage
        {{ attack.alternateDamage.condition }}</span
      >
      <span v-if="attack.additionalDamage.length > 0">
        plus {{ additionalDamage(attack.additionalDamage) }}</span
      >.
      <span class="description">{{ processTokens(attack.description) }}</span>
    </div>
    <div class="other-actions">
      <div
        class="action"
        v-for="action in nonLegendaryOnlyActions"
        :key="action.id"
      >
        <span class="name"
          >{{ action.name }}{{ rechargeOrLimited(action) }}.</span
        >
        {{ processTokens(action.description) }}
      </div>
    </div>
    <div class="legendary-actions" v-if="monster.legendaryActions.count > 0">
      <h3 class="section mt-2">Legendary Actions</h3>
      <div class="preamble">
        The {{ monster.name }} can take
        {{ monster.legendaryActions.count }} legendary action{{
          monster.legendaryActions.count === 1 ? '' : 's'
        }}, choosing from the options below. Only one legendary action option
        can be used at a time and only at the end of another creature's turn.
        The {{ monster.name }} regains spent legendary actions at the start of
        its turn.
      </div>
      <div
        class="action"
        v-for="action in resolvedLegendaryActions"
        :key="action.id"
      >
        <span class="name"
          >{{ action.name
          }}{{
            action.cost > 1 ? ` (Costs ${action.cost} Actions)` : ''
          }}.</span
        >
        {{
          action.legendaryOnly
            ? processTokens(action.description)
            : duplicateLegendary(action)
        }}
      </div>
    </div>
    <div class="reactions" v-if="monster.reactions.length > 0">
      <h3 class="section mt-2">Reactions</h3>
      <div
        class="action"
        v-for="reaction in monster.reactions"
        :key="reaction.id"
      >
        <span class="name">{{ reaction.name }}. </span
        >{{ processTokens(reaction.description) }}
      </div>
    </div>
  </v-sheet>
</template>

<script>
import {
  avgHP,
  renderModifier,
  renderBonus,
  statModifier,
  avgRoll,
  listJoin,
} from './util';
import MOVEMENT from '../data/MOVEMENT';
import { RANGE } from '../data/ATTACK';
import STAT, { STAT_FULL } from '../data/STAT';

import N2W from 'number-to-words';
import { AT_WILL_DEFAULT_RATES } from '../data/SPELLS';

export default {
  name: 'Render',
  computed: {
    monster: {
      get() {
        return this.$store.state.monster;
      },
    },
    hp() {
      const estimated = avgHP(this.monster.HP);
      return `${estimated} (${this.monster.HP.HD}d${this.monster.HP.type}+${this.monster.HP.modifier})`;
    },
    stats() {
      return Object.keys(this.monster.stats).map((k) => {
        return {
          stat: k,
          score: this.monster.stats[k],
          modifier: renderModifier(this.monster.stats[k]),
        };
      });
    },
    speed() {
      const speeds = this.monster.speeds.map((s) => {
        const note = s.note === '' ? '' : ` (${s.note})`;
        const type = s.type === MOVEMENT.WALK ? '' : ` ${s.type}`;
        return `${s.speed} ft.${type}${note}`;
      });

      return speeds.join(', ');
    },
    saves() {
      const saves = Object.keys(this.monster.saves).map((k) => {
        const save = this.monster.saves[k];
        if (save.override) {
          return `${k} ${renderBonus(save.overrideValue)}`;
        } else if (save.proficient) {
          return `${k} ${renderBonus(this.$store.getters.defaultSaveBonus(k))}`;
        } else {
          return '';
        }
      });

      return saves.filter((s) => s !== '').join(', ');
    },
    skills() {
      const skills = this.monster.skills.map((s) => {
        if (s.override) {
          return `${s.skill.key} ${renderBonus(s.overrideValue)}`;
        } else {
          return `${s.skill.key} ${renderBonus(
            this.$store.getters.defaultSkillBonus(s)
          )}`;
        }
      });

      return skills.join(', ');
    },
    resistances() {
      return this.monster.resistances.join(', ');
    },
    immunities() {
      return this.monster.immunities.join(', ');
    },
    vulnerabilities() {
      return this.monster.vulnerabilities.join(', ');
    },
    conditions() {
      return this.monster.conditions.join(', ');
    },
    senses() {
      const nonZero = Object.keys(this.monster.senses)
        .map((k) => {
          return { name: k, value: this.monster.senses[k] };
        })
        .filter((s) => s.value > 0);

      nonZero.push({
        name: 'Passive Perception',
        value: this.monster.passivePerception.override
          ? this.monster.passivePerception.overrideValue
          : this.$store.getters.passivePerception,
      });

      return nonZero
        .map(
          (s) =>
            `${s.name} ${s.value} ${
              s.name !== 'Passive Perception' ? 'ft.' : ''
            }`
        )
        .join(', ');
    },
    casterLevel() {
      return `${N2W.toOrdinal(this.monster.spellcasting.level)}-level`;
    },
    allSpells() {
      return this.$store.state.spells.ALL;
    },
    cantrips() {
      return this.monster.spellcasting.standard
        .filter((id) => {
          return this.allSpells[id].level === 0;
        })
        .join(', ');
    },
    spellsBySlot() {
      const slots = this.monster.spellcasting.slots;
      const ret = [];
      for (const idx in slots) {
        if (slots[idx] > 0) {
          const spells = this.spellsByLevel(parseInt(idx) + 1);
          if (spells === '') continue;

          const level = parseInt(idx) + 1;

          ret.push({
            levelRender: `${N2W.toOrdinal(level)} level (${slots[idx]} slots):`,
            spells,
          });
        }
      }

      return ret;
    },
    warlockLabel() {
      // find the highest level slot and note the quantity
      const slots = this.monster.spellcasting.slots;
      for (let idx = 8; idx >= 0; idx--) {
        if (slots[idx] > 0) {
          return `${N2W.toOrdinal(1)}-${N2W.toOrdinal(idx + 1)} level (${
            slots[idx]
          } ${N2W.toOrdinal(idx + 1)} level slots)`;
        }
      }

      return '';
    },
    nonLegendaryOnlyActions() {
      return this.monster.actions.filter((a) => !a.legendaryOnly);
    },
    resolvedLegendaryActions() {
      return this.monster.legendaryActions.actions.map((la) => {
        return {
          cost: la.cost,
          ...this.$store.getters.attackOrActionFromId(la.actionId),
        };
      });
    },
  },
  methods: {
    toHit(attackModifier) {
      return renderBonus(this.$store.getters.fullToHitBonus(attackModifier));
    },
    attackReach(attack) {
      // bleh
      if (attack.distance === RANGE.RANGED) {
        return `range ${attack.range.standard}/${attack.range.long} ft.`;
      } else if (attack.distance === RANGE.BOTH) {
        return `reach ${attack.range.reach} ft. or range ${attack.range.standard}/${attack.range.long} ft.`;
      }

      return `reach ${attack.range.reach} ft.`;
    },
    targets(t) {
      return `${N2W.toWords(t)} target${t !== 1 ? 's' : ''}`;
    },
    baseDamage(damage) {
      const bonus = damage.modifier.override
        ? damage.modifier.overrideValue
        : statModifier(this.monster.stats[damage.modifier.stat]);
      const avg = avgRoll(damage.count, damage.dice);
      const rb = renderBonus(bonus, true);

      if (damage.dice === 1) {
        return avg + bonus;
      }

      return `${avg + bonus} (${damage.count}d${damage.dice}${
        bonus !== 0 ? rb : ''
      })`;
    },
    additionalDamage(damage) {
      const formatted = damage.map((d) => {
        const avg = avgRoll(d.count, d.dice);
        const dmgRender =
          d.dice === 1 ? `${avg}` : `${avg} (${d.count}d${d.dice})`;

        return `${dmgRender} ${d.type} damage${d.note ? ` ${d.note}` : ''}`;
      });

      if (formatted.length === 1) return formatted[0];
      else {
        let part1 = formatted.slice(0, formatted.length - 1).join(', ');
        return `${part1}, and ${formatted[formatted.length - 1]}`;
      }
    },
    renderMultiattacks() {
      const atkStrings = this.monster.multiattacks.map((ma) => {
        const collected = {};
        for (const attackId of ma.attacks) {
          if (!(attackId in collected)) collected[attackId] = 0;

          collected[attackId] += 1;
        }

        const collectedActions = {};
        for (const actionId of ma.actions) {
          if (!(actionId in collectedActions)) collectedActions[actionId] = 0;

          collectedActions[actionId] += 1;
        }

        // resolve ids and render names
        const formatted = Object.keys(collected).map((id) => {
          const name = this.$store.getters.attackFromId(id).name;
          return `${N2W.toWords(collected[id])} ${name} attack${
            collected[id] === 1 ? '' : 's'
          }`;
        });

        const actionFormatted = Object.keys(collectedActions).map((id) => {
          const name = this.$store.getters.actionFromId(id).name;
          return `the ${name} action ${N2W.toWords(collectedActions[id])} time${
            collectedActions[id] === 1 ? '' : 's'
          }`;
        });

        if (actionFormatted.length > 0) {
          return `uses ${listJoin(actionFormatted, ', ')}${
            formatted.length > 0
              ? ` followed by ${listJoin(formatted, ', ')}`
              : ''
          }`;
        } else {
          return `makes ${listJoin(formatted, ', ')}`;
        }
      });

      return `The ${this.monster.name} ${atkStrings.join(' or ')}.`;
    },
    statFull(stat) {
      return STAT_FULL[stat];
    },
    spellStats() {
      return `(spell save DC ${this.$store.getters.spellSave}, ${renderBonus(
        this.$store.getters.spellAttackModifier
      )} to hit with spell attacks)`;
    },
    formatInnateSpellLabel(atWill) {
      if (atWill.rate === AT_WILL_DEFAULT_RATES.AT_WILL) {
        return 'At will';
      } else {
        return `${atWill.count}/${atWill.rate}:`;
      }
    },
    spellsByLevel(level) {
      return this.monster.spellcasting.standard
        .filter((id) => {
          return this.allSpells[id].level === level;
        })
        .join(', ');
    },
    limitedUse(trait) {
      if (trait.limitedUse.count > 0) {
        return ` (${trait.limitedUse.count}/${trait.limitedUse.rate})`;
      }

      return '';
    },
    rechargeOrLimited(action) {
      if (action.recharge && action.recharge !== '') {
        return ` (Recharge ${action.recharge})`;
      } else if (action.limitedUse.count > 0) {
        return ` (${action.limitedUse.count}/${action.limitedUse.rate})`;
      }

      return '';
    },
    duplicateLegendary(action) {
      const isAttack = this.$store.getters.attackFromId(action.id);
      if (isAttack) {
        return `The ${this.monster.name} makes a ${action.name} attack.`;
      }

      return `The ${this.monster.name} uses the ${action.name} action.`;
    },
    processTokens(text) {
      // some replacement fun times
      const dice = RegExp(/\{(\d+)d(\d+)[ ]*([+-][ ]*\d+)?\}/gi);
      text = text.replace(dice, (match, count, dice, modifier) => {
        const cleanModifier =
          modifier && modifier !== '' ? parseInt(modifier.replace(' ', '')) : 0;
        const avg = avgRoll(parseInt(count), parseInt(dice)) + cleanModifier;
        return `${avg} (${count}d${dice}${
          modifier ? renderBonus(cleanModifier) : ''
        })`;
      });

      // saves
      const save = RegExp(/\{DC:(\w{3})\}/gi);
      text = text.replace(save, (match, stat) => {
        if (stat in STAT) {
          return `DC ${this.$store.getters.defaultSpellSave(stat)} ${
            STAT_FULL[stat]
          }`;
        } else return match;
      });

      // attack modifier
      const attack = RegExp(/\{A:(\w{3})\}/gi);
      text = text.replace(attack, (match, stat) => {
        if (stat in STAT) {
          return renderBonus(
            this.$store.getters.defaultSpellAttackModifier(stat)
          );
        } else return match;
      });

      return text;
    },
  },
};
</script>
