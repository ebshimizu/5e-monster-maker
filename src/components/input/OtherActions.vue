<template>
  <v-expansion-panel>
    <v-expansion-panel-header>Other Actions</v-expansion-panel-header>
    <v-expansion-panel-content class="mt-2">
      <v-row>
        <v-col cols="12">
          <v-expansion-panels accordion hover multiple focusable>
            <v-expansion-panel
              v-for="(action, index) in actions"
              :key="action.id"
              cols="12"
            >
              <v-expansion-panel-header>{{
                action.name
              }}</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row align="center">
                  <v-col
                    ><v-text-field
                      v-model="actions[index].name"
                      label="Name"
                      @input="update"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="1">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          fab
                          x-small
                          :color="
                            actions[index].legendaryOnly ? 'blue' : 'grey'
                          "
                          v-on="on"
                          @click="toggleLegendary(index)"
                          ><v-icon>mdi-alpha-l-box</v-icon></v-btn
                        ></template
                      >Legendary Only</v-tooltip
                    >
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      label="Recharge"
                      v-model="actions[index].recharge"
                      @input="update"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      type="number"
                      label="Uses"
                      hint="0 = unlimited"
                      v-model.number="actions[index].limitedUse.count"
                      @input="update"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-combobox
                      :items="rateTypes"
                      v-model="actions[index].limitedUse.rate"
                      @input="update"
                      label="Reset Type"
                    ></v-combobox>
                  </v-col>
                  <v-col cols="1">
                    <v-btn fab x-small color="red" @click="removeAction"
                      ><v-icon>mdi-close</v-icon></v-btn
                    >
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      outlined
                      label="Description"
                      persistent-hint
                      hint="Dice rolls can be input if placed in {}s, like {1d6+3}. Other tokens: {DC:INT} for a save based on the indicated stat, {A:STR} for an attack bonus with the indicated stat. Proficiency is assumed."
                      v-model="actions[index].description"
                      @input="update"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-card outlined class="pa-0">
                      <v-card-title
                        class="indigo darken-4 overline pt-2 px-2 mb-0 pb-2"
                        >CR Annotations</v-card-title
                      >
                      <v-card-subtitle class="indigo darken-4 px-2 pb-2"
                        >Optional. If you want this action to affect the CR,
                        flip the switch and enter action
                        information.</v-card-subtitle
                      >
                      <v-card-text>
                        <v-row>
                          <v-col cols="3">
                            <v-switch
                              v-model="actions[index].crAnnotation.include"
                              label="Use for CR"
                              @change="update"
                            ></v-switch>
                          </v-col>
                          <v-col cols="3">
                            <v-text-field
                              type="number"
                              v-model.number="
                                actions[index].crAnnotation.maxDamage
                              "
                              hint="Damage in One Use"
                              label="Expected Damage"
                              @input="update"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="3">
                            <v-text-field
                              type="number"
                              v-model.number="
                                actions[index].crAnnotation.recurringDamage
                              "
                              label="Recurring Damage"
                              hint="e.g. Heat Aura"
                              @input="update"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="3">
                            <v-text-field
                              type="number"
                              v-model.number="
                                actions[index].crAnnotation.maxSave
                              "
                              label="DC"
                              hint="Use highest if multiple"
                              @input="update"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="3">
                            <v-text-field
                              type="number"
                              v-model.number="
                                actions[index].crAnnotation.maxModifier
                              "
                              label="Attack Modifier"
                              hint="Use highest if multiple"
                              @input="update"
                            ></v-text-field
                          ></v-col>
                          <v-col cols="2">
                            <v-text-field
                              type="number"
                              v-model.number="
                                actions[index].crAnnotation.ehpModifier
                              "
                              label="EHP Modifier"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="2">
                            <v-text-field
                              type="number"
                              v-model.number="
                                actions[index].crAnnotation.ehpMultiplier
                              "
                              label="EHP Multiplier"
                              @input="update"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="2">
                            <v-text-field
                              type="number"
                              v-model.number="
                                actions[index].crAnnotation.acModifier
                              "
                              label="AC Modifier"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="3"
                            ><v-switch
                              v-model="actions[index].crAnnotation.multitarget"
                              label="Multitarget"
                              @change="update"
                            ></v-switch
                          ></v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
        <v-col cols="12"
          ><v-btn small color="green" block @click="addAction"
            >Add Action</v-btn
          ></v-col
        >
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { MUTATION } from '../../data/ACTIONS';
import { newAction } from '../util';
import { AT_WILL_DEFAULT_RATES } from '../../data/SPELLS';

export default {
  name: 'OtherActions',
  data() {
    return {
      rateTypes: Object.values(AT_WILL_DEFAULT_RATES),
    };
  },
  computed: {
    actions() {
      return this.$store.state.monster.actions;
    },
  },
  methods: {
    update() {
      this.$store.commit(MUTATION.SET_SIMPLE_PROP, {
        key: 'actions',
        value: this.actions,
      });
    },
    addAction() {
      this.actions.push(newAction());
      this.update();
    },
    removeAction(index) {
      this.actions.splice(index, 1);
      this.update();
    },
    toggleLegendary(index) {
      this.actions[index].legendaryOnly = !this.actions[index].legendaryOnly;
      this.update();
    },
  },
};
</script>
