<template>
  <v-card>
    <v-card-title>
      <span class="headline">Manage Custom Spells</span>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-select
            :items="customSpells"
            label="Spell"
            v-model="selectedSpell"
            @input="updateFields"
            clearable
          ></v-select>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="name"
            label="Spell Name"
            hint="Must be unique"
            :error="nameError"
            :error-messages="errorMessage"
            :disabled="!selectedSpell"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-select
            :items="levels"
            v-model="level"
            :disabled="!selectedSpell"
            label="Spell Level"
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-select
            :items="classes"
            multiple
            v-model="classList"
            :disabled="!selectedSpell"
            label="Available To"
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-text-field
            type="number"
            v-model.number="damage"
            label="Single Target Damage"
            hint="Leave at 0 if no damage"
            :disabled="!selectedSpell"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-checkbox
            v-model="multitarget"
            label="Does Multitarget Damage"
            :disabled="!selectedSpell"
          ></v-checkbox>
        </v-col>
        <v-col cols="6">
          <v-btn
            small
            block
            color="green"
            :disabled="!selectedSpell"
            @click="updateSpell"
            >{{ updateText }}</v-btn
          >
        </v-col>
        <v-col cols="6">
          <v-btn
            small
            block
            color="red"
            :disabled="!selectedSpell"
            @click="deleteSpell"
            >Delete</v-btn
          >
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn color="blue" text @click="close">Done</v-btn>
      <v-btn text @click="importSpells">Import List</v-btn>
      <v-btn text @click="exportSpells">Export List</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import N2W from 'number-to-words';
import { CLASS_SPELL_SLOTS } from '../../data/CLASS';
import { ACTION } from '../../data/ACTIONS';
import { download } from '../util';

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
      originalName: '',
      selectedSpell: null,
      updateText: 'Update',
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
    customSpells() {
      return this.$store.getters.customSpellArray;
    },
  },
  methods: {
    saveAndOverwriteSpell() {
      // update the thing
      this.$store.dispatch(ACTION.UPDATE_SPELL_AND_VALIDATE, {
        originalName: this.originalName,
        spell: {
          name: this.name,
          damage: this.damage,
          multitarget: this.multitarget,
          level: this.level,
          levelDisplay:
            this.level === 0 ? 'Cantrip' : `${N2W.toOrdinal(this.level)} level`,
          class: this.classList,
          custom: true,
        },
      });

      this.updateButtonMessage('Spell Updated');
    },
    reset() {
      this.name = '';
      this.damage = 0;
      this.multitarget = false;
      this.level = 1;
      this.classList = null;
      this.nameError = false;
      this.errorMessage = '';
      this.originalName = '';
    },
    close() {
      // reset
      this.reset();
      this.selectedSpell = undefined;

      // emit the close event
      this.$emit('close');
    },
    updateFields(key) {
      if (key) {
        const spell = this.$store.state.spells[key];

        this.name = spell.name;
        this.originalName = spell.name;
        this.damage = spell.damage;
        this.multitarget = spell.damage;
        this.level = spell.level;
        this.classList = spell.class;
        this.nameError = false;
        this.errorMessage = '';
      } else {
        this.reset();
      }
    },
    deleteSpell() {
      this.$store.dispatch(ACTION.DELETE_SPELL_AND_VALIDATE, this.originalName);
      this.reset();
    },
    updateSpell() {
      if (this.selectedSpell) {
        // check if the name was changed
        if (this.name !== this.originalName) {
          // if the new name is free
          if (this.name in this.$store.state.spells) {
            this.nameError = true;
            this.errorMessage =
              'Unable to rename spell. Spell name already exists.';
            return;
          }
        }

        // add/replace
        this.saveAndOverwriteSpell();
      }
    },
    updateButtonMessage(text) {
      this.updateText = text;

      setTimeout(() => this.updateText = 'Update', 2000);
    },
    exportSpells() {
      download(JSON.stringify(this.customSpells), 'custom-5emm-spells.json', 'application/json');
    },
    importSpells() {
      // show the dialog... i guess?
    }
  },
};
</script>
