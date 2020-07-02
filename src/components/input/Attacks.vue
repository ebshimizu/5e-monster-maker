<template>
  <v-expansion-panel>
    <v-expansion-panel-header>Attacks</v-expansion-panel-header>
    <v-expansion-panel-content class="mt-2">
      <v-expansion-panels>
        <attack-panel
          v-for="(item, index) in attacks"
          :key="item.id"
          :attack="item"
          :index="index"
        ></attack-panel>
      </v-expansion-panels>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import AttackPanel from './AttackPanel';

export default {
  name: 'Attacks',
  components: {
    AttackPanel,
  },
  computed: {
    attacks() {
      return this.$store.state.monster.attacks;
    },
  },
};
</script>
