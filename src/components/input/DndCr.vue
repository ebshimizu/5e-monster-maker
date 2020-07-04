<template>
  <v-expansion-panel>
    <v-expansion-panel-header>CR</v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row align="center">
        <v-col cols="2"
          ><v-text-field label="Expected CR"></v-text-field
        ></v-col>
        <v-col cols="4" class="pr-2"
          ><v-text-field
            label="Proficiency Bonus"
            type="number"
            v-model="proficiency"
          ></v-text-field
        ></v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { MUTATION } from '../../data/ACTIONS';
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
    attackInfo() {
      return this.$store.getters.attackInfo;
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

        // if action is null, we don't have anything to do so just abort rq
        if (!action) break;

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
    ehp() {
      // ehp actually kinda needs a CR estimate first, so assuming we don't have that, we will base expected CR on attacks
      return 0;
    },
  },
  methods: {
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
          count -= 1;
        }

        currentActions = currentActions.filter((a) => a.cost <= count);
      }

      return returnData;
    },
  },
};
</script>
