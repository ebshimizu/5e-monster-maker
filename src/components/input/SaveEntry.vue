<template>
  <v-col cols="4">
    <v-row align="center" no-gutters>
      <v-col cols="3" class="pr-2">
        <v-subheader>{{ save.key }}</v-subheader>
      </v-col>
      <v-col class="pr-2"
        ><v-text-field
          label="Modifier"
          type="number"
          v-model="modifier"
          :disabled="!save.override"
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
    activeColor(status) {
      return status ? 'blue' : 'grey';
    },
  },
};
</script>
