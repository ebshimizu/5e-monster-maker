<template>
  <v-sheet width="100%" elevation="6" class="statblock pa-2" id="render">
    <h2 class="monster-name">{{ monster.name }}</h2>
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
      <v-col v-for="stat in stats" :key="stat.stat" class="stat-container pa-1">
        <div class="stat-name">{{ stat.stat }}</div>
        <div class="stat">
          <div class="score">{{ stat.score }}</div>
          <div class="modifier">({{ stat.modifier }})</div>
        </div>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <div class="skill" v-show="saves !== ''">
      <span class="name">Saving Throws</span> {{ saves }}
    </div>
    <div class="skill" v-show="monster.skills.length > 0">
      <span class="name">Skills</span> {{ skills }}
    </div>
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
    <div class="skill" v-show="monster.languages !== ''">
      <span class="name">Languages</span> {{ monster.languages }}
    </div>
    <div class="skill"><span class="name">Challenge</span> {{ cr }}</div>
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
      {{ spellStats() }}.
      {{ monster.spellcasting.atWillNotes }}
      It can cast the following spells, requiring no material components:
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
    <h3 class="section">Actions</h3>
    <div class="multiattack" v-if="monster.multiattacks.length > 0">
      <span class="name">Multiattack.</span>
      {{ renderMultiattacks() }}
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
      <h3 class="section">Legendary Actions</h3>
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
      <h3 class="section">Reactions</h3>
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
  processTokens,
  renderSaves,
  renderSkills,
  renderSenses,
  renderTraitLimitedUse,
  renderMultiattacks,
  rechargeOrLimited,
  duplicateLegendary,
  formatInnateSpellLabel,
  renderAttackReach,
  renderAttackDamage,
  renderAdditionalDamage,
} from './util';
import MOVEMENT from '../data/MOVEMENT';
import { STAT_FULL } from '../data/STAT';
import { CR } from '../data/CR';

import N2W from 'number-to-words';

export default {
  name: 'Render',
  computed: {
    monster: {
      get() {
        return this.$store.state.monster;
      },
    },
    cr() {
      return `${CR[this.monster.CR].cr} (${CR[
        this.monster.CR
      ].xp.toLocaleString('en-US')} XP)`;
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
      return renderSaves(this.$store);
    },
    skills() {
      return renderSkills(this.$store);
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
      return renderSenses(this.$store);
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
      return renderAttackReach(attack);
    },
    targets(t) {
      return `${N2W.toWords(t)} target${t !== 1 ? 's' : ''}`;
    },
    baseDamage(damage) {
      return renderAttackDamage(damage, this.$store);
    },
    additionalDamage(damage) {
      return renderAdditionalDamage(damage);
    },
    renderMultiattacks() {
      return renderMultiattacks(this.$store);
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
      return formatInnateSpellLabel(atWill);
    },
    spellsByLevel(level) {
      return this.monster.spellcasting.standard
        .filter((id) => {
          return this.allSpells[id].level === level;
        })
        .join(', ');
    },
    limitedUse(trait) {
      return renderTraitLimitedUse(trait);
    },
    rechargeOrLimited(action) {
      return rechargeOrLimited(action);
    },
    duplicateLegendary(action) {
      return duplicateLegendary(action, this.$store);
    },
    processTokens(text) {
      return processTokens(text, this.$store);
    },
  },
};
</script>

<style lang="scss" scoped>
.statblock {
  background-color: #fdf1dc;
  color: #000;
  font-family: ScalySans;
  font-size: 1rem;

  .monster-name {
    font-family: MrEaves;
    color: #58180d;
    font-weight: 800;
    font-size: 2.2em;
  }

  .type,
  .attack .distance,
  .attack .hit {
    font-family: ScalySansItalic;
  }

  hr {
    border: 1px solid #9c2b1b;
    margin: 2px 0;
  }

  .skill {
    line-height: 1.3rem;

    .name {
      font-family: ScalySansBold;
    }
  }

  .stat-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #58180d;

    .stat-name {
      font-family: ScalySansBold;
    }

    .stat {
      display: flex;
      font-size: 0.95rem;
      .score {
        margin-right: 4px;
      }
    }
  }

  .spell-list {
    margin-top: 0.8rem;

    .spell-row {
      margin-left: 20px;
      text-indent: -20px;

      .spell-list-entries {
        font-family: ScalySansItalic;
      }
    }
  }

  .trait,
  .attack,
  .action,
  .innate-spellcasting,
  .spellcasting,
  .legendary-actions .preamble,
  .multiattack {
    line-height: 1.15rem;
    margin-bottom: 0.8rem;

    .name {
      font-family: ScalySansBoldItalic;
    }
  }

  h3.section {
    font-size: 1.3rem;
    font-weight: 200;
    color: #58180d;
    border-bottom: 1px solid #58180d;
    margin-bottom: 4px;
  }
}
</style>
