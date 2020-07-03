<template>
  <v-expansion-panel>
    <v-expansion-panel-header>Basics</v-expansion-panel-header>
    <v-expansion-panel-content class="mt-4">
      <v-row align="center">
        <v-col cols="12"
          ><v-text-field dense label="Name" v-model="name"></v-text-field
        ></v-col>
        <v-col cols="2"
          ><v-select
            dense
            label="Size"
            :items="sizeItems"
            v-model="size"
          ></v-select
        ></v-col>
        <v-col cols="6"
          ><v-combobox
            dense
            label="Type"
            :items="creatureItems"
            v-model="type"
          ></v-combobox
        ></v-col>
        <v-col cols="4"
          ><v-combobox
            dense
            label="Alignment"
            :items="alignmentItems"
            v-model="alignment"
          ></v-combobox
        ></v-col>
        <v-col cols="1"
          ><v-text-field
            dense
            label="AC"
            type="number"
            v-model="AC"
            :rules="[rules.number]"
          ></v-text-field
        ></v-col>
        <v-col cols="3"
          ><v-text-field
            dense
            label="AC Type"
            v-model="ACType"
            hint="Or AC Notes"
          ></v-text-field
        ></v-col>
        <v-col cols="2"
          ><v-text-field
            dense
            label="HD Count"
            type="number"
            v-model="HD"
            hint="Number of Dice"
            :rules="[rules.number]"
          ></v-text-field
        ></v-col>
        <v-col cols="2"
          ><v-select
            dense
            label="HD Type"
            :items="diceItems"
            v-model="HDType"
          ></v-select
        ></v-col>
        <v-col cols="2"
          ><v-text-field
            dense
            label="HP Modifier"
            type="number"
            v-model="HPModifier"
          ></v-text-field
        ></v-col>
        <v-spacer></v-spacer>
        <v-col cols="2"><v-btn block color="blue">HP Tools</v-btn></v-col>
        <v-col cols="2"
          ><v-text-field
            dense
            label="STR"
            type="number"
            v-model="STR"
            hint="Strength Score"
            :rules="[rules.number]"
          ></v-text-field
        ></v-col>
        <v-col cols="2"
          ><v-text-field
            dense
            label="DEX"
            type="number"
            v-model="DEX"
            hint="Dexterity Score"
            :rules="[rules.number]"
          ></v-text-field
        ></v-col>
        <v-col cols="2"
          ><v-text-field
            dense
            label="CON"
            type="number"
            v-model="CON"
            hint="Constitution Score"
            :rules="[rules.number]"
          ></v-text-field
        ></v-col>
        <v-col cols="2"
          ><v-text-field
            dense
            label="INT"
            type="number"
            v-model="INT"
            hint="Intelligence Score"
            :rules="[rules.number]"
          ></v-text-field
        ></v-col>
        <v-col cols="2"
          ><v-text-field
            dense
            label="WIS"
            type="number"
            v-model="WIS"
            hint="Wisdom Score"
            :rules="[rules.number]"
          ></v-text-field
        ></v-col>
        <v-col cols="2"
          ><v-text-field
            dense
            label="CHA"
            type="number"
            v-model="CHA"
            hint="Charisma Score"
            :rules="[rules.number]"
          ></v-text-field
        ></v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { MUTATION } from '../../data/ACTIONS';
import { DICE_SELECT } from '../../data/DICE';
import SIZE from '../../data/SIZE';
import TYPE from '../../data/TYPE';
import ALIGNMENT from '../../data/ALIGNMENT';
import { isNumber } from '../util';

export default {
  name: 'Basics',
  data() {
    return {
      rules: {
        number: isNumber,
      },
      diceItems: DICE_SELECT,
      sizeItems: SIZE,
      creatureItems: TYPE,
      alignmentItems: ALIGNMENT,
    };
  },
  computed: {
    name: {
      get() {
        return this.$store.state.monster.name;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SIMPLE_PROP, { key: 'name', value });
      },
    },
    type: {
      get() {
        return this.$store.state.monster.type;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SIMPLE_PROP, { key: 'type', value });
      },
    },
    size: {
      get() {
        return this.$store.state.monster.size;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SIMPLE_PROP, { key: 'size', value });
      },
    },
    alignment: {
      get() {
        return this.$store.state.monster.alignment;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SIMPLE_PROP, {
          key: 'alignment',
          value,
        });
      },
    },
    AC: {
      get() {
        return this.$store.state.monster.AC;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SIMPLE_PROP, {
          key: 'AC',
          value: parseInt(value),
        });
      },
    },
    ACType: {
      get() {
        return this.$store.state.monster.ACType;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SIMPLE_PROP, { key: 'ACType', value });
      },
    },
    HD: {
      get() {
        return this.$store.state.monster.HP.HD;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_HP_PROP, {
          key: 'HD',
          value: parseInt(value),
        });
      },
    },
    HDType: {
      get() {
        return this.$store.state.monster.HP.type;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_HP_PROP, { key: 'type', value });
      },
    },
    HPModifier: {
      get() {
        return this.$store.state.monster.HP.modifier;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_HP_PROP, {
          key: 'modifier',
          value: parseInt(value),
        });
      },
    },
    STR: {
      get() {
        return this.$store.state.monster.stats.STR;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_STAT, { key: 'STR', value });
      },
    },
    DEX: {
      get() {
        return this.$store.state.monster.stats.DEX;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_STAT, { key: 'DEX', value });
      },
    },
    CON: {
      get() {
        return this.$store.state.monster.stats.CON;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_STAT, { key: 'CON', value });
      },
    },
    INT: {
      get() {
        return this.$store.state.monster.stats.INT;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_STAT, { key: 'INT', value });
      },
    },
    WIS: {
      get() {
        return this.$store.state.monster.stats.WIS;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_STAT, { key: 'WIS', value });
      },
    },
    CHA: {
      get() {
        return this.$store.state.monster.stats.CHA;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_STAT, { key: 'CHA', value });
      },
    },
  },
};
</script>
