<template>
  <v-expansion-panel>
    <v-expansion-panel-header>CR</v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row align="center">
        <v-col cols="2"><v-text-field label="Expected CR"></v-text-field></v-col>
        <v-col cols="4" class="pr-2"><v-text-field label="Proficiency Bonus" type="number" v-model="proficiency"></v-text-field></v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { MUTATION } from '../../data/ACTIONS'
// CR's kinda complicated. The app will be able to work in multiple modes:
// - manual CR input
// - automatic CR estimation (manual proficiency modifier)
// - automatic CR estimation (alternate computation)
// the estimated CR will be output in this panel as well
export default {
  name: 'CR',
  computed: {
    proficiency: {
      get() { return this.$store.state.monster.proficiency },
      set(value) { this.$store.commit(MUTATION.SET_SIMPLE_PROP, { key: 'proficiency', value: parseInt(value) }) }
    }
  }
}
</script>