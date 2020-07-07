<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <v-row no-gutters>
        <v-col cols="4">{{ attack.name }}</v-col>
        <v-col cols="8" class="text--secondary d-flex justify-end pr-2">{{
          summary
        }}</v-col>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row>
        <v-col cols="4"
          ><v-text-field label="Name" v-model="name"></v-text-field
        ></v-col>
        <v-col cols="1"
          ><v-text-field
            label="Targets"
            type="number"
            v-model="targets"
          ></v-text-field
        ></v-col>
        <v-col cols="3">
          <v-row no-gutters align="center">
            <v-col>
              <v-text-field
                label="To Hit"
                v-model="modifier"
                type="number"
                :disabled="!modifierOverride"
              ></v-text-field
            ></v-col>
            <v-col md="auto">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    x-small
                    :color="activeColor(modifierProf)"
                    v-on="on"
                    @click="modifierProf = !modifierProf"
                    class="ml-1"
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
                    :color="activeColor(modifierOverride)"
                    v-on="on"
                    @click="modifierOverride = !modifierOverride"
                    class="ml-1"
                    ><v-icon>mdi-hammer-wrench</v-icon></v-btn
                  >
                </template>
                Override Attack Modifier
              </v-tooltip>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="2"
          ><v-select
            label="Stat"
            :items="statTypes"
            v-model="modifierStat"
          ></v-select
        ></v-col>
        <v-col cols="2"
          ><v-text-field
            label="Effect DC"
            type="number"
            hint="Helps Estimate CR"
            v-model="save"
          ></v-text-field
        ></v-col>
        <v-col cols="4"
          ><v-select
            label="Range"
            :items="rangeTypes"
            v-model="distance"
          ></v-select
        ></v-col>
        <v-col cols="2"
          ><v-combobox
            label="Kind"
            :items="weaponTypes"
            v-model="kind"
          ></v-combobox
        ></v-col>
        <v-col cols="2" v-if="showReach"
          ><v-text-field
            label="Reach"
            suffix="ft."
            type="number"
            v-model="reach"
          ></v-text-field
        ></v-col>
        <v-col cols="2" v-if="showRange"
          ><v-text-field
            label="Close"
            suffix="ft."
            type="number"
            v-model="standard"
          ></v-text-field
        ></v-col>
        <v-col cols="2" v-if="showRange"
          ><v-text-field
            label="Long"
            suffix="ft."
            type="number"
            v-model="long"
          ></v-text-field
        ></v-col>
        <v-col cols="12">
          <v-card outlined>
            <v-card-title class="overline pt-2 px-2 pb-0 mb-n4"
              >Primary Damage</v-card-title
            >
            <v-row class="px-2">
              <v-col cols="2"
                ><v-text-field
                  label="Dice"
                  type="number"
                  min="0"
                  v-model="primaryCount"
                ></v-text-field
              ></v-col>
              <v-col cols="2"
                ><v-select
                  label="Type"
                  :items="diceTypes"
                  v-model="primaryDice"
                ></v-select
              ></v-col>
              <v-col cols="3"
                ><v-combobox
                  label="Damage"
                  :items="damageTypes"
                  v-model="primaryType"
                ></v-combobox
              ></v-col>
              <v-col cols="3">
                <v-row no-gutters align="center">
                  <v-col>
                    <v-text-field
                      label="Damage Bonus"
                      v-model="primaryBonus"
                      :disabled="!primaryOverride"
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col md="auto">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          fab
                          x-small
                          :color="activeColor(primaryOverride)"
                          v-on="on"
                          @click="primaryOverride = !primaryOverride"
                          class="ml-1"
                          ><v-icon>mdi-hammer-wrench</v-icon></v-btn
                        >
                      </template>
                      Override Damage Bonus
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="2"
                ><v-select
                  label="Stat"
                  :items="statTypes"
                  v-model="primaryStat"
                ></v-select
              ></v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card outlined>
            <v-card-title class="overline pt-2 px-2 pb-0 mb-2"
              >Additional Damage</v-card-title
            >
            <v-card-subtitle class="px-2 mb-n4"
              >Extra damage applied every hit</v-card-subtitle
            >
            <v-row
              class="px-2"
              align="center"
              v-for="(item, index) in attack.additionalDamage"
              :key="item.id"
            >
              <v-col cols="2"
                ><v-text-field
                  label="Dice"
                  type="number"
                  min="0"
                  :value="item.count"
                  @input="(val) => updateAdd(index, 'count', parseInt(val))"
                ></v-text-field
              ></v-col>
              <v-col cols="2"
                ><v-select
                  label="Type"
                  :items="diceTypes"
                  :value="item.dice"
                  @input="(val) => updateAdd(index, 'dice', val)"
                ></v-select
              ></v-col>
              <v-col cols="2"
                ><v-combobox
                  label="Damage"
                  :items="damageTypes"
                  :value="item.type"
                  @input="(val) => updateAdd(index, 'type', val)"
                ></v-combobox
              ></v-col>
              <v-col
                ><v-text-field
                  label="Notes"
                  hint="Conditions, restrictions, etc."
                  :value="item.note"
                  @input="(val) => updateAdd(index, 'note', val)"
                ></v-text-field
              ></v-col>
              <v-col cols="1">
                <v-btn fab x-small color="red" @click="removeAdd(index)"
                  ><v-icon>mdi-close</v-icon></v-btn
                >
              </v-col>
            </v-row>
            <v-card-actions>
              <v-btn text class="green" @click="addAdd">Add</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card outlined>
            <v-card-title class="overline pt-2 px-2 pb-0 mb-2"
              >Conditional Damage</v-card-title
            >
            <v-card-subtitle class="px-2 mb-n4"
              >Replaces the Primary Damage when the Condition is met (e.g.
              Versatile Weapons)</v-card-subtitle
            >
            <v-row class="px-2" v-if="attack.alternateDamage.active">
              <v-col cols="12"
                ><v-text-field
                  label="Condition"
                  hint="Example: If used with two hands to make a melee attack"
                  v-model="alternateCondition"
                ></v-text-field
              ></v-col>
              <v-col cols="2"
                ><v-text-field
                  label="Dice"
                  type="number"
                  min="0"
                  v-model="alternateCount"
                ></v-text-field
              ></v-col>
              <v-col cols="3"
                ><v-select
                  label="Type"
                  :items="diceTypes"
                  v-model="alternateDice"
                ></v-select
              ></v-col>
              <v-col cols="2"
                ><v-combobox
                  label="Damage"
                  :items="damageTypes"
                  v-model="alternateType"
                ></v-combobox
              ></v-col>
              <v-col cols="3">
                <v-row no-gutters align="center">
                  <v-col>
                    <v-text-field
                      label="Damage Bonus"
                      v-model="alternateBonus"
                      :disabled="!alternateOverride"
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col md="auto">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          fab
                          x-small
                          :color="activeColor(alternateOverride)"
                          v-on="on"
                          @click="alternateOverride = !alternateOverride"
                          class="ml-1"
                          ><v-icon>mdi-hammer-wrench</v-icon></v-btn
                        >
                      </template>
                      Override Damage Bonus
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="2"
                ><v-select
                  label="Stat"
                  :items="statTypes"
                  v-model="alternateStat"
                ></v-select
              ></v-col>
            </v-row>
            <v-card-actions>
              <v-btn text @click="toggleConditional" class="blue">{{
                conditionalButtonText
              }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-textarea
            outlined
            label="Additional Description or Effects"
            v-model="description"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-btn block small color="red" @click="deleteAttack">Delete</v-btn>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { RANGE, RANGE_OPTIONS, KIND_OPTIONS } from '../../data/ATTACK';
import { ATTACK_TYPE_SELECT } from '../../data/DAMAGE_TYPE';
import { DICE_SELECT } from '../../data/DICE';
import { STAT_SELECT } from '../../data/STAT';
import { MUTATION } from '../../data/ACTIONS';
import { statModifier, newAttackAdditionalDamage } from '../util';
import _ from 'lodash';

export default {
  name: 'AttackPanel',
  props: ['attack', 'index'],
  data() {
    return {
      rangeTypes: RANGE_OPTIONS,
      diceTypes: DICE_SELECT,
      damageTypes: ATTACK_TYPE_SELECT,
      statTypes: STAT_SELECT,
      weaponTypes: KIND_OPTIONS,
    };
  },
  watch: {
    attack: function() {
      console.log('watcher update');
      this.update();
    },
  },
  computed: {
    name: {
      get() {
        return this.attack.name;
      },
      set(value) {
        this.attack.name = value;
        this.update();
      },
    },
    description: {
      get() {
        return this.attack.description;
      },
      set(value) {
        this.attack.description = value;
        this.update();
      },
    },
    save: {
      get() {
        return this.attack.save;
      },
      set(value) {
        this.attack.save = parseInt(value);
        this.update();
      },
    },
    kind: {
      get() {
        return this.attack.kind;
      },
      set(value) {
        this.attack.kind = value;
        this.update();
      },
    },
    distance: {
      get() {
        return this.attack.distance;
      },
      set(value) {
        this.attack.distance = value;
        this.update();
      },
    },
    reach: {
      get() {
        return this.attack.range.reach;
      },
      set(value) {
        this.attack.range.reach = parseInt(value);
        this.update();
      },
    },
    standard: {
      get() {
        return this.attack.range.standard;
      },
      set(value) {
        this.attack.range.standard = parseInt(value);
        this.update();
      },
    },
    long: {
      get() {
        return this.attack.range.long;
      },
      set(value) {
        this.attack.range.long = parseInt(value);
        this.update();
      },
    },
    targets: {
      get() {
        return this.attack.targets;
      },
      set(value) {
        this.attack.targets = parseInt(value);
        this.update();
      },
    },
    modifier: {
      get() {
        if (!this.attack.modifier.override) {
          // compute automatically
          return this.$store.getters.toHitBonus(
            this.attack.modifier.stat,
            this.attack.modifier.proficient
          );
        } else {
          return this.attack.modifier.overrideValue;
        }
      },
      set(value) {
        if (this.attack.modifier.override) {
          this.attack.modifier.overrideValue = parseInt(value);
          this.update();
        }
      },
    },
    modifierStat: {
      get() {
        return this.attack.modifier.stat;
      },
      set(value) {
        this.attack.modifier.stat = value;
        this.update();
      },
    },
    modifierProf: {
      get() {
        return this.attack.modifier.proficient;
      },
      set(value) {
        this.attack.modifier.proficient = value;
        this.update();
      },
    },
    modifierOverride: {
      get() {
        return this.attack.modifier.override;
      },
      set(value) {
        this.attack.modifier.override = value;
        this.update();
      },
    },
    primaryCount: {
      get() {
        return this.attack.damage.count;
      },
      set(value) {
        this.attack.damage.count = parseInt(value);
        this.update();
      },
    },
    primaryDice: {
      get() {
        return this.attack.damage.dice;
      },
      set(value) {
        this.attack.damage.dice = parseInt(value);
        this.update();
      },
    },
    primaryType: {
      get() {
        return this.attack.damage.type;
      },
      set(value) {
        this.attack.damage.type = value;
        this.update();
      },
    },
    primaryBonus: {
      get() {
        if (!this.attack.damage.modifier.override) {
          // compute automatically
          return statModifier(
            this.$store.state.monster.stats[this.attack.damage.modifier.stat]
          );
        } else {
          return this.attack.damage.modifier.overrideValue;
        }
      },
      set(value) {
        if (this.attack.damage.modifier.override) {
          this.attack.damage.modifier.overrideValue = parseInt(value);
          this.update();
        }
      },
    },
    primaryStat: {
      get() {
        return this.attack.damage.modifier.stat;
      },
      set(value) {
        this.attack.damage.modifier.stat = value;
        this.update();
      },
    },
    primaryOverride: {
      get() {
        return this.attack.damage.modifier.override;
      },
      set(value) {
        this.attack.damage.modifier.override = value;
        this.update();
      },
    },
    alternateCount: {
      get() {
        return this.attack.alternateDamage.count;
      },
      set(value) {
        this.attack.alternateDamage.count = parseInt(value);
        this.update();
      },
    },
    alternateDice: {
      get() {
        return this.attack.alternateDamage.dice;
      },
      set(value) {
        this.attack.alternateDamage.dice = parseInt(value);
        this.update();
      },
    },
    alternateType: {
      get() {
        return this.attack.alternateDamage.type;
      },
      set(value) {
        this.attack.alternateDamage.type = value;
        this.update();
      },
    },
    alternateBonus: {
      get() {
        if (!this.attack.alternateDamage.modifier.override) {
          // compute automatically
          return statModifier(
            this.$store.state.monster.stats[
              this.attack.alternateDamage.modifier.stat
            ]
          );
        } else {
          return this.attack.alternateDamage.modifier.overrideValue;
        }
      },
      set(value) {
        if (this.attack.alternateDamage.modifier.override) {
          this.attack.alternateDamage.modifier.overrideValue = parseInt(value);
          this.update();
        }
      },
    },
    alternateStat: {
      get() {
        return this.attack.alternateDamage.modifier.stat;
      },
      set(value) {
        this.attack.alternateDamage.modifier.stat = value;
        this.update();
      },
    },
    alternateOverride: {
      get() {
        return this.attack.alternateDamage.modifier.override;
      },
      set(value) {
        this.attack.alternateDamage.modifier.override = value;
        this.update();
      },
    },
    alternateCondition: {
      get() {
        return this.attack.alternateDamage.condition;
      },
      set(value) {
        this.attack.alternateDamage.condition = value;
        this.update();
      },
    },
    showReach() {
      return (
        this.attack.distance === RANGE.MELEE ||
        this.attack.distance === RANGE.BOTH
      );
    },
    showRange() {
      return (
        this.attack.distance === RANGE.RANGED ||
        this.attack.distance === RANGE.BOTH
      );
    },
    conditionalButtonText() {
      return this.attack.alternateDamage.active ? 'Disable' : 'Enable';
    },
    summary() {
      return `${this.$store.getters.expectedAttackDamage(
        this.attack
      )} Avg. Damage per Hit`;
    },
  },
  created() {
    this.update = _.debounce(this.debouncedUpdate, 250);
  },
  methods: {
    updateAdd(index, key, val) {
      this.attack.additionalDamage[index][key] = val;
      this.update();
    },
    removeAdd(index) {
      this.attack.additionalDamage.splice(index, 1);
      this.update();
    },
    addAdd() {
      this.attack.additionalDamage.push(newAttackAdditionalDamage());
      this.update();
    },
    toggleConditional() {
      this.attack.alternateDamage.active = !this.attack.alternateDamage.active;
      this.update();
    },
    debouncedUpdate() {
      this.$store.commit(MUTATION.SET_ATTACK, {
        attack: this.attack,
        index: this.index,
      });
    },
    deleteAttack() {
      this.$store.commit(MUTATION.DELETE_ATTACK, this.index);
    },
    activeColor(status) {
      return status ? 'blue' : 'grey';
    },
    toggleAttackOverride() {
      this.modifierOverride = !this.modifierOverride;
    },
  },
};
</script>
