<template>
  <v-expansion-panel>
    <v-expansion-panel-header>Spellcasting</v-expansion-panel-header>
    <v-expansion-panel-content class="mt-2">
      <v-row>
        <v-col cols="4">
          <v-combobox
            :items="classes"
            @input="updateSlots"
            v-model="spellcasting.class"
            clearable
            dense
            label="Class"
          ></v-combobox>
        </v-col>
        <v-col cols="2">
          <v-text-field
            type="number"
            min="1"
            max="20"
            label="Caster Level"
            v-model.number="spellcasting.level"
            dense
            @input="updateSlots"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-select
            :items="stats"
            label="Spellcasting Ability"
            v-model="spellcasting.stat"
            dense
            @input="update"
          ></v-select>
        </v-col>
        <v-col cols="2">
          <v-row no-gutters>
            <v-col>
              <v-text-field
                type="number"
                min="0"
                label="Save DC"
                :disabled="!spellcasting.save.override"
                v-model.number="save"
                dense
              >
              </v-text-field>
            </v-col>
            <v-col md="auto">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    x-small
                    :color="overrideColor(spellcasting.save.override)"
                    v-on="on"
                    @click="toggleOverride('save')"
                    class="ml-1"
                    ><v-icon>mdi-hammer-wrench</v-icon></v-btn
                  >
                </template>
                Override {{ spellcasting.save.override ? 'On' : 'Off' }}
              </v-tooltip>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="2">
          <v-row no-gutters>
            <v-col>
              <v-text-field
                type="number"
                label="Attack"
                :disabled="!spellcasting.attack.override"
                v-model.number="attack"
                dense
              >
              </v-text-field>
            </v-col>
            <v-col md="auto">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    x-small
                    :color="overrideColor(spellcasting.attack.override)"
                    v-on="on"
                    @click="toggleOverride('attack')"
                    class="ml-1"
                    ><v-icon>mdi-hammer-wrench</v-icon></v-btn
                  >
                </template>
                Override {{ spellcasting.attack.override ? 'On' : 'Off' }}
              </v-tooltip>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="2">
          <v-row no-gutters>
            <v-col>
              <v-text-field
                type="number"
                label="Modifier"
                :disabled="!spellcasting.modifier.override"
                v-model.number="modifier"
                dense
              >
              </v-text-field>
            </v-col>
            <v-col md="auto">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    x-small
                    :color="overrideColor(spellcasting.modifier.override)"
                    v-on="on"
                    @click="toggleOverride('modifier')"
                    class="ml-1"
                    ><v-icon>mdi-hammer-wrench</v-icon></v-btn
                  >
                </template>
                Override {{ spellcasting.modifier.override ? 'On' : 'Off' }}
              </v-tooltip>
            </v-col>
          </v-row>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="4">
          <v-btn
            :color="classOnly ? 'green' : 'grey'"
            block
            @click="classOnly = !classOnly"
            >Class Spells Only: {{ classOnly ? 'On' : 'Off' }}</v-btn
          >
        </v-col>
        <v-col cols="12">
          <v-card outlined class="pa-0">
            <v-card-title
              class="deep-purple darken-4 overline pt-2 px-2 mb-0 pb-2"
              >Spellcasting</v-card-title
            >
            <v-card-subtitle class="deep-purple darken-4 px-2 pb-2 mb-4"
              >Spells cast from slots go here.</v-card-subtitle
            >
            <v-card-text>
              <v-row align="center">
                <v-col cols="12">
                  <v-text-field
                    dense
                    label="Slot Casting Notes"
                    v-model="spellcasting.notes"
                    @input="update()"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-autocomplete
                    :items="spells"
                    v-model="spellcasting.standard"
                    @input="update"
                    color="deep-purple darken-4"
                    label="All Known Spells"
                    hint="Type to search"
                    clearable
                    multiple
                    persistent-hint
                  >
                    <template v-slot:selection="{ index }">
                      <v-chip
                        color="deep-purple darken-3"
                        v-if="index === 0"
                        class="mr-4"
                        >{{ spellcasting.standard.length }} Spells Known</v-chip
                      >
                    </template>
                    <template v-slot:item="data">
                      <v-list-item-content>
                        <v-list-item-title>{{
                          data.item.name
                        }}</v-list-item-title>
                        <v-list-item-subtitle>{{
                          data.item.class.join(', ')
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action
                        ><v-list-item-action-text>{{
                          data.item.levelDisplay
                        }}</v-list-item-action-text></v-list-item-action
                      >
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="3">
                  <v-btn
                    color="deep-purple darken-3"
                    block
                    @click="showSlots = !showSlots"
                    >{{ showSlots ? 'Hide' : 'Show' }} Slots</v-btn
                  >
                </v-col>
              </v-row>
            </v-card-text>
            <v-slide-y-transition>
              <v-card-text v-if="showSlots">
                <v-row align="center">
                  <v-col cols="2">
                    <v-subheader color="white">{{ slotLevel(0) }} </v-subheader>
                  </v-col>
                  <v-col cols="2">
                    <v-subheader color="white">At Will</v-subheader>
                  </v-col>
                  <v-col>
                    <v-select
                      :items="spellsByLevel(0)"
                      dense
                      multiple
                      chips
                      deletable-chips
                      clearable
                      :value="knownSpellsAtLevel(0)"
                      :label="`Cantrips`"
                      @input="(val) => updateSpells(val, 0)"
                    >
                      <template v-slot:item="data">
                        <v-list-item-content>
                          <v-list-item-title>{{
                            data.item.name
                          }}</v-list-item-title>
                          <v-list-item-subtitle>{{
                            data.item.class.join(', ')
                          }}</v-list-item-subtitle>
                        </v-list-item-content>
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
                <v-row
                  align="center"
                  v-for="(count, index) in spellcasting.slots"
                  :key="index"
                >
                  <v-col cols="2">
                    <v-subheader color="white"
                      >{{ slotLevel(index + 1) }}
                    </v-subheader>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      label="Slots"
                      type="number"
                      v-model.number="spellcasting.slots[index]"
                      @input="update"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-select
                      :items="spellsByLevel(index + 1)"
                      dense
                      multiple
                      chips
                      deletable-chips
                      clearable
                      :value="knownSpellsAtLevel(index + 1)"
                      :label="`${slotLevel(index + 1)} Spells`"
                      @input="(val) => updateSpells(val, index + 1)"
                    >
                      <template v-slot:item="data">
                        <v-list-item-content>
                          <v-list-item-title>{{
                            data.item.name
                          }}</v-list-item-title>
                          <v-list-item-subtitle>{{
                            data.item.class.join(', ')
                          }}</v-list-item-subtitle>
                        </v-list-item-content>
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-slide-y-transition>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card outlined class="pa-0">
            <v-card-title
              class="deep-purple darken-4 overline pt-2 px-2 mb-0 pb-2"
              >Innate Spellcasting</v-card-title
            >
            <v-card-subtitle class="deep-purple darken-4 px-2 pb-2 mb-4"
              >Innate spellcasting list goes here.</v-card-subtitle
            >
            <v-card-text>
              <v-text-field
                dense
                label="Innate Casting Notes"
                v-model="spellcasting.atWillNotes"
                @input="update()"
              ></v-text-field>
              <v-btn block small color="green" @click="addNewAtWill"
                >Add New At Will Spell List</v-btn
              >
              <v-row
                align="center"
                v-for="(list, index) of this.spellcasting.atWill"
                :key="list.id"
              >
                <v-col cols="2">
                  <v-text-field
                    type="number"
                    v-model.number="spellcasting.atWill[index].count"
                    min="0"
                    @input="update"
                    label="Casts"
                    :disabled="list.rate === 'at will'"
                  ></v-text-field>
                </v-col>
                <v-col cols="2">
                  <v-combobox
                    :items="rateTypes"
                    v-model="spellcasting.atWill[index].rate"
                    label="Use Period"
                  ></v-combobox>
                </v-col>
                <v-col>
                  <v-autocomplete
                    :items="spells"
                    v-model="spellcasting.atWill[index].spells"
                    @input="update"
                    color="deep-purple darken-4"
                    label="Spell List"
                    hint="Type to search"
                    clearable
                    chips
                    deletable-chips
                    small-chips
                    multiple
                    persistent-hint
                  >
                    <template v-slot:item="data">
                      <v-list-item-content>
                        <v-list-item-title>{{
                          data.item.name
                        }}</v-list-item-title>
                        <v-list-item-subtitle>{{
                          data.item.class.join(', ')
                        }}</v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action
                        ><v-list-item-action-text>{{
                          data.item.levelDisplay
                        }}</v-list-item-action-text></v-list-item-action
                      >
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="1">
                  <v-btn fab x-small color="red" @click="removeAtWill(index)"
                    ><v-icon>mdi-close</v-icon></v-btn
                  >
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { CLASS_SPELL_SLOTS, CLASS_CASTING_STAT } from '../../data/CLASS';
import STAT from '../../data/STAT';
import { MUTATION } from '../../data/ACTIONS';
import N2W from 'number-to-words';
import { v4 as uuidv4 } from 'uuid';
import { AT_WILL_DEFAULT_RATES } from '../../data/SPELLS';

export default {
  name: 'Spellcasting',
  data() {
    return {
      classes: Object.keys(CLASS_SPELL_SLOTS),
      stats: Object.values(STAT),
      classOnly: false,
      showSlots: false,
      rateTypes: Object.values(AT_WILL_DEFAULT_RATES),
    };
  },
  computed: {
    spellcasting: {
      get() {
        return this.$store.state.monster.spellcasting;
      },
    },
    spells() {
      if (this.classOnly && this.spellcasting.class in CLASS_SPELL_SLOTS) {
        return this.$store.state.spells.ALL_ARRAY.filter(
          (s) => s.class.indexOf(this.spellcasting.class) >= 0
        );
      } else {
        return this.$store.state.spells.ALL_ARRAY;
      }
    },
    save: {
      get() {
        if (!this.spellcasting.save.override) {
          // compute automatically
          return this.$store.getters.defaultSpellSave(this.spellcasting.stat);
        } else {
          return this.spellcasting.save.overrideValue;
        }
      },
      set(value) {
        if (this.spellcasting.save.override) {
          this.spellcasting.save.overrideValue = parseInt(value);
          this.update();
        }
      },
    },
    modifier: {
      get() {
        if (!this.spellcasting.modifier.override) {
          // compute automatically
          return this.$store.getters.defaultSpellModifier(
            this.spellcasting.stat
          );
        } else {
          return this.spellcasting.modifier.overrideValue;
        }
      },
      set(value) {
        if (this.spellcasting.modifier.override) {
          this.spellcasting.modifier.overrideValue = parseInt(value);
          this.update();
        }
      },
    },
    attack: {
      get() {
        if (!this.spellcasting.attack.override) {
          // compute automatically
          return this.$store.getters.defaultSpellAttackModifier(
            this.spellcasting.stat
          );
        } else {
          return this.spellcasting.attack.overrideValue;
        }
      },
      set(value) {
        if (this.spellcasting.attack.override) {
          this.spellcasting.attack.overrideValue = parseInt(value);
          this.update();
        }
      },
    },
  },
  methods: {
    updateSlots() {
      // get slots
      if (this.spellcasting.class in CLASS_SPELL_SLOTS) {
        this.spellcasting.slots =
          CLASS_SPELL_SLOTS[this.spellcasting.class][
            this.spellcasting.level - 1
          ];
        this.spellcasting.stat = CLASS_CASTING_STAT[this.spellcasting.class];
      }

      this.update();
    },
    update() {
      this.$store.commit(MUTATION.SET_SPELLCASTING, this.spellcasting);
    },
    overrideColor(active) {
      return active ? 'blue' : 'gray';
    },
    toggleOverride(prop) {
      this.spellcasting[prop].override = !this.spellcasting[prop].override;
      this.update();
    },
    slotLevel(level) {
      return level === 0 ? 'Cantrip' : `${N2W.toOrdinal(level)} level`;
    },
    spellsByLevel(level) {
      return this.spells.filter((s) => s.level === level);
    },
    knownSpellsAtLevel(level) {
      const spells = this.$store.state.spells.ALL;
      return this.spellcasting.standard.filter(
        (id) => spells[id].level === level
      );
    },
    updateSpells(val, level) {
      const spells = this.$store.state.spells.ALL;

      for (const id of val) {
        if (this.spellcasting.standard.indexOf(id) === -1) {
          this.spellcasting.standard.push(id);
        }
      }
      // deletions need to be handled too
      for (const idx in this.spellcasting.standard) {
        // check that it's the right level
        const spellId = this.spellcasting.standard[idx];
        const spellLevel = spells[spellId].level;

        if (
          spellLevel === level &&
          val.indexOf(this.spellcasting.standard[idx]) === -1
        ) {
          this.spellcasting.standard.splice(idx, 1);
        }
      }
      this.update();
    },
    addNewAtWill() {
      this.spellcasting.atWill.push({
        id: uuidv4(),
        count: 1,
        rate: AT_WILL_DEFAULT_RATES.DAY,
        spells: [],
      });
      this.update();
    },
    removeAtWill(index) {
      this.spellcasting.atWill.splice(index, 1);
      this.update();
    },
  },
};
</script>
