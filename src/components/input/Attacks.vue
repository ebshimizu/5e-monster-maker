<template>
  <v-expansion-panel>
    <v-expansion-panel-header>Attacks</v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row
        ><v-col cols="12">
          <v-expansion-panels accordion hover multiple focusable>
            <attack-panel
              v-for="(item, index) in attacks"
              :key="item.id"
              :attack="item"
              :index="index"
            ></attack-panel> </v-expansion-panels></v-col
        ><v-col cols="12">
          <v-btn block small color="green" @click="addAttack" class="mb-2"
            >Add Attack</v-btn
          ></v-col
        ></v-row
      >
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import AttackPanel from './AttackPanel';
import { MUTATION } from '../../data/ACTIONS';

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
  methods: {
    addAttack() {
      this.$store.commit(MUTATION.ADD_ATTACK);
    },
  },
};
</script>
