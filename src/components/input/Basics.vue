<template>
  <v-expansion-panel>
    <v-expansion-panel-header>Basics</v-expansion-panel-header>
    <v-expansion-panel-content class="mt-4">
      <v-row align="center">
        <v-col cols="8" lg="8" md="12" sm="12"
          ><v-text-field dense label="Name" v-model="name"></v-text-field
        ></v-col>
        <v-col cols="2" lg="2" md="4" sm="6">
          <v-row no-gutters>
            <v-col>
              <v-text-field
                dense
                label="Proficiency Bonus"
                v-model.number="proficiency"
                :disabled="linkToCR"
                type="number"
              ></v-text-field
            ></v-col>
            <v-col md="auto">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    x-small
                    :color="overrideColor(linkToCR)"
                    v-on="on"
                    @click="toggleLinkToCR"
                    class="ml-1"
                    ><v-icon>mdi-link-variant</v-icon></v-btn
                  >
                </template>
                Link Proficiency to CR
              </v-tooltip>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="2" lg="2" md="4" sm="6">
          <v-select dense :items="crOptions" v-model="cr" label="CR">
          </v-select>
        </v-col>
        <v-col cols="2" lg="2" md="4" sm="6"
          ><v-select
            dense
            label="Size"
            :items="sizeItems"
            v-model="size"
          ></v-select
        ></v-col>
        <v-col cols="6" lg="6" md="6" sm="6"
          ><v-combobox
            dense
            label="Type"
            :items="creatureItems"
            v-model="type"
          ></v-combobox
        ></v-col>
        <v-col cols="4" lg="4" md="6" sm="6"
          ><v-combobox
            dense
            label="Alignment"
            :items="alignmentItems"
            v-model="alignment"
          ></v-combobox
        ></v-col>
        <v-col cols="2" lg="2" md="4" sm="6">
          <v-row>
            <v-col>
              <v-text-field
                dense
                label="AC"
                type="number"
                v-model="AC"
                :rules="[rules.number]"
              ></v-text-field
            ></v-col>
            <v-col md="auto">
              <v-menu>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab
                    x-small
                    color="blue"
                    v-bind="attrs"
                    v-on="on"
                    class="ml-1"
                    ><v-icon>mdi-menu-open</v-icon></v-btn
                  >
                </template>
                <v-list>
                  <v-list-item @click="setAcFromCr"
                    ><v-list-item-title
                      >Set AC Based on CR</v-list-item-title
                    ></v-list-item
                  >
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="3" lg="3" md="8" sm="6"
          ><v-text-field
            dense
            label="AC Type"
            v-model="ACType"
            hint="Or AC Notes"
          ></v-text-field
        ></v-col>
        <v-col cols="3" lg="3" md="4" sm="6">
          <v-row>
            <v-col>
              <v-text-field
                dense
                label="HD Count"
                type="number"
                v-model="HD"
                hint="Number of Dice"
                :rules="[rules.number]"
              ></v-text-field
            ></v-col>
            <v-col md="auto">
              <v-menu>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    fab
                    x-small
                    color="blue"
                    v-bind="attrs"
                    v-on="on"
                    class="ml-1"
                    ><v-icon>mdi-menu-open</v-icon></v-btn
                  >
                </template>
                <v-list>
                  <v-list-item @click="setHpFromCR"
                    ><v-list-item-title
                      >Set HP Based on CR</v-list-item-title
                    ></v-list-item
                  >
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="2" lg="2" md="4" sm="6"
          ><v-row>
            <v-col
              ><v-select
                dense
                label="HD Type"
                :items="diceItems"
                :disabled="linkHdToSize"
                v-model="HDType"
              ></v-select
            ></v-col>
            <v-col md="auto">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    x-small
                    :color="overrideColor(linkHdToSize)"
                    v-on="on"
                    @click="toggleLinkHdToSize"
                    class="ml-1"
                    ><v-icon>mdi-link-variant</v-icon></v-btn
                  >
                </template>
                Link HD Type to Size
              </v-tooltip>
            </v-col>
          </v-row></v-col
        >
        <v-col cols="2" lg="2" md="4" sm="6"
          ><v-row no-gutters>
            <v-col>
              <v-text-field
                dense
                label="HP Modifier"
                type="number"
                v-model.number="HPModifier"
                :disabled="linkHpToHd"
              ></v-text-field
            ></v-col>
            <v-col md="auto">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    x-small
                    :color="overrideColor(linkHpToHd)"
                    v-on="on"
                    @click="toggleLinkHpToHd"
                    class="ml-1"
                    ><v-icon>mdi-link-variant</v-icon></v-btn
                  >
                </template>
                Link HP Modifier to HD and CON
              </v-tooltip>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="2" md="2" sm="4"
          ><v-text-field
            dense
            label="STR"
            type="number"
            min="0"
            v-model.number="STR"
            hint="Strength Score"
            :rules="[rules.number]"
          ></v-text-field
        ></v-col>
        <v-col cols="2" md="2" sm="4"
          ><v-text-field
            dense
            label="DEX"
            type="number"
            min="0"
            v-model.number="DEX"
            hint="Dexterity Score"
            :rules="[rules.number]"
          ></v-text-field
        ></v-col>
        <v-col cols="2" md="2" sm="4"
          ><v-text-field
            dense
            label="CON"
            type="number"
            min="0"
            v-model.number="CON"
            hint="Constitution Score"
            :rules="[rules.number]"
          ></v-text-field
        ></v-col>
        <v-col cols="2" md="2" sm="4"
          ><v-text-field
            dense
            label="INT"
            type="number"
            min="0"
            v-model.number="INT"
            hint="Intelligence Score"
            :rules="[rules.number]"
          ></v-text-field
        ></v-col>
        <v-col cols="2" md="2" sm="4"
          ><v-text-field
            dense
            label="WIS"
            type="number"
            min="0"
            v-model.number="WIS"
            hint="Wisdom Score"
            :rules="[rules.number]"
          ></v-text-field
        ></v-col>
        <v-col cols="2" md="2" sm="4"
          ><v-text-field
            dense
            label="CHA"
            type="number"
            min="0"
            v-model.number="CHA"
            hint="Charisma Score"
            :rules="[rules.number]"
          ></v-text-field
        ></v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { MUTATION } from '../../data/ACTIONS';
