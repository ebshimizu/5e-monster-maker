<template>
  <v-col cols="6">
    <v-row align="center" no-gutters>
      <v-col cols="2" class="pr-2">
        <v-subheader>{{ save.key }}</v-subheader>
      </v-col>
      <v-col cols="2" class="pr-2"
        ><v-text-field
          label="Modifier"
          type="number"
          v-model="modifier"
          :disabled="!save.override"
        ></v-text-field
      ></v-col>
      <v-col cols="4" class="pr-2">
        <v-switch v-model="proficient" label="Proficient"></v-switch>
      </v-col>
      <v-col cols="4">
        <v-switch v-model="override" label="Override"></v-switch>
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
import { MUTATION } from '../../data/ACTIONS';

export default {
  name: 'SaveEntry',
  props: ['save', 'index'],
  computed: {
    modifier: {
      get() {
        if (!this.save.override) {
          // compute automatically
          return this.$store.getters.defaultSaveBonus(this.save.key);
        } else {
          return this.save.overrideValue;
        }
      },
      set(value) {
        if (this.save.override) {
          this.save.overrideValue = parseInt(value);
          this.update();
        }
      },
    },
    proficient: {
      get() {
        return this.save.proficient;
      },
      set(value) {
        this.save.proficient = value;
        this.update();
      },
    },
    override: {
      get() {
        return this.save.override;
      },
      set(value) {
        this.save.override = value;
        this.update();
      },
    },
  },
  methods: {
    update() {
      this.$store.commit(MUTATION.SET_SAVE, this.save);
    },
  },
};
</script>
