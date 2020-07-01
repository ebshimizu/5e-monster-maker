<template>
  <v-row align="center" no-gutters>
    <v-col cols="3" class="pr-2">
      <v-subheader>{{ skill.skill.key }}</v-subheader>
    </v-col>
    <v-col cols="2" class="pr-2"
      ><v-text-field
        label="Bonus"
        type="number"
        v-model="bonus"
        :disabled="!skill.override"
      ></v-text-field
    ></v-col>
    <v-col cols="3" class="pr-2">
      <v-switch v-model="proficient" label="Proficient"></v-switch>
    </v-col>
    <v-col cols="3">
      <v-switch v-model="override" label="Override"></v-switch>
    </v-col>
    <v-col cols="1">
      <v-btn fab small color="red" @click="remove"><v-icon>mdi-close</v-icon></v-btn>
    </v-col>
  </v-row>
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
    }
  },
};
</script>
