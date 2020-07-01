import Vue from 'vue';
import Vuex from 'vuex';
import { v4 as uuidv4 } from 'uuid';

import { saveModifier } from '../components/util';
import DICE from '../data/DICE';
import MOVEMENT from '../data/MOVEMENT';
import { MUTATION } from '../data/ACTIONS';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    monster: {
      name: 'My New Monster',
      size: 'medium',
      type: 'Humanoid',
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
  },
  actions: {},
  modules: {},
});