import { DICE_SELECT } from '../../data/DICE';
import SIZE, { HD_FOR_SIZE } from '../../data/SIZE';
import TYPE from '../../data/TYPE';
import ALIGNMENT from '../../data/ALIGNMENT';
import { isNumber, statModifier } from '../util';
import { CR, CR_SELECT } from '../../data/CR';

export default {
  name: 'Basics',
  data() {
    return {
      rules: {
        number: isNumber,
      },
      diceItems: DICE_SELECT,
      sizeItems: SIZE,
      creatureItems: TYPE,
      alignmentItems: ALIGNMENT,
      crOptions: CR_SELECT,
      linkToCR: true,
      linkHpToHd: true,
      linkHdToSize: true,
    };
  },
  computed: {
    name: {
      get() {
        return this.$store.state.monster.name;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SIMPLE_PROP, { key: 'name', value });
      },
    },
    cr: {
      get() {
        return this.$store.state.monster.CR;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SIMPLE_PROP, { key: 'CR', value });

        if (this.linkToCR) {
          this.proficiency = CR[value].proficiency;
        }
      },
    },
    proficiency: {
      get() {
        return this.$store.state.monster.proficiency;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SIMPLE_PROP, {
          key: 'proficiency',
          value,
        });
      },
    },
    type: {
      get() {
        return this.$store.state.monster.type;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SIMPLE_PROP, { key: 'type', value });
      },
    },
    size: {
      get() {
        return this.$store.state.monster.size;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SIMPLE_PROP, { key: 'size', value });

        if (this.linkHdToSize) this.updateHd();
      },
    },
    alignment: {
      get() {
        return this.$store.state.monster.alignment;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SIMPLE_PROP, {
          key: 'alignment',
          value,
        });
      },
    },
    AC: {
      get() {
        return this.$store.state.monster.AC;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SIMPLE_PROP, {
          key: 'AC',
          value: parseInt(value),
        });
      },
    },
    ACType: {
      get() {
        return this.$store.state.monster.ACType;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SIMPLE_PROP, { key: 'ACType', value });
      },
    },
    HD: {
      get() {
        return this.$store.state.monster.HP.HD;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_HP_PROP, {
          key: 'HD',
          value: parseInt(value),
        });

        if (this.linkHpToHd) {
          this.updateHPModifier();
        }
      },
    },
    HDType: {
      get() {
        return this.$store.state.monster.HP.type;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_HP_PROP, { key: 'type', value });
      },
    },
    HPModifier: {
      get() {
        return this.$store.state.monster.HP.modifier;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_HP_PROP, {
          key: 'modifier',
          value: parseInt(value),
        });
      },
    },
    STR: {
      get() {
        return this.$store.state.monster.stats.STR;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_STAT, { key: 'STR', value });
      },
    },
    DEX: {
      get() {
        return this.$store.state.monster.stats.DEX;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_STAT, { key: 'DEX', value });
      },
    },
    CON: {
      get() {
        return this.$store.state.monster.stats.CON;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_STAT, { key: 'CON', value });

        if (this.linkHpToHd) {
          this.updateHPModifier();
        }
      },
    },
    INT: {
      get() {
        return this.$store.state.monster.stats.INT;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_STAT, { key: 'INT', value });
      },
    },
    WIS: {
      get() {
        return this.$store.state.monster.stats.WIS;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_STAT, { key: 'WIS', value });
      },
    },
    CHA: {
      get() {
        return this.$store.state.monster.stats.CHA;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_STAT, { key: 'CHA', value });
      },
    },
  },
  methods: {
    overrideColor(status) {
      return status ? 'blue' : 'gray';
    },
    toggleLinkToCR() {
      this.linkToCR = !this.linkToCR;

      if (this.linkToCR) {
        this.proficiency = CR[this.cr].proficiency;
      }
    },
    updateHPModifier() {
      this.HPModifier = statModifier(this.CON) * this.HD;
    },
    toggleLinkHpToHd() {
      this.linkHpToHd = !this.linkHpToHd;

      if (this.linkHpToHd) this.updateHPModifier();
    },
    updateHd() {
      this.HDType = HD_FOR_SIZE[this.size];
    },
    toggleLinkHdToSize() {
      this.linkHdToSize = !this.linkHdToSize;

      if (this.linkHdToSize) this.updateHd();
    },
    setHpFromCR() {
      const crObj = CR[this.cr];
      const hpMax = crObj.hpMax;
      const gainPerHd = (this.HDType + 1) / 2 + statModifier(this.CON);

      const hd = Math.max(Math.floor(hpMax / gainPerHd), 1);
      const modifier = hd * statModifier(this.CON);

      this.HD = hd;
      this.HPModifier = modifier;
    },
    setAcFromCr() {
      this.AC = CR[this.cr].ac;
    }
  },
};
</script>
