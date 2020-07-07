<template>
  <v-expansion-panel>
    <v-expansion-panel-header>Reactions</v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row>
        <v-col cols="12">
          <v-expansion-panels accordion hover multiple focusable>
            <v-expansion-panel
              v-for="(reaction, index) in reactions"
              :key="reaction.id"
            >
              <v-expansion-panel-header>{{
                reaction.name
              }}</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row align="center">
                  <v-col cols="12"
                    ><v-text-field
                      v-model="reactions[index].name"
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
                      v-model="reactions[index].description"
                      @input="update"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      small
                      block
                      color="red"
                      @click="removeReaction(index)"
                      >Delete Reaction</v-btn
                    >
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
        <v-col cols="12">
          <v-btn block small color="green" @click="addReaction"
            >Add Reaction</v-btn
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
  name: 'DndReactions',
  computed: {
    reactions() {
      return this.$store.state.monster.reactions;
    },
  },
  created() {
    this.update = _.debounce(this.debouncedUpdate, 250);
  },
  methods: {
    debouncedUpdate() {
      this.$store.commit(MUTATION.SET_SIMPLE_PROP, {
        key: 'reactions',
        value: this.reactions,
      });
    },
    addReaction() {
      this.reactions.push(newReaction());
      this.update();
    },
    removeReaction(index) {
      this.reactions.splice(index, 1);
      this.update();
    },
  },
};
</script>
