<template>
  <v-expansion-panel>
    <v-expansion-panel-header>Legendary Actions</v-expansion-panel-header>
    <v-expansion-panel-content class="mt-2">
      <v-row align="center">
        <v-col cols="2">
          <v-text-field
            type="number"
            v-model.number="legendaryActions.count"
            min="0"
            label="Actions"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-menu offset-y max-height="300px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="green" small block v-on="on" v-bind="attrs"
                >Add Legendary Action</v-btn
              >
            </template>
            <v-list>
              <v-list-item
                v-for="action in availableActions"
                :key="action.id"
                @click="addAction(action.id)"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ action.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ action.type }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
        <v-col
          cols="12"
          v-for="(action, index) in legendaryActions.actions"
          :key="action.id"
        >
          <v-row no-gutters align="center">
            <v-col cols="8">
              <v-subheader color="white">{{
                actionName(action.actionId)
              }}</v-subheader></v-col
            >
            <v-col cols="3">
              <v-text-field
                type="number"
                min="1"
                label="Cost"
                v-model.number="legendaryActions.actions[index].cost"
                @input="update"
              ></v-text-field>
            </v-col>
            <v-col cols="1" class="pa-2">
              <v-btn
                fab
                x-small
                color="red"
                class="ma-auto"
                @click="removeAction(index)"
                ><v-icon>mdi-close</v-icon></v-btn
              >
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { MUTATION } from '../../data/ACTIONS';
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'LegendaryActions',
  computed: {
    legendaryActions() {
      return this.$store.state.monster.legendaryActions;
    },
    availableActions() {
      return this.$store.state.monster.actions
        .filter(
          (a) =>
            !this.legendaryActions.actions.find((la) => la.actionId === a.id)
        )
        .map((a) => {
          return { type: 'action', ...a };
        })
        .concat(
          this.$store.state.monster.attacks
            .filter(
              (a) =>
                !this.legendaryActions.actions.find(
                  (la) => la.actionId === a.id
                )
            )
            .map((a) => {
              return { type: 'attack', ...a };
            })
        );
    },
  },
  methods: {
    update() {
      this.$store.commit(MUTATION.SET_SIMPLE_PROP, {
        key: 'legendaryActions',
        value: this.legendaryActions,
      });
    },
    addAction(id) {
      this.legendaryActions.actions.push({
        id: uuidv4(),
        actionId: id,
        cost: 1,
      });
      this.update();
    },
    actionName(actionId) {
      const action = this.$store.getters.attackOrActionFromId(actionId);
      return action.name;
    },
    removeAction(index) {
      this.legendaryActions.actions.splice(index, 1);
      this.update();
    },
  },
};
</script>
