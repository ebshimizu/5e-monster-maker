<template>
  <v-expansion-panel>
    <v-expansion-panel-header>Lair Actions</v-expansion-panel-header>
    <v-expansion-panel-content class="mt-2">
      <v-row dense>
        <v-col cols="12">
          <p>
            Lair actions will appear at the end of the stat block. Lair actions
            do not need to be named, as the name will not render, but you can
            enter one if you want. In the CR calculation, it is assumed that
            lair actions cannot be used twice in a row (this is not true for all
            actions, but it is a commonly used pattern.)
          </p>
        </v-col>
        <v-col cols="12">
          <v-expansion-panels accordion hover multiple focusable>
            <v-expansion-panel
              v-for="(action, index) in lairActions"
              :key="action.id"
            >
              <v-expansion-panel-header>{{
                action.name
              }}</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row align="center">
                  <v-col cols="12"
                    ><v-text-field
                      v-model="lairActions[index].name"
                      label="Name"
                      @input="update"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="12">
                    <v-textarea
                      outlined
                      label="Description"
                      persistent-hint
                      hint="Dice rolls can be input if placed in {}s, like {1d6+3}. Other tokens: {DC:INT} for a save based on the indicated stat, {A:STR} for an attack bonus with the indicated stat. Proficiency is assumed."
                      v-model="lairActions[index].description"
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
                        >Optional. To include Lair Actions in the CR
                        calculation, make sure you fill this
                        in.</v-card-subtitle
                      >
                      <v-card-text>
                        <v-row>
                          <v-col cols="3">
                            <v-switch
                              v-model="lairActions[index].crAnnotation.include"
                              label="Use for CR"
                              @change="update"
                            ></v-switch>
                          </v-col>
                          <v-col cols="3">
                            <v-text-field
                              type="number"
                              v-model.number="
                                lairActions[index].crAnnotation.maxDamage
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
                                lairActions[index].crAnnotation.maxSave
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
                                lairActions[index].crAnnotation.maxModifier
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
                                lairActions[index].crAnnotation.ehpModifier
                              "
                              label="EHP Modifier"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="2">
                            <v-text-field
                              type="number"
                              v-model.number="
                                lairActions[index].crAnnotation.ehpMultiplier
                              "
                              label="EHP Multiplier"
                              @input="update"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="2">
                            <v-text-field
                              type="number"
                              v-model.number="
                                lairActions[index].crAnnotation.acModifier
                              "
                              @input="update"
                              label="AC Modifier"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="3"
                            ><v-switch
                              v-model="
                                lairActions[index].crAnnotation.multitarget
                              "
                              label="Multitarget"
                              @change="update"
                            ></v-switch
                          ></v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12">
                    <v-btn small block color="red" @click="removeAction(index)"
                      >Delete Lair Action</v-btn
                    >
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
        <v-col cols="12"
          ><v-btn small color="green" block @click="addAction"
            >Add Lair Action</v-btn
          ></v-col
        >
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { MUTATION } from '../../data/ACTIONS';
import { newLairAction } from '../util';
import _ from 'lodash';

export default {
  name: 'LairActions',
  data() {
    return {};
  },
  computed: {
    lairActions() {
      return this.$store.state.monster.lairActions;
    },
  },
  created() {
    this.update = _.debounce(this.debouncedUpdate, 250);
  },
  methods: {
    debouncedUpdate() {
      this.$store.commit(MUTATION.SET_SIMPLE_PROP, {
        key: 'lairActions',
        value: this.lairActions,
      });
    },
    addAction() {
      this.lairActions.push(newLairAction());
      this.update();
    },
    removeAction(index) {
      this.lairActions.splice(index, 1);
      this.update();
    },
  },
};
</script>
