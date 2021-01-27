<template>
  <v-expansion-panel>
    <v-expansion-panel-header>Multiattack</v-expansion-panel-header>
    <v-expansion-panel-content class="pt-6">
      <v-row>
        <v-col cols="12" v-for="(item, index) in multiattacks" :key="item.id">
          <v-card outlined>
            <v-card-title class="overline pt-2 px-2 pb-0 mb-2"
              >Multiattack Group {{ index + 1 }}</v-card-title
            >
            <v-card-subtitle class="px-2 mb-n4">
              {{ damagePerRound(item) }} Damage per Round</v-card-subtitle
            >
            <v-row class="px-2 pb-2" align="center">
              <v-col cols="1">
                <v-menu>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn fab x-small color="green" v-bind="attrs" v-on="on">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </template>

                  <v-list subheader>
                    <v-subheader>Attacks</v-subheader>
                    <v-list-item
                      v-for="atk in attacks"
                      :key="atk.id"
                      @click="addAttack(index, atk)"
                    >
                      <v-list-item-content>
                        <v-list-item-title>{{ atk.name }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-subheader>Actions</v-subheader>
                    <v-list-item
                      v-for="act in actions"
                      :key="act.id"
                      @click="addAction(index, act)"
                    >
                      <v-list-item-content>
                        <v-list-item-title>{{ act.name }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
              <v-col>
                <v-chip
                  close
                  v-for="(attackId, i) in item.attacks"
                  @click:close="removeAttack(index, i)"
                  :key="i"
                  class="ma-1"
                >
                  {{ resolveIdToName(attackId) }}
                </v-chip>
                <v-chip
                  close
                  v-for="(actionId, i) in item.actions"
                  @click:close="removeAction(index, i)"
                  :key="i + item.attacks.length"
                  class="ma-1"
                >
                  {{ resolveActionIdToName(actionId) }}
                </v-chip>
              </v-col>
              <v-col cols="1">
                <v-btn fab x-small color="red" @click="removeMulti(index)"
                  ><v-icon>mdi-close</v-icon></v-btn
                >
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-btn block small color="green" @click="addMulti" class="mb-2"
          >Add Multiattack Group</v-btn
        >
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import { MUTATION } from '../../data/ACTIONS';

export default {
  name: 'Multiattacks',
  components: {},
  computed: {
    attacks() {
      return this.$store.state.monster.attacks;
    },
    actions() {
      return this.$store.state.monster.actions;
    },
    multiattacks() {
      return this.$store.state.monster.multiattacks;
    },
  },
  methods: {
    addMulti() {
      this.multiattacks.push({
        id: uuidv4(),
        attacks: [],
        actions: [],
      });
      this.update();
    },
    addAttack(index, attack) {
      this.multiattacks[index].attacks.push(attack.id);
      this.update();
    },
    addAction(index, action) {
      this.multiattacks[index].actions.push(action.id);
      this.update();
    },
    removeAttack(maIndex, attackIndex) {
      this.multiattacks[maIndex].attacks.splice(attackIndex, 1);
      this.update();
    },
    removeAction(maIndex, actionIndex) {
      this.multiattacks[maIndex].actions.splice(actionIndex, 1);
    },
    removeMulti(index) {
      this.multiattacks.splice(index, 1);
      this.update();
    },
    update() {
      this.$store.commit(MUTATION.SET_MULTIATTACK, this.multiattacks);
    },
    resolveIdToName(id) {
      return this.resolveId(id).name;
    },
    resolveId(id) {
      return this.attacks.find((a) => a.id === id);
    },
    resolveActionIdToName(id) {
      return this.resolveActionId(id).name;
    },
    resolveActionId(id) {
      return this.actions.find((a) => a.id === id);
    },
    damagePerRound(ma) {
      return this.$store.getters.multiattackDamage(ma);
    },
  },
};
</script>
