<template>
  <v-expansion-panel>
    <v-expansion-panel-header>Damage Type Adjustments</v-expansion-panel-header>
    <v-expansion-panel-content class="mt-2">
      <v-row align="center">
        <v-col cols="12">
          <v-select
            :items="damageTypes"
            v-model="resistances"
            label="Resistances"
            multiple
            chips
            clearable
            deletable-chips
            hide-selected
            :menu-props="menuOptions"
          >
          </v-select>
        </v-col>
        <v-col cols="12">
          <v-select
            :items="damageTypes"
            v-model="immunities"
            label="Immunities"
            multiple
            chips
            clearable
            deletable-chips
            hide-selected
            :menu-props="menuOptions"
          >
          </v-select>
        </v-col>
        <v-col cols="12">
          <v-select
            :items="damageTypes"
            v-model="vulnerabilities"
            label="Vulnerabilities"
            multiple
            chips
            clearable
            deletable-chips
            hide-selected
            :menu-props="menuOptions"
          >
          </v-select>
        </v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { DAMAGE_TYPE_SELECT } from '../../data/DAMAGE_TYPE';
import { MUTATION } from '../../data/ACTIONS';

export default {
  name: 'DamageTypes',
  data() {
    return {
      damageTypes: DAMAGE_TYPE_SELECT,
      menuOptions: {
        closeOnClick: false,
        closeOnContentClick: false,
        disableKeys: true,
        openOnClick: false,
        maxHeight: 304,
        'offset-y': true,
      },
    };
  },
  computed: {
    resistances: {
      get() {
        return this.$store.state.monster.resistances;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SIMPLE_PROP, {
          key: 'resistances',
          value,
        });
      },
    },
    immunities: {
      get() {
        return this.$store.state.monster.immunities;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SIMPLE_PROP, {
          key: 'immunities',
          value,
        });
      },
    },
    vulnerabilities: {
      get() {
        return this.$store.state.monster.vulnerabilities;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SIMPLE_PROP, {
          key: 'vulnerabilities',
          value,
        });
      },
    },
  },
};
</script>
