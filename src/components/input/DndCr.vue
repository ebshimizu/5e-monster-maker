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
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-chip small v-on="on" class="ma-2" color="red darken-4">
                  <v-avatar left
                    ><v-icon size="18">mdi-sword-cross</v-icon></v-avatar
                  >
                  {{ Math.round(damagePerRound) }} (CR {{ damageCR.cr }})
                </v-chip>
              </template>
              Avg. Damage over Three Rounds
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-chip small v-on="on" class="ma-2" color="red darken-4">
                  <v-avatar left
                    ><v-icon size="18">mdi-bullseye-arrow</v-icon></v-avatar
                  >
                  {{ maxAttackRender }} (CR {{ attackCR.cr }})
                </v-chip>
              </template>
              Max. Attack Bonus
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-chip small v-on="on" class="ma-2" color="red darken-4">
                  <v-avatar left
                    ><v-icon size="18">mdi-auto-fix</v-icon></v-avatar
                  >
                  {{ maxDC }} (CR {{ dcCR.cr }})
                </v-chip>
              </template>
              Max. Save DC
            </v-tooltip>
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
                  {{ Math.round(eac) }} (CR {{ acCR.cr }})
                </v-chip>
              </template>
              Effective AC
            </v-tooltip>
          </div>
        </div>
      </v-card-title>
      <v-card-text class="py-1 white--text text-center">
        v{{ $store.getters.majorVersion }} build
        {{ $store.state.buildNumber }} | Created by
        <strong>Falindrith</strong> |
        <v-btn
          icon
          class="mx-1"
          @click="openLink('https://twitter.com/falindrith')"
          ><v-icon>mdi-twitter</v-icon></v-btn
        >
        <v-btn
          icon
          @click="openLink('https://github.com/ebshimizu/5e-monster-maker')"
          ><v-icon size="24px">mdi-github</v-icon></v-btn
        >
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
} from '../../data/CR';
import { renderBonus } from '../util';

