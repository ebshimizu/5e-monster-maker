<template>
  <v-expansion-panel>
    <v-expansion-panel-header>Senses and Languages</v-expansion-panel-header>
    <v-expansion-panel-content class="mt-2">
      <v-row no-gutters>
        <v-col cols="3" class="pr-2"
          ><v-text-field
            label="Blindsight"
            v-model="blindsight"
            type="number"
            suffix="ft."
          ></v-text-field
        ></v-col>
        <v-col cols="3" class="pr-2"
          ><v-text-field
            label="Darkvision"
            v-model="darkvision"
            type="number"
            suffix="ft."
          ></v-text-field
        ></v-col>
        <v-col cols="3" class="pr-2"
          ><v-text-field
            label="Tremorsense"
            v-model="tremorsense"
            type="number"
            suffix="ft."
          ></v-text-field
        ></v-col>
        <v-col cols="3"
          ><v-text-field
            label="Truesight"
            v-model="truesight"
            type="number"
            suffix="ft."
          ></v-text-field
        ></v-col>
        <v-col cols="3" class="pr-2"
          ><v-text-field
            label="Passive Perception"
            v-model="passive"
            type="number"
            persistent-hint
            :disabled="!override"
          ></v-text-field
        ></v-col>
        <v-col cols="2" class="pr-2"
          ><v-switch v-model="override" label="Override"></v-switch
        ></v-col>
        <v-col cols="7"><v-text-field label="Languages" v-model="languages"></v-text-field></v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { MUTATION } from '../../data/ACTIONS';
export default {
  name: 'Senses',
  computed: {
    passive: {
      get() {
        if (!this.$store.state.monster.passivePerception.override) {
          // compute automatically
          return this.$store.getters.passivePerception;
        } else {
          return this.$store.state.monster.passivePerception.overrideValue;
        }
      },
      set(value) {
        if (this.$store.state.monster.passivePerception.override) {
          const updated = {
            override: true,
            overrideValue: parseInt(value),
          };
          this.$store.commit(MUTATION.SET_SIMPLE_PROP, {
            key: 'passivePerception',
            value: updated,
          });
        }
      },
    },
    override: {
      get() {
        return this.$store.state.monster.passivePerception.override;
      },
      set(value) {
        const updated = {
          override: value,
          overrideValue: this.$store.state.monster.passivePerception
            .overrideValue,
        };
        this.$store.commit(MUTATION.SET_SIMPLE_PROP, {
          key: 'passivePerception',
          value: updated,
        });
      },
    },
    blindsight: {
      get() {
        return this.$store.state.monster.senses.blindsight;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SENSE, {
          sense: 'blindsight',
          value: parseInt(value),
        });
      },
    },
    darkvision: {
      get() {
        return this.$store.state.monster.senses.darkvision;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SENSE, {
          sense: 'darkvision',
          value: parseInt(value),
        });
      },
    },
    tremorsense: {
      get() {
        return this.$store.state.monster.senses.tremorsense;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SENSE, {
          sense: 'tremorsense',
          value: parseInt(value),
        });
      },
    },
    truesight: {
      get() {
        return this.$store.state.monster.senses.truesight;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SENSE, {
          sense: 'truesight',
          value: parseInt(value),
        });
      },
    },
    languages: {
      get() {
        return this.$store.state.monster.languages;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SIMPLE_PROP, {
          key: 'languages',
          value,
        });
      },
    },
  },
};
</script>
