<template>
  <v-card>
    <v-card-title>
      <span class="headline">Add Custom Spell</span>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="name"
            label="Spell Name"
            hint="Must be unique"
            :error="nameError"
            :error-messages="errorMessage"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-select
            :items="levels"
            v-model="level"
            label="Spell Level"
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-select
            :items="classes"
            multiple
            v-model="classList"
            label="Available To"
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-text-field
            type="number"
            v-model.number="damage"
            label="Single Target Damage"
            hint="Leave at 0 if no damage"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-checkbox
            v-model="multitarget"
            label="Does Multitarget Damage"
          ></v-checkbox>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn color="green" text @click="saveSpell">Add</v-btn>
      <v-btn color="blue" text @click="close">Close</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import N2W from 'number-to-words';
import { CLASS_SPELL_SLOTS } from '../../data/CLASS';
import { MUTATION } from '../../data/ACTIONS';

export default {
  name: 'FormSpellNew',
  data() {
    return {
      name: '',
      damage: 0,
      multitarget: false,
      level: 1,
      classList: null,
      nameError: false,
      errorMessage: '',
    };
  },
  computed: {
    levels() {
      const ret = [
        {
          text: 'Cantrip',
          value: 0,
        },
      ];

      for (
        let i = 0;
        i < this.$store.state.monster.spellcasting.slots.length;
        i++
      ) {
        ret.push({ text: `${N2W.toOrdinal(i + 1)} level`, value: i + 1 });
      }

      return ret;
    },
    classes() {
      return Object.keys(CLASS_SPELL_SLOTS);
    },
  },
  methods: {
    saveSpell() {
      // validate no dupes, then snapshot
      if (this.name in this.$store.state.spells) {
        this.nameError = true;
        this.errorMessage = 'Spell name already exists. Names must be unique.';
      } else {
        // add
        this.$store.commit(MUTATION.ADD_CUSTOM_SPELL, {
          name: this.name,
          damage: this.damage,
          multitarget: this.multitarget,
          level: this.level,
          levelDisplay:
            this.level === 0
              ? 'Cantrip'
              : `${N2W.toOrdinal(this.level)} level`,
          class: this.classList ? this.classList : [],
          custom: true,
        });

        this.close();
      }
    },
    close() {
      // reset
      this.name = '';
      this.damage = 0;
      this.multitarget = false;
      this.level = 1;
      this.classList = null;
      this.nameError = false;
      this.errorMessage = '';

      // emit the close event
      this.$emit('close');
    },
  },
};
</script>
