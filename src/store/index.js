import Vue from 'vue';
import Vuex from 'vuex';
import { v4 as uuidv4 } from 'uuid';

import {
  saveModifier,
  statModifier,
  newAttack,
  avgRoll,
} from '../components/util';
import DICE from '../data/DICE';
import MOVEMENT from '../data/MOVEMENT';
import SKILL from '../data/SKILL';
import { MUTATION } from '../data/ACTIONS';
import STAT from '../data/STAT';
import SPELLS from '../data/SPELLS';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    monster: {
      name: 'My New Monster',
      size: 'Medium',
      type: 'humanoid',
      alignment: '',
      AC: 10,
      ACType: '',
      CR: 0,
      proficiency: 4,
      HP: {
        HD: 1,
        type: DICE.d6,
        modifier: 0,
      },
      speeds: [
        {
          id: uuidv4(),
          type: MOVEMENT.WALK,
          speed: 30,
          note: '',
        },
      ],
      stats: {
        STR: 10,
        DEX: 10,
        CON: 10,
        INT: 12,
        WIS: 10,
        CHA: 10,
      },
      saves: {
        STR: {
          proficient: false,
          override: false,
          overrideValue: 0,
        },
        DEX: {
          proficient: false,
          override: false,
          overrideValue: 0,
        },
        CON: {
          proficient: false,
          override: false,
          overrideValue: 0,
        },
        INT: {
          proficient: false,
          override: false,
          overrideValue: 0,
        },
        WIS: {
          proficient: false,
          override: false,
          overrideValue: 0,
        },
        CHA: {
          proficient: false,
          override: false,
          overrideValue: 0,
        },
      },
      skills: [
        {
          skill: SKILL.PERCEPTION,
          proficient: false,
          override: false,
          overrideValue: 0,
        },
      ],
      resistances: [],
      immunities: [],
      vulnerabilities: [],
      conditions: [],
      senses: {
        blindsight: 0,
        darkvision: 0,
        tremorsense: 0,
        truesight: 0,
      },
      passivePerception: {
        override: false,
        overrideValue: 0,
      },
      languages: '',
      attacks: [],
      multiattacks: [],
      spellcasting: {
        stat: STAT.INT,
        save: {
          override: false,
          overrideValue: 0,
        },
        modifier: {
          override: false,
          overrideValue: 0,
        },
        attack: {
          override: false,
          overrideValue: 0,
        },
        class: 'Wizard',
        level: 1,
        slots: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        atWill: [],
        standard: [],
        notes: '',
        atWillNotes: '',
      },
      traits: [],
      actions: [],
      legendaryActions: {
        count: 0,
        actions: [],
      },
      reactions: [],
    },
    spells: SPELLS,
  },
  getters: {
    avgHp: (state) => {
      return avgRoll(state.monster.HP.HD, state.monster.HP.type) + state.monster.HP.modifier;
    },
    defaultSaveBonus: (state) => (stat) => {
      const proficient = state.monster.saves[stat].proficient;
      return saveModifier(
        state.monster.stats[stat],
        proficient ? state.monster.proficiency : 0
      );
    },
    // this needs the full skill object
    defaultSkillBonus: (state) => (skill) => {
      const proficient = skill.proficient;
      return saveModifier(
        state.monster.stats[skill.skill.stat],
        proficient ? state.monster.proficiency : 0
      );
    },
    passivePerception: (state, getters) => {
      // check if perception is in the skills
      const perception = state.monster.skills.find(
        (s) => s.skill.key === SKILL.PERCEPTION.key
      );
      let passive = 10;
      if (perception) {
        passive += perception.override
          ? perception.overrideValue
          : getters.defaultSkillBonus(perception);
      } else {
        passive += statModifier(state.monster.stats.WIS);
      }

      return passive;
    },
    toHitBonus: (state) => (stat, proficient) => {
      // get stat bonus
      const bonus = statModifier(state.monster.stats[stat]);
      return proficient ? bonus + state.monster.proficiency : bonus;
    },
    fullToHitBonus: (_, getters) => (modifier) => {
      if (modifier.override) {
        return modifier.overrideValue;
      } else {
        return getters.toHitBonus(modifier.stat, modifier.proficient);
      }
    },
    // this is kind of a helper but since some values are computed automatically
    // based on the stats, it'll live in the state
    expectedAttackDamage: (state) => (attack) => {
      const primary =
        avgRoll(attack.damage.count, attack.damage.dice) +
        (attack.damage.modifier.override
          ? attack.damage.modifier.overrideValue
          : statModifier(state.monster.stats[attack.damage.modifier.stat]));

      const secondary =
        avgRoll(attack.alternateDamage.count, attack.alternateDamage.dice) +
        (attack.alternateDamage.modifier.override
          ? attack.alternateDamage.modifier.overrideValue
          : statModifier(
              state.monster.stats[attack.alternateDamage.modifier.stat]
            ));

      const base = attack.alternateDamage.active
        ? Math.max(primary, secondary)
        : primary;

      const extra = attack.additionalDamage
        .map((a) => avgRoll(a.count, a.dice))
        .reduce((acc, current) => acc + current, 0);
      return (base + extra) * attack.targets;
    },
    multiattackDamage: (_, getters) => (ma) => {
      const attackDamage = ma.attacks.map((id) => {
        const attack = getters.attackFromId(id);
        return getters.expectedAttackDamage(attack);
      });

      const actionDamage = ma.actions.map((id) => {
        const action = getters.actionFromId(id);
        return action.crAnnotation.include ? action.crAnnotation.maxDamage : 0;
      });

      return attackDamage
        .concat(actionDamage)
        .reduce((acc, current) => acc + current, 0);
    },
    attackFromId: (state) => (id) => {
      return state.monster.attacks.find((a) => a.id === id);
    },
    actionFromId: (state) => (id) => {
      return state.monster.actions.find((a) => a.id === id);
    },
    attackOrActionFromId: (_, getters) => (id) => {
      const attack = getters.attackFromId(id);
      if (attack) return attack;

      return getters.actionFromId(id);
    },
    defaultSpellSave: (state) => (stat) => {
      return (
        8 + state.monster.proficiency + statModifier(state.monster.stats[stat])
      );
    },
    defaultSpellAttackModifier: (state) => (stat) => {
      return (
        state.monster.proficiency + statModifier(state.monster.stats[stat])
      );
    },
    defaultSpellModifier: (state) => (stat) => {
      return statModifier(state.monster.stats[stat]);
    },
    isSpellcaster: (state) => {
      return state.monster.spellcasting.standard.length > 0 || state.monster.spellcasting.atWill.length > 0;
    },
    spellSave: (state, getters) => {
      if (state.monster.spellcasting.save.override)
        return state.monster.spellcasting.save.overrideValue;
      else return getters.defaultSpellSave(state.monster.spellcasting.stat);
    },
    spellAttackModifier: (state, getters) => {
      if (state.monster.spellcasting.attack.override)
        return state.monster.spellcasting.attack.overrideValue;
      else
        return getters.defaultSpellAttackModifier(
          state.monster.spellcasting.stat
        );
    },
    attackInfo: (state, getters) => {
      // returns an object containing all you need to know for calculating CR
      const data = {
        attacks: [],
        actions: [],
        legendary: [],
        traits: [],
      };

      // first, get the attacks and sort them by damage. We assume attacks are always available.
      // this includes multiattacks
      // attacks
      for (const attack of state.monster.attacks) {
        // collect modifiers and DC while we're here
        data.attacks.push({
          name: attack.name,
          damage: getters.expectedAttackDamage(attack),
          toHit: getters.fullToHitBonus(attack.modifier),
          save: attack.save,
        });
      }

      // multi
      for (const idx in state.monster.multiattacks) {
        // multiattacks have no modifiers
        data.attacks.push({
          name: `Multiattack Group ${idx + 1}`,
          damage: getters.multiattackDamage(state.monster.multiattacks[idx]),
          save: 0,
          toHit: 0
        });
      }

      // sort descending damage
      data.attacks.sort((a, b) => {
        return b.damage - a.damage;
      });

      // ok actions next
      for (const action of state.monster.actions) {
        // check if we should even include this action
        // skip legendary only for now
        if (action.crAnnotation.include && !action.legendaryOnly) {
          // now, actions might be limited use, which we'll need to track
          data.actions.push({
            name: action.name,
            damage:
              action.crAnnotation.maxDamage *
              (action.crAnnotation.multitarget ? 2 : 1),
            limited:
              action.limitedUse.count > 0 ||
              (action.recharge && action.recharge !== ''),
            uses:
              action.recharge && action.recharge !== ''
                ? 1
                : action.limitedUse.count,
            save: action.crAnnotation.maxSave,
            toHit: action.crAnnotation.maxModifier,
          });
        }
      }

      // sort damage descending
      data.actions.sort((a, b) => {
        return b.damage - a.damage;
      });

      // traits
      for (const trait of state.monster.traits) {
        // really similar to actions
        if (trait.crAnnotation.include) {
          data.traits.push({
            name: trait.name,
            damage:
              trait.crAnnotation.maxDamage *
              (trait.crAnnotation.multitarget ? 2 : 1),
            limited: trait.limitedUse.count > 0,
            uses: trait.limitedUse.count,
            save: trait.crAnnotation.maxSave,
            toHit: trait.crAnnotation.maxModifier,
          });
        }
      }

      data.traits.sort((a, b) => {
        return b.damage - a.damage;
      });

      // legendary actions
      for (const la of state.monster.legendaryActions.actions) {
        // resolve the action or attack
        const actionOrAttack = getters.attackOrActionFromId(la.actionId);
        if ('crAnnotation' in actionOrAttack) {
          // that's an actions
          const action = actionOrAttack;
          // do the action processing
          if (action.crAnnotation.include) {
            data.legendary.push({
              name: action.name,
              damage:
                action.crAnnotation.maxDamage *
                (action.crAnnotation.multitarget ? 2 : 1),
              limited:
                action.limitedUse.count > 0 ||
                (action.recharge && action.recharge !== ''),
              uses: action.limitedUse.count,
              save: action.crAnnotation.maxSave,
              toHit: action.crAnnotation.maxModifier,
              cost: la.cost,
            });
          }
        } else {
          // no annotation = attack
          const attack = actionOrAttack;
          data.legendary.push({
            name: attack.name,
            damage: getters.expectedAttackDamage(attack),
            toHit: getters.fullToHitBonus(attack.modifier),
            save: attack.save,
            cost: la.cost,
          });
        }
      }
      data.legendaryCount = state.monster.legendaryActions.count;

      // spells
      // todo: need spell damage data. for simplicity, we're going to assume spells can be cast once
      // and that spells won't be upcasted (yeah yeah I know about upcasted fireball but you'll just have to)
      // figure that out yourself

      // sort
      data.legendary.sort((a, b) => {
        return b.damage - a.damage;
      });

      return data;
    },
  },
  mutations: {
    [MUTATION.SET_SIMPLE_PROP](state, payload) {
      state.monster[payload.key] = payload.value;
    },
    [MUTATION.SET_HP_PROP](state, payload) {
      state.monster.HP[payload.key] = payload.value;
    },
    [MUTATION.SET_STAT](state, payload) {
      state.monster.stats[payload.key] = parseInt(payload.value);
    },
    [MUTATION.ADD_SPEED](state, speed) {
      speed.id = uuidv4();
      state.monster.speeds.push(speed);
    },
    [MUTATION.EDIT_SPEED](state, { index, newSpeed }) {
      newSpeed.id = state.monster.speeds[index].id;
      Vue.set(state.monster.speeds, index, newSpeed);
    },
    [MUTATION.DELETE_SPEED](state, index) {
      state.monster.speeds.splice(index, 1);
    },
    [MUTATION.SET_SAVE](state, { key, proficient, override, overrideValue }) {
      state.monster.saves[key] = { proficient, override, overrideValue };
    },
    [MUTATION.SET_SKILL](state, { index, skill }) {
      Vue.set(state.monster.skills, index, skill);
    },
    [MUTATION.ADD_SKILL](state, skill) {
      state.monster.skills.push({
        skill,
        proficient: false,
        override: false,
        overrideValue: 0,
      });
    },
    [MUTATION.DELETE_SKILL](state, index) {
      state.monster.skills.splice(index, 1);
    },
    [MUTATION.SET_SENSE](state, { sense, value }) {
      state.monster.senses[sense] = value;
    },
    [MUTATION.SET_ATTACK](state, { index, attack }) {
      attack.id = state.monster.attacks[index].id;
      Vue.set(state.monster.attacks, index, attack);
    },
    [MUTATION.ADD_ATTACK](state) {
      state.monster.attacks.push(newAttack());
    },
    [MUTATION.DELETE_ATTACK](state, index) {
      state.monster.attacks.splice(index, 1);

      // check that the actions in multiattack still exist, remove the ones that don't
      for (const ma of state.monster.multiattacks) {
        const valid = [];

        for (const id of ma.attacks) {
          if (state.monster.attacks.find((a) => a.id === id)) valid.push(id);
        }

        ma.attacks = valid;
      }
    },
    [MUTATION.SET_MULTIATTACK](state, ma) {
      state.monster.multiattacks = ma;
    },
    [MUTATION.SET_SPELLCASTING](state, spellcasting) {
      state.monster.spellcasting = spellcasting;
    },
    [MUTATION.VALIDATE_ACTIONS](state) {
      // check that the actions in multiattack still exist, remove the ones that don't
      for (const ma of state.monster.multiattacks) {
        const valid = [];

        for (const id of ma.actions) {
          if (state.monster.actions.find((a) => a.id === id)) valid.push(id);
        }

        ma.actions = valid;
      }
    },
  },
  actions: {},
  modules: {},
});
