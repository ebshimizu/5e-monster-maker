<template>
  <v-expansion-panel>
    <v-expansion-panel-header>Regional Effects</v-expansion-panel-header>
    <v-expansion-panel-content class="mt-2">
      <v-row>
        <v-col cols="12">
          <v-expansion-panels accordion hover multiple focusable>
            <p>
              Regional effects will appear after lair actions (if any). Regional
              effects are not included in the CR calculation and will only
              appear if at least one effect is in the list.
            </p>
            <v-textarea
              label="Regional Effect Description"
              v-model="description"
              outlined
            ></v-textarea>
            <v-expansion-panel
              v-for="(effect, index) in effects"
              :key="effect.id"
            >
              <v-expansion-panel-header>{{
                effect.name
              }}</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row align="center">
                  <v-col cols="12"
                    ><v-text-field
                      v-model="effects[index].name"
                      label="Name"
                      hint="Name does not render. For reference only."
                      persistent-hint
                      @input="update"
                    ></v-text-field
                  ></v-col>
                  <v-col cols="12">
                    <v-textarea
                      outlined
                      label="Description"
                      persistent-hint
                      hint="Dice rolls can be input if placed in {}s, like {1d6+3}. Other tokens: {DC:INT} for a save based on the indicated stat, {A:STR} for an attack bonus with the indicated stat. Proficiency is assumed."
                      v-model="effects[index].description"
                      @input="update"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-btn small block color="red" @click="removeEffect(index)"
                      >Delete Regional Effect</v-btn
                    >
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
        <v-col cols="12">
          <v-btn block small color="green" @click="addEffect"
            >Add Regional Effect</v-btn
          ></v-col
        >
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { MUTATION } from '../../data/ACTIONS';
import { newReaction } from '../util';
import _ from 'lodash';

export default {
  name: 'RegionalEffects',
  computed: {
    effects() {
      return this.$store.state.monster.regionalEffects;
    },
    description: {
      get() {
        return this.$store.state.monster.regionalEffectDescription;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SIMPLE_PROP, {
          key: 'regionalEffectDescription',
          value,
        });
      },
    },
  },
  created() {
    this.update = _.debounce(this.debouncedUpdate, 250);
  },
  methods: {
    debouncedUpdate() {
      this.$store.commit(MUTATION.SET_SIMPLE_PROP, {
        key: 'regionalEffects',
        value: this.effects,
      });
    },
    addEffect() {
      // reactions use the same type
      const newEffect = newReaction();
      newEffect.name = "New Regional Effect";
      this.effects.push(newEffect);
      this.update();
    },
    removeEffect(index) {
      this.effects.splice(index, 1);
      this.update();
    },
  },
};
</script>
