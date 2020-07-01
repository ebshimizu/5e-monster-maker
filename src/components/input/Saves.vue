<template>
  <v-expansion-panel>
    <v-expansion-panel-header>Saving Throws</v-expansion-panel-header>
    <v-expansion-panel-content class="mt-2">
      <v-row>
        <save-entry
          v-for="(item, index) in saves"
          :key="item.stat"
          :index="index"
          :save="item"
        ></save-entry>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import SaveEntry from './SaveEntry'

export default {
  name: 'Saves',
  components: {
    SaveEntry
  },
  computed: {
    saves() {
      const saves = this.$store.state.monster.saves;
      return Object.keys(saves).map(s => { return { key: s, ...saves[s] } })
    }
  }
}
</script>