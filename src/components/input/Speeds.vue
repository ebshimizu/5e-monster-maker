<template>
  <v-expansion-panel>
    <v-expansion-panel-header>Speeds</v-expansion-panel-header>
    <v-expansion-panel-content class="mt-2">
      <v-btn block color="green" @click="add">Add Speed</v-btn>
      <speed-entry
        v-for="(item, index) in speeds"
        :key="item.id"
        :index="index"
        :speed="item"
      ></speed-entry>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import SpeedEntry from './SpeedEntry'
import { MUTATION } from '../../data/ACTIONS'
import MOVEMENT from '../../data/MOVEMENT'

export default {
  name: 'Speeds',
  components: {
    SpeedEntry
  },
  computed: {
    speeds() { return this.$store.state.monster.speeds }
  },
  methods: {
    add() {
      this.$store.commit(MUTATION.ADD_SPEED, {
        type: MOVEMENT.WALK,
        speed: 30,
        note: ''
      })
    }
  }
}
</script>