<template>
  <v-expansion-panel>
    <v-expansion-panel-header>Basics</v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-text-field label="Name" v-model="name"></v-text-field>
      <v-text-field label="Type" v-model="type"></v-text-field>
      <v-row align="center" no-gutters>
        <v-col cols="1" class="pr-2"><v-text-field label="AC"></v-text-field></v-col>
        <v-col cols="2" class="pr-2"><v-text-field label="HD Count"></v-text-field></v-col>
        <v-col cols="2" class="pr-2"><v-select label="HD Type"></v-select></v-col>
        <v-col cols="2" class="pr-2"><v-text-field label="HP Modifier"></v-text-field></v-col>
        <v-spacer></v-spacer>
        <v-col cols="3"><v-btn block color="secondary">HP Options</v-btn></v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { MUTATION } from '../../data/ACTIONS'

export default {
  name: 'Basics',
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
    }
  }
};
</script>
