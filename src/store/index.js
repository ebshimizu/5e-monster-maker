import Vue from 'vue';
import Vuex from 'vuex';
import { v4 as uuidv4 } from 'uuid';

import { saveModifier, statModifier } from '../components/util';
import DICE from '../data/DICE';
import MOVEMENT from '../data/MOVEMENT';
import SKILL from '../data/SKILL';
import { RANGE } from '../data/ATTACK';
import { MUTATION } from '../data/ACTIONS';
import DAMAGE_TYPE from '../data/DAMAGE_TYPE';

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
      proficiency: 0,
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
        INT: 10,
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
      attacks: [
        {
          // templating out an attack, temporary code below
          name: 'Bite',
          id: uuidv4(),
          distance: RANGE.MELEE,
          kind: 'Weapon',
          modifier: {
            override: false,
            overrideValue: 0,
            stat: 'STR',
            proficient: true,
          },
          range: {
            standard: 0,
            long: 0,
            reach: 5,
          },
          targets: 1,
          damage: {
            dice: DICE.d8,
            count: 2,
            modifier: {
              override: false,
              overrideValue: 0,
              stat: 'STR',
            },
            type: DAMAGE_TYPE.PIERCING,
          },
          alternateDamage: {
            dice: DICE.d10,
            count: 2,
            modifier: {
              override: false,
              overrideValue: 0,
              stat: 'STR',
            },
            type: DAMAGE_TYPE.PIERCING,
            condition: 'when making an attack with two hands',
            active: false,
          },
          additionalDamage: [
            {
              id: uuidv4(),
              dice: DICE.d6,
              count: 1,
              type: DAMAGE_TYPE.RADIANT,
              note: ''
            },
          ],
          save: 18,
          description: '',
        },
      ],
      traits: [],
      actions: [],
      spellcasting: {},
    },
  },
  getters: {
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
    }
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
  },
  actions: {},
  modules: {},
});
