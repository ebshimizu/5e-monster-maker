<template>
  <v-col cols="6">
    <v-row align="center" no-gutters>
      <v-col cols="3" class="pr-2">
        <v-subheader>{{ skill.skill.key }}</v-subheader>
      </v-col>
      <v-col class="pr-2"
        ><v-text-field
          label="Bonus"
          type="number"
          v-model="bonus"
          :disabled="!skill.override"
        ></v-text-field
      ></v-col>
      <v-col md="auto">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              fab
              x-small
              :color="activeColor(proficient)"
              v-on="on"
              @click="proficient = !proficient"
              class="ml-1"
              :disabled="override"
              ><v-icon>mdi-wizard-hat</v-icon></v-btn
            >
          </template>
          Proficient
        </v-tooltip>
      </v-col>
      <v-col md="auto">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              fab
              x-small
              :color="activeColor(override)"
              v-on="on"
              @click="override = !override"
              class="ml-1"
              ><v-icon>mdi-hammer-wrench</v-icon></v-btn
            >
          </template>
          Override
        </v-tooltip>
      </v-col>
      <v-col md="auto">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              fab
              x-small
              color="red"
              v-on="on"
              @click="remove"
              class="ml-1"
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </template>
          Remove Skill
        </v-tooltip>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import { MUTATION } from '../../data/ACTIONS';

export default {
  name: 'SaveEntry',
  props: ['skill', 'index'],
  computed: {
    bonus: {
      get() {
        if (!this.skill.override) {
          // compute automatically
          return this.$store.getters.defaultSkillBonus(this.skill);
        } else {
          return this.skill.overrideValue;
        }
      },
      set(value) {
        if (this.skill.override) {
          this.skill.overrideValue = parseInt(value);
          this.update();
        }
      },
    },
    proficient: {
      get() {
        return this.skill.proficient;
      },
      set(value) {
        this.skill.proficient = value;
        this.update();
      },
    },
    override: {
      get() {
        return this.skill.override;
      },
      set(value) {
        this.skill.override = value;
        this.update();
      },
    },
  },
  methods: {
    update() {
      this.$store.commit(MUTATION.SET_SKILL, this.skill);
    },
    remove() {
      this.$store.commit(MUTATION.DELETE_SKILL, this.index);
    },
    activeColor(status) {
      return status ? 'blue' : 'grey';
    },
  },
};
</script>
