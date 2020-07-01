import Vue from 'vue'
import Vuex from 'vuex'
import DICE from '../data/DICE'
import { MUTATION } from '../data/ACTIONS'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    monster: {
      name: "My New Monster",
      type: "Humanoid",
      alignment: "",
      AC: 10,
      HP: {
        HD: 1,
        type: DICE.d6,
        modifier: 0
      },
      speeds: [],
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
      state.monster[payload.key] = payload.value;
    },
    [MUTATION.SET_STAT](state, payload) {
      state.monster.stats[payload.stat] = payload.value
    }
  },
  actions: {
  },
  modules: {
  }
})
