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
  </v-sheet>
</template>

<script>
import { avgHP, renderModifier, renderBonus, saveModifier } from './util';
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
          const bonus = saveModifier(
            this.monster.stats[k],
            this.monster.proficiency
          );
          return `${k} ${renderBonus(bonus)}`;
        } else {
          return '';
        }
      });

      return saves.filter((s) => s !== '').join(', ');
    },
  },
};
</script>
