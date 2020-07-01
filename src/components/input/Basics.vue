<template>
  <v-expansion-panel>
    <v-expansion-panel-header>Basics</v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-text-field label="Name" v-model="name"></v-text-field>
      <v-row align="center" no-gutters>
        <v-col cols="2" class="pr-2"><v-select label="Size"></v-select></v-col>
        <v-col cols="6" class="pr-2"><v-text-field label="Type" v-model="type"></v-text-field></v-col>
        <v-col cols="4"><v-text-field label="Alignment" v-model="alignment"></v-text-field></v-col>
      </v-row>
      <v-row align="center" no-gutters>
        <v-col cols="1" class="pr-2"><v-text-field label="AC" v-model="AC" :rules="[rules.number]"></v-text-field></v-col>
        <v-col cols="2" class="pr-2"><v-text-field label="AC Type" v-model="ACType" hint="Natural Armor, etc."></v-text-field></v-col>
        <v-col cols="2" class="pr-2"><v-text-field label="HD Count" v-model="HD" hint="Number of Dice" :rules="[rules.number]"></v-text-field></v-col>
        <v-col cols="2" class="pr-2"><v-select label="HD Type" :items="diceItems" v-model="HDType"></v-select></v-col>
        <v-col cols="2"><v-text-field label="HP Modifier" v-model="HPModifier"></v-text-field></v-col>
        <v-spacer></v-spacer>
        <v-col cols="2"><v-btn block color="secondary">HP Tools</v-btn></v-col>
      </v-row>
      <v-row align="center" no-gutters>
        <v-col cols="2" class="pr-2"><v-text-field label="STR" v-model="STR" hint="Strength Score" :rules="[rules.number]"></v-text-field></v-col>
        <v-col cols="2" class="pr-2"><v-text-field label="DEX" v-model="DEX" hint="Dexterity Score" :rules="[rules.number]"></v-text-field></v-col>
        <v-col cols="2" class="pr-2"><v-text-field label="CON" v-model="CON" hint="Constitution Score" :rules="[rules.number]"></v-text-field></v-col>
        <v-col cols="2" class="pr-2"><v-text-field label="INT" v-model="INT" hint="Intelligence Score" :rules="[rules.number]"></v-text-field></v-col>
        <v-col cols="2" class="pr-2"><v-text-field label="WIS" v-model="WIS" hint="Wisdom Score" :rules="[rules.number]"></v-text-field></v-col>
        <v-col cols="2"><v-text-field label="CHA" v-model="CHA" hint="Charisma Score" :rules="[rules.number]"></v-text-field></v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { MUTATION } from '../../data/ACTIONS'
import { DICE_SELECT } from '../../data/DICE'
import { isNumber } from '../util'

export default {
  name: 'Basics',
  data () {
    return {
      rules: {
        number: isNumber
      },
      diceItems: DICE_SELECT
    }
  },
  computed: {
    name: {
      get() {
        return this.$store.state.monster.name;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SIMPLE_PROP, { key: 'name', value } );
      }
    },
    type: {
      get() {
        return this.$store.state.monster.type;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SIMPLE_PROP, { key: 'type', value });
      }
    },
    alignment: {
      get() { return this.$store.state.monster.alignment },
      set(value) { this.$store.commit(MUTATION.SET_SIMPLE_PROP, { key: 'alignment', value }) }
    },
    AC: {
      get() { return this.$store.state.monster.AC },
      set(value) { this.$store.commit(MUTATION.SET_SIMPLE_PROP, { key: 'AC', value }) }
    },
    ACType: {
      get() { return this.$store.state.monster.ACType },
      set(value) { this.$store.commit(MUTATION.SET_SIMPLE_PROP, { key: 'ACType', value }) }
    },
    HD: {
      get() { return this.$store.state.monster.HP.HD },
      set(value) { this.$store.commit(MUTATION.SET_HP_PROP, { key: 'HD', value }) }
    },
    HDType: {
      get() { return this.$store.state.monster.HP.type },
      set(value) { this.$store.commit(MUTATION.SET_HP_PROP, { key: 'type', value }) }
    },
    HPModifier: {
      get() { return this.$store.state.monster.HP.modifier },
      set(value) { this.$store.commit(MUTATION.SET_HP_PROP, { key: 'modifier', value }) }
    },
    STR: {
      get() { return this.$store.state.monster.stats.STR },
      set(value) { this.$store.commit(MUTATION.SET_STAT, { key: 'STR', value }) }
    },
    DEX: {
      get() { return this.$store.state.monster.stats.DEX },
      set(value) { this.$store.commit(MUTATION.SET_STAT, { key: 'DEX', value }) }
    },
    CON: {
      get() { return this.$store.state.monster.stats.CON },
      set(value) { this.$store.commit(MUTATION.SET_STAT, { key: 'CON', value }) }
    },
    INT: {
      get() { return this.$store.state.monster.stats.INT },
      set(value) { this.$store.commit(MUTATION.SET_STAT, { key: 'INT', value }) }
    },
    WIS: {
      get() { return this.$store.state.monster.stats.WIS },
      set(value) { this.$store.commit(MUTATION.SET_STAT, { key: 'WIS', value }) }
    },
    CHA: {
      get() { return this.$store.state.monster.stats.CHA },
      set(value) { this.$store.commit(MUTATION.SET_STAT, { key: 'CHA', value }) }
    }
  }
};
</script>