// CR's kinda complicated. The app will be able to work in multiple modes:
// - manual CR input
// - automatic CR estimation (manual proficiency modifier)
// - automatic CR estimation (alternate computation)
// the estimated CR will be output in this panel as well
export default {
  name: 'DndCr',
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
      const data = this.attackInfo;

      // we can actually pre-compute legendary action damage since it's basically the same each round under most circumstances
      // and if not, well, this tool might not be complex enough to handle you my dude
      const legendaryRound = this.legendaryCombo(
        data.legendary,
        data.legendaryCount
      );
      legendaryRound.actions = legendaryRound.actions.map((a) => {
        return { type: 'legendary', ...a };
      });

      // for 5 rounds
      const sequence = [];
      for (let i = 0; i < 5; i++) {
        const round = { totalDamage: 0, actions: [] };

        // check highest damage actions and attacks
        const action = this.highestDamage(data);

        // if action is null, we don't have anything to do here, but traits might still work
        if (action) {
          // update the round
          round.actions.push({ type: 'action', ...action });
          round.totalDamage += action.damage;

          // if the action is limited use or rechargeable, adjust the limited use and remove if 0
          // recharge abilities just get removed straight up since it's a bit random.
          if (action.limited) {
            action.uses -= 1;

            if (action.uses <= 0) {
              // we pulled action 0 (sorted, guaranteed from highestDamage function)
              data.actions.splice(0, 1);
            }
          }
        }

        // trait damage
        // assume stuff that adds bonus damage (like a smite) applies once per round (which might low-ball this estimate),
        // but is much simpler to handle than doing once per attack or somethin
        for (const trait of data.traits) {
          // don't need to check inclusion, handled by attackInfo
          trait.remove = false;
          round.actions.push({ type: 'trait', ...trait });
          round.totalDamage += trait.damage;

          if (trait.limited && trait.uses > 0) {
            trait.uses -= 1;
            trait.remove = trait.uses <= 0;
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
    maxDC() {
      // check actions, traits, legendary actions, spellcasting, everything
      const spellDC = this.$store.getters.isSpellcaster
        ? this.$store.getters.spellSave
        : 0;
      const attackDC = this.attackInfo.attacks.reduce(
        (current, next) => Math.max(next.save, current),
        0
      );
      const actionDC = this.attackInfo.actions.reduce(
        (current, next) => Math.max(next.save, current),
        0
      );
      const traitDC = this.attackInfo.actions.reduce(
        (current, next) => Math.max(next.save, current),
        0
      );
      const legendaryDC = this.attackInfo.legendary.reduce(
        (current, next) => Math.max(next.save, current),
        0
      );

      return Math.max(spellDC, attackDC, actionDC, traitDC, legendaryDC);
    },
    maxAttack() {
      const spellModifier = this.$store.getters.isSpellcaster
        ? this.$store.getters.spellAttackModifier
        : 0;
      const attackModifier = this.attackInfo.attacks.reduce(
        (current, next) => Math.max(next.toHit, current),
        0
      );
      const actionModifier = this.attackInfo.actions.reduce(
        (current, next) => Math.max(next.toHit, current),
        0
      );
      const traitModifier = this.attackInfo.actions.reduce(
        (current, next) => Math.max(next.toHit, current),
        0
      );
      const legendaryModifier = this.attackInfo.legendary.reduce(
        (current, next) => Math.max(next.toHit, current),
        0
      );

      let standardModifier = Math.max(
        spellModifier,
        attackModifier,
        actionModifier,
        traitModifier,
        legendaryModifier
      );

      // some traits/actions have an attack modifier property
      for (const action of this.monster.actions) {
        if (action.crAnnotation.include) {
          standardModifier += action.crAnnotation.bonusModifier;
        }
      }

      for (const trait of this.monster.traits) {
        if (trait.crAnnotation.include) {
          standardModifier += trait.crAnnotation.bonusModifier;
        }
      }

      return standardModifier;
    },
    maxAttackRender() {
      return renderBonus(this.maxAttack);
    },
    offensiveCR() {
      // average it, but pull the max of attack or DC CR (you can use one or the other)
      const avgCR =
        (Math.max(this.dcCR.numeric, this.attackCR.numeric) +
          this.damageCR.numeric) /
        2;

      return getCRByNumber(avgCR);
    },
    dcCR() {
      return getCRByDC(this.maxDC);
    },
    attackCR() {
      return getCRByAttack(this.maxAttack);
    },
    damageCR() {
      return getCRByDamage(this.damagePerRound);
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
        this.immuneMultiplier(this.offensiveCR.numeric);
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
    defensiveCR() {
      // average the other crs
      return getCRByNumber((this.hpCR.numeric + this.acCR.numeric) / 2);
    },
  },
  methods: {
    openLink(url) {
      window.open(url);
    },
    highestDamage(data) {
      // check first element of actions and attacks, return highest damage
      // but first validate that we have data to get
      if (data.actions.length > 0 && data.attacks.length > 0) {
        return data.actions[0].damage > data.attacks[0].damage
          ? data.actions[0]
          : data.attacks[0];
      } else if (data.actions.length === 0 && data.attacks.length > 0) {
        return data.attacks[0];
      } else if (data.actions.length > 0 && data.attacks.length === 0) {
        return data.actions[0];
      }

      return null;
    },
    legendaryCombo(la, count) {
      // returns the highest damage per round combo of actions
      // assuming everything can be used multiple times per round right now, ignoring limited use data (?)
      // find the highest cost item and associated damage
      // repeat until we run out of actions to take
      let currentActions = Array.from(la);
      const returnData = { totalDamage: 0, actions: [] };
      while (count > 0) {
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
    saveACBonus(count) {
      if (count < 3) return 0;
      if (count < 5) return 2;

      return 4;
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
