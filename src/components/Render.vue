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
  </v-sheet>
</template>

<script>
import { avgHP, renderModifier, renderBonus } from './util';
import MOVEMENT from '../data/MOVEMENT';

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
  },
};
</script>
