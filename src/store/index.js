import Vue from 'vue'
import Vuex from 'vuex'
import { v4 as uuidv4 } from 'uuid';

import DICE from '../data/DICE'
import MOVEMENT from '../data/MOVEMENT'
import { MUTATION } from '../data/ACTIONS'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    monster: {
      name: "My New Monster",
      size: "medium",
      type: "Humanoid",
      alignment: "",
      AC: 10,
      ACType: "",
      CR: 0,
      proficiency: 0,
      HP: {
        HD: 1,
        type: DICE.d6,
        modifier: 0
      },
      speeds: [{
        id: uuidv4(),
        type: MOVEMENT.WALK,
        speed: 30,
        note: ''
      }],
      stats: {
        STR: 10,
        DEX: 10,
        CON: 10,
        INT: 10,
        WIS: 10,
        CHA: 10
      }
    }
  },
  mutations: {
    [MUTATION.SET_SIMPLE_PROP](state, payload) {
      state.monster[payload.key] = payload.value
    },
    [MUTATION.SET_HP_PROP](state, payload) {
      state.monster.HP[payload.key] = payload.value
    },
    [MUTATION.SET_STAT](state, payload) {
      state.monster.stats[payload.key] = payload.value
    },
    [MUTATION.ADD_SPEED](state, speed) {
      speed.id = uuidv4();
      state.monster.speeds.push(speed)
    },
    [MUTATION.EDIT_SPEED](state, { index, newSpeed }) {
      newSpeed.id = state.monster.speeds[index].id;
      Vue.set(state.monster.speeds, index, newSpeed);
    },
    [MUTATION.DELETE_SPEED](state, index) {
      state.monster.speeds.splice(index, 1);
    }
  },
  actions: {
  },
  modules: {
  }
})
