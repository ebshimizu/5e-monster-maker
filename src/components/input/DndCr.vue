<template>
  <v-footer app padless>
    <v-card flat tile width="100%">
      <v-card-title class="blue-grey darken-1 pa-2">
        <span class="big overline">ESTIMATED CR</span>
        <span class="text-h3 ml-2">{{ estimatedCR.cr }}</span>
        <v-divider class="mx-2" vertical></v-divider>
        <div class="split">
          <div class="top">
            <span class="small overline">Offensive CR</span>
            <span class="text-h5 ml-2 cr">{{ offensiveCR.cr }}</span>
          </div>
          <v-divider></v-divider>
          <div class="bot">
            <span class="overline">Defensive CR</span>
            <span class="text-h5 ml-2 cr">{{ defensiveCR.cr }}</span>
          </div>
        </div>
        <v-divider class="mx-2" vertical></v-divider>
        <div class="split chips">
          <div class="top">
            <v-menu
              :close-on-content-click="false"
              open-on-hover
              :close-delay="crMenuCloseDelay"
              top
              eager
              offset-y
              nudge-top="5px"
              :max-height="crMenuMaxHeight"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-chip
                  small
                  v-on="on"
                  v-bind="attrs"
                  class="ma-2"
                  color="red darken-4"
                >
                  <v-avatar left
                    ><v-icon size="18">mdi-sword-cross</v-icon></v-avatar
                  >
                  {{ Math.round(damagePerRound) }} (CR {{ damageCR.cr }})
                </v-chip>
              </template>
              <v-card width="350px" class="mx-auto" outlined>
                <v-card-title
                  >{{ Math.round(damagePerRound) }} Average Damage (3
                  Rounds)</v-card-title
                >
                <v-card-subtitle
                  >CR {{ damageCR.cr }}: {{ damageCR.dprMin }} -
                  {{ damageCR.dprMax }}</v-card-subtitle
                >
                <v-tabs
                  v-model="dprTab"
                  background-color="red darken-4"
                  color="white"
                  class="elevation-2"
                  fixed-tabs
                >
                  <v-tab v-for="(round, idx) in actionSequence" :key="idx">
                    Round {{ idx + 1 }}
                  </v-tab>
                </v-tabs>

                <v-tabs-items v-model="dprTab">
                  <v-tab-item v-for="(round, idx) in actionSequence" :key="idx">
                    <v-list>
                      <v-list-item
                        ><v-list-item-content
                          ><v-list-item-title class="overline"
                            >{{ round.totalDamage }} Total
                            Damage</v-list-item-title
                          ></v-list-item-content
                        ></v-list-item
                      >
                      <v-divider></v-divider>
                      <v-list-item
                        v-for="(action, idx) in round.actions"
                        :key="`${action.name}-${action.type}-${idx}`"
                      >
                        <v-list-item-avatar
                          :color="actionTypeColor(action.type)"
                          >{{ action.damage }}</v-list-item-avatar
                        >
                        <v-list-item-content
                          ><v-list-item-title>{{
                            action.name
                          }}</v-list-item-title
                          ><v-list-item-subtitle>{{
                            action.type
                          }}</v-list-item-subtitle></v-list-item-content
                        >
                      </v-list-item>
                    </v-list>
                  </v-tab-item>
                </v-tabs-items>
              </v-card>
            </v-menu>
            <v-menu
              :close-on-content-click="false"
              open-on-hover
              :close-delay="crMenuCloseDelay"
              top
              eager
              offset-y
              nudge-top="5px"
              :max-height="crMenuMaxHeight"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-chip
                  small
                  v-on="on"
                  v-bind="attrs"
                  class="ma-2"
                  :color="attackChipColor"
                >
                  <v-avatar left
                    ><v-icon size="18">mdi-bullseye-arrow</v-icon></v-avatar
                  >
                  {{ maxAttackRender }} ({{ attackCRDelta }} CR)
                </v-chip>
              </template>
              <v-card width="350px" class="mx-auto" outlined>
                <v-card-title
                  >{{ maxAttackRender }} Max. Attack Bonus</v-card-title
                >
                <v-card-subtitle>{{ attackCRExplain }}</v-card-subtitle>
                <v-divider></v-divider>
                <v-list>
                  <v-list-item
                    v-for="(action, idx) in filteredToHitActions"
                    :key="`${action.name}-${action.type}-${idx}`"
                  >
                    <v-list-item-avatar :color="actionTypeColor(action.type)">{{
                      action.toHitRender
                    }}</v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{ action.name }}</v-list-item-title>
                      <v-list-item-subtitle>{{
                        action.type
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content class="subtitle-2"
                      >{{
                        toHitActions.length - filteredToHitActions.length
                      }}
                      Actions with +0 or less</v-list-item-content
                    >
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
            <v-menu
              :close-on-content-click="false"
              open-on-hover
              :close-delay="crMenuCloseDelay"
              top
              eager
              offset-y
              nudge-top="5px"
              :max-height="crMenuMaxHeight"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-chip
                  small
                  v-on="on"
                  v-bind="attrs"
                  class="ma-2"
                  :color="dcChipColor"
                >
                  <v-avatar left
                    ><v-icon size="18">mdi-auto-fix</v-icon></v-avatar
                  >
                  {{ maxDC }} ({{ attackCRDelta }} CR)
                </v-chip>
              </template>
              <v-card width="350px" class="mx-auto" outlined>
                <v-card-title>DC {{ maxDC }} Max. Save</v-card-title>
                <v-card-subtitle>{{ dcExplain }}</v-card-subtitle>
                <v-divider></v-divider>
                <v-list>
                  <v-list-item
                    v-for="(action, idx) in filteredDcActions"
                    :key="`${action.name}-${action.type}-${idx}`"
                  >
                    <v-list-item-avatar :color="actionTypeColor(action.type)">{{
                      action.save
                    }}</v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{ action.name }}</v-list-item-title>
                      <v-list-item-subtitle>{{
                        action.type
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content class="subtitle-2"
                      >{{ dcActions.length - filteredDcActions.length }} Actions
                      with DC 0 or less</v-list-item-content
                    >
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </div>
          <div class="bot">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-chip small v-on="on" class="ma-2" color="green darken-2">
                  <v-avatar left
                    ><v-icon size="18">mdi-hospital</v-icon></v-avatar
                  >
                  {{ Math.round(ehp) }} (CR {{ hpCR.cr }})
                </v-chip>
              </template>
              Effective HP
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-chip small v-on="on" class="ma-2" color="green darken-2">
                  <v-avatar left
                    ><v-icon size="18">mdi-shield</v-icon></v-avatar
                  >
                  {{ Math.round(eac) }} ({{ acCRDelta }} CR)
                </v-chip>
              </template>
              Effective AC
            </v-tooltip>
          </div>
        </div>
      </v-card-title>
      <v-card-text class="py-1 white--text text-center">
        v{{ $store.getters.majorVersion }}.{{
          $store.getters.minorVersion
        }}
        build {{ $store.state.buildNumber }} | Created by
        <strong>Falindrith</strong> |
        <v-btn
          icon
          class="mx-1"
          @click="openLink('https://twitter.com/falindrith')"
          ><v-icon>mdi-twitter</v-icon></v-btn
        >
        <v-btn
          icon
          class="mr-1"
          @click="openLink('https://github.com/ebshimizu/5e-monster-maker')"
          ><v-icon size="24px">mdi-github</v-icon></v-btn
        >
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              icon
              @click="openLink('https://ko-fi.com/E1E2KHZ3')"
              ><v-avatar size="36px"
                ><img src="../../assets/ko-fi-icon.png"/></v-avatar
            ></v-btn>
          </template>
          Tip Jar
        </v-tooltip>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
import { MUTATION } from '../../data/ACTIONS';
import {
  getCRByDamage,
  getCRByAttack,
  getCRByDC,
  getCRByNumber,
  getCRByHP,
  getCRByAC,
  CR,
} from '../../data/CR';
import { renderBonus } from '../util';
import _ from 'lodash';

// unsure if i'll move this into util at some point
const ACTION_COLOR = {
  Attack: 'red darken-4',
  Multiattack: 'red darken-4',
  Action: 'amber darken-4',
  Trait: 'teal darken-4',
  Legendary: 'cyan darken-4',
  Spell: 'deep-purple darken-4',
};

// CR's kinda complicated. The app will be able to work in multiple modes:
// - manual CR input
// - automatic CR estimation (manual proficiency modifier)
// - automatic CR estimation (alternate computation)
// the estimated CR will be output in this panel as well
export default {
  name: 'DndCr',
  data() {
    return {
      dprTab: null,
      crMenuCloseDelay: 100,
      crMenuMaxHeight: '550px',
    };
  },
  computed: {
    proficiency: {
      get() {
        return this.$store.state.monster.proficiency;
      },
      set(value) {
        this.$store.commit(MUTATION.SET_SIMPLE_PROP, {
          key: 'proficiency',
          value: parseInt(value),
        });
      },
    },
    monster() {
      return this.$store.state.monster;
    },
    attackInfo() {
      return this.$store.getters.attackInfo;
    },
    estimatedCR() {
      return getCRByNumber(
        (this.offensiveCR.numeric + this.defensiveCR.numeric) / 2
      );
    },
    // an array of the highest damage actions/traits per round for up to 5 rounds
    actionSequence() {
      // the operations done here are actually destructive. to avoid changing
      // the info object, we're gonna clone it for this calculation.
      const data = _.cloneDeep(this.attackInfo);

      // we can actually pre-compute legendary action damage since it's basically the same each round under most circumstances
      // and if not, well, this tool might not be complex enough to handle you my dude
      const legendaryRound = this.legendaryCombo(
        data.legendary,
        data.legendaryCount
      );

      // for 3 rounds
      const sequence = [];
      for (let i = 0; i < 3; i++) {
        const round = { totalDamage: 0, actions: [] };

        // check highest damage actions and attacks
        const action = this.highestDamage(data);

        // if action is null, we don't have anything to do here, but traits might still work
        if (action) {
          // update the round
          round.actions.push(action);
          round.totalDamage += action.damage;

          // if the action is limited use or rechargeable, adjust the limited use and remove if 0
          // recharge abilities just get removed straight up since it's a bit random.
          if ('limited' in action && action.limited) {
            action.uses -= 1;

            if (action.uses <= 0) {
              // we pulled action 0 (sorted, guaranteed from highestDamage function)
              // attacks can't be limited use so this has to be an action if limited exists
              data.actions.splice(0, 1);
            }
          } else if (action.type === 'Spell') {
            // spells just get deleted byeeeeee
            data.spells.splice(0, 1);
          }
        }

        // trait damage
        // assume stuff that adds bonus damage (like a smite) applies once per round (which might low-ball this estimate),
        // but is much simpler to handle than doing once per attack or somethin
        for (const trait of data.traits) {
          if (trait.damage > 0) {
            // don't need to check inclusion, handled by attackInfo
            round.actions.push(trait);
            round.totalDamage += trait.damage;

            if (trait.limited && trait.uses > 0) {
              trait.uses -= 1;
              trait.remove = trait.uses <= 0;
            }
          }
        }
        data.traits = data.traits.filter((t) => !t.remove);

        // legendary actions
        // this gets put on top of everything in a round, assumes the most damaging combination of abilities is used each round
        round.totalDamage += legendaryRound.totalDamage;
        round.actions = round.actions.concat(legendaryRound.actions);

        sequence.push(round);
      }

      return sequence;
    },
    damagePerRound() {
      if (this.actionSequence.length < 3) return 0;

      let sum = 0;
      for (let i = 0; i < 3; i++) {
        sum += this.actionSequence[i].totalDamage;
      }

      return sum / 3;
    },
    dcActions() {
      // return a sorted all actions list
      const allActions = [].concat(
        this.attackInfo.attacks,
        this.attackInfo.actions,
        this.attackInfo.traits,
        this.attackInfo.legendary
      );

      // inject the spellcasting mod if it exists
      if (this.$store.getters.isSpellcaster) {
        allActions.push({
          name: 'Spell Save DC',
          type: 'Spell',
          save: this.$store.getters.spellSave,
        });
      }

      allActions.sort((a, b) => {
        return b.save - a.save;
      });

      // filter to positive to hits?
      return allActions;
    },
    filteredDcActions() {
      return this.dcActions.filter((a) => a.save > 0);
    },
    maxDC() {
      if (this.dcActions.length === 0) return 0;

      return this.dcActions[0].save;
    },
    toHitActions() {
      // return a sorted all actions list
      const allActions = [].concat(
        this.attackInfo.attacks,
        this.attackInfo.actions,
        this.attackInfo.traits,
        this.attackInfo.legendary
      );

      // inject the spellcasting mod if it exists
      if (this.$store.getters.isSpellcaster) {
        allActions.push({
          name: 'Spell Attack Modifier',
          type: 'Spell',
          toHit: this.$store.getters.spellAttackModifier,
        });
      }

      allActions.sort((a, b) => {
        return b.toHit - a.toHit;
      });

      // filter to positive to hits?
      return allActions;
    },
    filteredToHitActions() {
      return this.toHitActions
        .map((a) => {
          return { toHitRender: renderBonus(a.toHit), ...a };
        })
        .filter((a) => a.toHit > 0);
    },
    maxAttack() {
      // this is already sorted
      if (this.toHitActions.length === 0) return 0;

      return this.toHitActions[0].toHit;
    },
    maxAttackRender() {
      return renderBonus(this.maxAttack);
    },
    offensiveCR() {
      const damageCRStep = this.damageCR.index;

      // branching cases based on higher dc or attack mod
      let stepDelta = 0;
      if (this.useDC) {
        // DC
        // get the delta between the DC suggested by damage output and the max DC for this creature
        stepDelta = this.maxDC - this.damageCR.saveDc;
      } else {
        // get delta between the attack mod suggested by damage output and the max bonus for this creature
        stepDelta = this.maxAttack - this.damageCR.attack;
      }

      stepDelta /= 2;

      // final cr is then
      // really need a "towards 0" function
      const offensiveStep =
        damageCRStep +
        (stepDelta < 0 ? Math.ceil(stepDelta) : Math.floor(stepDelta));

      return CR[Math.max(0, Math.min(CR.length, offensiveStep))];
    },
    useDC() {
      return this.dcCR.numeric >= this.attackCR.numeric;
    },
    dcCR() {
      return getCRByDC(this.maxDC);
    },
    attackCR() {
      return getCRByAttack(this.maxAttack);
    },
    attackCRDelta() {
      const delta = this.offensiveCR.numeric - this.damageCR.numeric;
      return renderBonus(delta.toLocaleString());
    },
    attackCRExplain() {
      if (this.useDC) return `Inactive. Save DC has a higher expected CR.`;

      return `Offensive CR ${this.attackCRDelta} (Attack Bonus Delta: ${this
        .attackCR.attack - this.offensiveCR.attack})`;
    },
    dcExplain() {
      if (!this.useDC) return 'Inactive. Attack Bonus has a higher expected CR';

      return `Offensive CR ${this.attackCRDelta} (Save DC Delta: ${this.dcCR
        .saveDc - this.offensiveCR.saveDc})`;
    },
    damageCR() {
      return getCRByDamage(this.damagePerRound);
    },
    attackChipColor() {
      return !this.useDC ? 'red darken-4' : 'gray darken-1';
    },
    dcChipColor() {
      return this.useDC ? 'red darken-4' : 'gray darken-1';
    },
    ehp() {
      // ehp actually kinda needs a CR estimate first, so assuming we don't have that, we will base expected CR on attacks
      // ok so use the overall offensive CR for anything that requires it here
      const baseHP = this.$store.getters.avgHp;
      let ehp = baseHP;

      // built-in adjustments
      // resistances and immunities
      // combine the multipliers
      const resMult =
        this.resMultiplier(this.offensiveCR.numeric) *
        this.immuneMultiplier(this.offensiveCR.numeric) *
        this.vulnMultiplier();
      ehp *= resMult;

      // get the trait and action adjustments. These will happen iteratively after conditions
      // addition happens at the end, so this is a two pass operation
      for (const action of this.monster.actions) {
        if (action.crAnnotation.include) {
          ehp *= action.crAnnotation.ehpMultiplier;
        }
      }

      for (const trait of this.monster.traits) {
        if (trait.crAnnotation.include) {
          ehp *= trait.crAnnotation.ehpMultiplier;
        }
      }

      // ok now add
      for (const action of this.monster.actions) {
        if (action.crAnnotation.include) {
          ehp += action.crAnnotation.ehpModifier;
        }
      }

      for (const trait of this.monster.traits) {
        if (trait.crAnnotation.include) {
          ehp += trait.crAnnotation.ehpModifier;
        }
      }

      return ehp;
    },
    eac() {
      // the beginning of this is at least easy
      const baseAC = this.monster.AC;

      // save modifiers
      // check for proficient or overridden
      const saveCount = Object.keys(this.monster.saves).filter((k) => {
        const save = this.monster.saves[k];
        return save.proficient || (save.override && save.overrideValue > 0);
      }).length;

      let eac = baseAC + this.saveACBonus(saveCount);

      // action and trait modifiers
      for (const action of this.monster.actions) {
        if (action.crAnnotation.include) {
          eac += action.crAnnotation.acModifier;
        }
      }

      for (const trait of this.monster.traits) {
        if (trait.crAnnotation.include) {
          eac += trait.crAnnotation.acModifier;
        }
      }

      return eac;
    },
    hpCR() {
      return getCRByHP(this.ehp);
    },
    acCR() {
      return getCRByAC(this.eac);
    },
    acCRDelta() {
      const delta = this.defensiveCR.numeric - this.hpCR.numeric;
      return renderBonus(delta.toLocaleString());
    },
    defensiveCR() {
      // so the actual cr is a lil funky here
      // first get the CR step suggested by ehp
      const ehpStep = this.hpCR.index;

      // then, get the delta between ehp's CR AC and the effective AC
      const acDelta = (this.eac - this.hpCR.ac) / 2;

      // adjust the cr step
      const defensiveStep =
        ehpStep + (acDelta < 0 ? Math.ceil(acDelta) : Math.floor(acDelta));

      // return the proper cr object, clamping to 0/CR max length
      return CR[Math.max(0, Math.min(CR.length - 1, defensiveStep))];
    },
  },
  methods: {
    openLink(url) {
      window.open(url);
    },
    highestDamage(data) {
      // check first element of actions, attacks, and spells return highest damage
      // but first validate that we have data to get
      const allActions = [].concat(data.attacks, data.actions, data.spells);

      if (allActions.length === 0) return null;

      allActions.sort((a, b) => {
        return b.damage - a.damage;
      });

      return allActions[0];
    },
    legendaryCombo(la, count) {
      const returnData = { totalDamage: 0, actions: [] };

      if (la.length === 0) return returnData;

      // returns the highest damage per round combo of actions
      // assuming everything can be used multiple times per round right now, ignoring limited use data (?)
      // find the highest cost item and associated damage
      // repeat until we run out of actions to take
      let currentActions = Array.from(la);
      while (count > 0 && currentActions.length > 0) {
        let highestCost = 1;
        let highestCostDamage = 0;

        // first, figure out if we have multi-cost items
        for (const action of currentActions) {
          if (action.cost >= highestCost) {
            highestCost = action.cost;
            if (action.damage > highestCostDamage) {
              highestCostDamage = action.damage;
            }
          }
        }

        // now that we know the highest remaining cost and the damage that's expected, check to see
        // if any lower cost items can match that damage
        const adjustedDamageActions = currentActions.map((a) => {
          return {
            adjustedDamage: a.damage * Math.floor(highestCost / a.cost),
            addCount: Math.floor(highestCost / a.cost),
            ...a,
          };
        });

        // sort descending and pick highest, adding a number of times consistent with cost
        adjustedDamageActions.sort(
          (a, b) => b.adjustedDamage - a.adjustedDamage
        );

        for (let i = 0; i < adjustedDamageActions[0].addCount; i++) {
          returnData.totalDamage += adjustedDamageActions[0].damage;
          returnData.actions.push(adjustedDamageActions[0]);
          count -= adjustedDamageActions[0].cost;
        }

        currentActions = currentActions.filter((a) => a.cost <= count);
      }

      return returnData;
    },
    resMultiplier(cr) {
      if (this.monster.resistances.length === 0) return 1;

      if (cr <= 4) return 2;
      if (cr <= 10) return 1.5;
      if (cr <= 16) return 1.25;

      return 1;
    },
    immuneMultiplier(cr) {
      if (this.monster.immunities.length === 0) return 1;

      if (cr <= 10) return 2;
      if (cr <= 16) return 1.5;

      return 1.25;
    },
    vulnMultiplier() {
      if (this.monster.vulnerabilities.length > 0) return 0.5;

      return 1;
    },
    saveACBonus(count) {
      if (count < 3) return 0;
      if (count < 5) return 2;

      return 4;
    },
    actionTypeColor(type) {
      // i kinda should make this an enum...
      return ACTION_COLOR[type];
    },
  },
};
</script>

<style scoped>
.big.overline {
  font-size: 1rem !important;
}

.small.overline {
  line-height: 25px;
}

.split {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.split.chips {
  align-items: flex-start;
}

.cr {
  width: 40px;
  text-align: right;
}

.split .top,
.split .bot {
  display: flex;
  align-items: center;
  height: 28px;
}
</style>
