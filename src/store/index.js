import Vue from 'vue'
import Vuex from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import _ from 'lodash'
import { Persistence } from './persistence'
import jsonurl from 'json-url'

const codec = jsonurl('lzma')

import {
  saveModifier,
  statModifier,
  newAttack,
  avgRoll,
  newMonster,
} from '../components/util'
import SKILL from '../data/SKILL'
import { MUTATION, ACTION } from '../data/ACTIONS'
import SPELLS from '../data/SPELLS'
import TEMPLATES from '../data/TEMPLATES'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [Persistence],
  state: {
    appVersion: process.env.PACKAGE_VERSION || '0.0.0',
    buildNumber: process.env.BUILD_NUMBER || '0',
    monster: newMonster(),
    spells: SPELLS,
    templates: TEMPLATES,
    customTemplates: {},
    dataParam: null,
  },
  getters: {
    majorVersion: (state) => {
      return state.appVersion.split('.')[0]
    },
    minorVersion: (state) => {
      return state.appVersion.split('.')[1]
    },
    avgHp: (state) => {
      return (
        avgRoll(state.monster.HP.HD, state.monster.HP.type) +
        state.monster.HP.modifier
      )
    },
    defaultSaveBonus: (state) => (stat) => {
      const proficient = state.monster.saves[stat].proficient
      return saveModifier(
        state.monster.stats[stat],
        proficient ? state.monster.proficiency : 0
      )
    },
    // this needs the full skill object
    defaultSkillBonus: (state) => (skill) => {
      const proficient = skill.proficient

      // back compat safety
      const expertise = skill.expertise ? skill.expertise : false

      return saveModifier(
        state.monster.stats[skill.skill.stat],
        expertise
          ? state.monster.proficiency * 2
          : proficient
          ? state.monster.proficiency
          : 0
      )
    },
    passivePerception: (state, getters) => {
      // check if perception is in the skills
      const perception = state.monster.skills.find(
        (s) => s.skill.key === SKILL.PERCEPTION.key
      )
      let passive = 10
      if (perception) {
        passive += perception.override
          ? perception.overrideValue
          : getters.defaultSkillBonus(perception)
      } else {
        passive += statModifier(state.monster.stats.WIS)
      }

      return passive
    },
    toHitBonus: (state) => (stat, proficient) => {
      // get stat bonus
      const bonus = statModifier(state.monster.stats[stat])
      return proficient ? bonus + state.monster.proficiency : bonus
    },
    fullToHitBonus: (_, getters) => (modifier) => {
      if (modifier.override) {
        return modifier.overrideValue
      } else {
        return getters.toHitBonus(modifier.stat, modifier.proficient)
      }
    },
    // this is kind of a helper but since some values are computed automatically
    // based on the stats, it'll live in the state
    expectedAttackDamage: (state) => (attack) => {
      const primary =
        avgRoll(attack.damage.count, attack.damage.dice) +
        (attack.damage.modifier.override
          ? attack.damage.modifier.overrideValue
          : statModifier(state.monster.stats[attack.damage.modifier.stat]))

      const secondary =
        avgRoll(attack.alternateDamage.count, attack.alternateDamage.dice) +
        (attack.alternateDamage.modifier.override
          ? attack.alternateDamage.modifier.overrideValue
          : statModifier(
              state.monster.stats[attack.alternateDamage.modifier.stat]
            ))

      const base = attack.alternateDamage.active
        ? Math.max(primary, secondary)
        : primary

      const extra = attack.additionalDamage
        .map((a) => avgRoll(a.count, a.dice))
        .reduce((acc, current) => acc + current, 0)
      return (base + extra) * attack.targets
    },
    multiattackDamage: (_, getters) => (ma) => {
      const attackDamage = ma.attacks.map((id) => {
        const attack = getters.attackFromId(id)
        return getters.expectedAttackDamage(attack)
      })

      const actionDamage = ma.actions.map((id) => {
        const action = getters.actionFromId(id)
        return action.crAnnotation.include ? action.crAnnotation.maxDamage : 0
      })

      return attackDamage
        .concat(actionDamage)
        .reduce((acc, current) => acc + current, 0)
    },
    attackFromId: (state) => (id) => {
      return state.monster.attacks.find((a) => a.id === id)
    },
    actionFromId: (state) => (id) => {
      return state.monster.actions.find((a) => a.id === id)
    },
    attackOrActionFromId: (_, getters) => (id) => {
      const attack = getters.attackFromId(id)
      if (attack) return attack

      return getters.actionFromId(id)
    },
    defaultSpellSave: (state) => (stat) => {
      return (
        8 + state.monster.proficiency + statModifier(state.monster.stats[stat])
      )
    },
    defaultSpellAttackModifier: (state) => (stat) => {
      return state.monster.proficiency + statModifier(state.monster.stats[stat])
    },
    defaultSpellModifier: (state) => (stat) => {
      return statModifier(state.monster.stats[stat])
    },
    isSpellcaster: (state) => {
      return (
        state.monster.spellcasting.standard.length > 0 ||
        state.monster.spellcasting.atWill.length > 0
      )
    },
    spellSave: (state, getters) => {
      if (state.monster.spellcasting.save.override)
        return state.monster.spellcasting.save.overrideValue
      else return getters.defaultSpellSave(state.monster.spellcasting.stat)
    },
    spellAttackModifier: (state, getters) => {
      if (state.monster.spellcasting.attack.override)
        return state.monster.spellcasting.attack.overrideValue
      else
        return getters.defaultSpellAttackModifier(
          state.monster.spellcasting.stat
        )
    },
    spellArray: (state) => {
      return Object.values(state.spells).map((spell) => {
        return { text: spell.name, value: spell.value, ...spell }
      })
    },
    customSpellArray: (state, getters) => {
      // returns in the vuetify select format
      // the name of the spell is the key (if it's not, rip dude)
      return getters.spellArray.filter((spell) => spell.custom)
    },
    spellsByLevel: (state, getters) => (level) => {
      return getters.spellArray.filter((spell) => spell.level === level)
    },
    validLegendaryActions: (state, getters) => {
      const valid = []

      for (const la of state.monster.legendaryActions.actions) {
        // resolve the action or attack
        const actionOrAttack = getters.attackOrActionFromId(la.actionId)
        if (actionOrAttack) {
          valid.push(la)
        }
      }

      return valid
    },
    attackInfo: (state, getters) => {
      // returns an object containing all you need to know for calculating CR
      const data = {
        attacks: [],
        actions: [],
        legendary: [],
        traits: [],
        spells: [],
        lairActions: [],
      }

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
          type: 'Attack',
        })
      }

      // multi
      for (const idx in state.monster.multiattacks) {
        // multiattacks have no modifiers
        // get attack/action names
        const ma = state.monster.multiattacks[idx]

        const attackNames =
          ma.attacks.length > 0
            ? ma.attacks.map((id) => getters.attackFromId(id).name).join(', ')
            : []
        const actionNames =
          ma.actions.length > 0
            ? ma.actions.map((id) => getters.actionFromId(id).name).join(', ')
            : []

        data.attacks.push({
          name: `Multiattack: ${[]
            .concat(attackNames, actionNames)
            .join(', ')}`,
          damage: getters.multiattackDamage(state.monster.multiattacks[idx]),
          save: 0,
          toHit: 0,
          type: 'Multiattack',
        })
      }

      // sort descending damage
      data.attacks.sort((a, b) => {
        return b.damage - a.damage
      })

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
            type: 'Action',
          })
        }
      }

      // sort damage descending
      data.actions.sort((a, b) => {
        return b.damage - a.damage
      })

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
            remove: false,
            type: 'Trait',
          })
        }
      }

      data.traits.sort((a, b) => {
        return b.damage - a.damage
      })

      // lair actions
      // basically traits but they use the action annotation data
      for (const lairAction of state.monster.lairActions) {
        if (lairAction.crAnnotation.include) {
          data.lairActions.push({
            name: lairAction.name,
            damage:
              lairAction.crAnnotation.maxDamage *
              (lairAction.crAnnotation.multitarget ? 2 : 1),
            save: lairAction.crAnnotation.maxSave,
            toHit: lairAction.crAnnotation.maxModifier,
            type: 'Lair Action',
          })
        }
      }

      data.lairActions.sort((a, b) => {
        return b.damage - a.damage
      })

      // legendary actions
      for (const la of state.monster.legendaryActions.actions) {
        // resolve the action or attack
        const actionOrAttack = getters.attackOrActionFromId(la.actionId)
        if (actionOrAttack && 'crAnnotation' in actionOrAttack) {
          // that's an actions
          const action = actionOrAttack
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
              type: 'Legendary',
            })
          }
        } else {
          // no annotation = attack
          const attack = actionOrAttack
          data.legendary.push({
            name: attack.name,
            damage: getters.expectedAttackDamage(attack),
            toHit: getters.fullToHitBonus(attack.modifier),
            save: attack.save,
            cost: la.cost,
            type: 'Legendary',
          })
        }
      }
      data.legendaryCount = state.monster.legendaryActions.count

      // sort
      data.legendary.sort((a, b) => {
        return b.damage - a.damage
      })

      // spells
      // for simplicity, we're going to assume spells can be cast once (disregard concentration)
      // and that spells won't be upcasted (yeah yeah I know about upcasted fireball but you'll just have to
      // figure that out yourself)
      // there's a few spellcasting lists... let's combine them
      const spells = _.union(
        state.monster.spellcasting.standard,
        ...state.monster.spellcasting.atWill.map((a) => a.spells)
      )

      // got all the ids, get the dataaaaa
      for (const id of spells) {
        const spell = state.spells[id]

        // cantrip scaling based on caster level
        const damage =
          spell.damage *
          (spell.level === 0
            ? Math.max(
                1,
                1 + Math.floor((state.monster.spellcasting.level + 1) / 6)
              )
            : 1)

        data.spells.push({
          name: spell.name,
          damage: spell.multitarget ? damage * 2 : damage,
          type: 'Spell',
        })
      }

      data.spells.sort((a, b) => {
        return b.damage - a.damage
      })

      return data
    },
    allTemplates: (state) => {
      // concats all templates to a list
      return []
        .concat(
          ...Object.values(state.templates),
          Object.values(state.customTemplates)
        )
        .sort((a, b) => {
          const na = a.templateName.toLowerCase()
          const nb = b.templateName.toLowerCase()

          if (na < nb) return -1
          if (na > nb) return 1

          return 0
        })
        .map((t, idx) => {
          return { order: idx, ...t }
        })
    },
  },
  mutations: {
    [MUTATION.SET_SIMPLE_PROP](state, payload) {
      state.monster[payload.key] = payload.value
    },
    [MUTATION.SET_HP_PROP](state, payload) {
      state.monster.HP[payload.key] = payload.value
    },
    [MUTATION.SET_STAT](state, payload) {
      state.monster.stats[payload.key] = parseInt(payload.value)
    },
    [MUTATION.ADD_SPEED](state, speed) {
      speed.id = uuidv4()
      state.monster.speeds.push(speed)
    },
    [MUTATION.EDIT_SPEED](state, { index, newSpeed }) {
      newSpeed.id = state.monster.speeds[index].id
      Vue.set(state.monster.speeds, index, newSpeed)
    },
    [MUTATION.DELETE_SPEED](state, index) {
      state.monster.speeds.splice(index, 1)
    },
    [MUTATION.SET_SAVE](state, { key, proficient, override, overrideValue }) {
      state.monster.saves[key] = { proficient, override, overrideValue }
    },
    [MUTATION.SET_SKILL](state, { index, skill }) {
      Vue.set(state.monster.skills, index, skill)
    },
    [MUTATION.ADD_SKILL](state, skill) {
      state.monster.skills.push({
        skill,
        proficient: false,
        expertise: false,
        override: false,
        overrideValue: 0,
      })
    },
    [MUTATION.DELETE_SKILL](state, index) {
      state.monster.skills.splice(index, 1)
    },
    [MUTATION.SET_SENSE](state, { sense, value }) {
      state.monster.senses[sense] = value
    },
    [MUTATION.SET_ATTACK](state, { index, attack }) {
      attack.id = state.monster.attacks[index].id
      Vue.set(state.monster.attacks, index, attack)
    },
    [MUTATION.ADD_ATTACK](state) {
      state.monster.attacks.push(newAttack())
    },
    [MUTATION.DELETE_ATTACK](state, index) {
      state.monster.attacks.splice(index, 1)

      // check that the actions in multiattack still exist, remove the ones that don't
      for (const ma of state.monster.multiattacks) {
        const valid = []

        for (const id of ma.attacks) {
          if (state.monster.attacks.find((a) => a.id === id)) valid.push(id)
        }

        ma.attacks = valid
      }

      // also check that legendary attacks still exist
      const validLa = []
      for (const la of state.monster.legendaryActions.actions) {
        if (state.monster.actions.find((a) => a.id === la.actionId))
          validLa.push(la)
        if (state.monster.attacks.find((a) => a.id === la.actionId))
          validLa.push(la)
      }

      state.monster.legendaryActions.actions = validLa
    },
    [MUTATION.SET_MULTIATTACK](state, ma) {
      state.monster.multiattacks = ma
    },
    [MUTATION.SET_SPELLCASTING](state, spellcasting) {
      state.monster.spellcasting = spellcasting
    },
    [MUTATION.VALIDATE_ACTIONS](state) {
      // check that the actions in multiattack still exist, remove the ones that don't
      if (state.monster.multiattacks.length > 0) {
        for (const ma of state.monster.multiattacks) {
          const valid = []

          for (const id of ma.actions) {
            if (state.monster.actions.find((a) => a.id === id)) valid.push(id)
          }

          ma.actions = valid
        }
      }

      // also check that legendary attacks still exist
      const validLa = []
      for (const la of state.monster.legendaryActions.actions) {
        if (state.monster.actions.find((a) => a.id === la.actionId))
          validLa.push(la)
        if (state.monster.attacks.find((a) => a.id === la.actionId))
          validLa.push(la)
      }

      state.monster.legendaryActions.actions = validLa
    },
    [MUTATION.LOAD_LAST_STATE](state) {
      const spellStr = localStorage.getItem('app.customSpells')
      if (spellStr) {
        const spells = JSON.parse(spellStr)

        for (const spell of spells) {
          Vue.set(state.spells, spell.name, spell)
        }
      }

      const templateStr = localStorage.getItem('app.customTemplates')
      if (templateStr) {
        Vue.set(state, 'customTemplates', JSON.parse(templateStr))
      }
    },
    [MUTATION.LOAD_MONSTER](state, monster) {
      // versioning
      if (monster.saveVersion < 2) {
        // expertise was added to skills
        for (const skill of monster.skills) {
          skill.expertise = false
        }

        // upgrade complete
        monster.saveVersion = 2
      }

      // lair actions were added in v3
      if (monster.saveVersion < 3) {
        monster.lairActions = []
        monster.regionalEffects = []
        monster.regionalEffectDescription = ''

        monster.saveVersion = 3
      }

      // adjust saves in the attack field. null is ok but let's make it 0
      for (const attack of monster.attacks) {
        if (attack.save === null) attack.save = 0
      }

      // just replaces the entire thing, assumes input is valid
      Vue.set(state, 'monster', monster)
    },
    [MUTATION.RESET](state) {
      Vue.set(state, 'monster', newMonster())
    },
    [MUTATION.ADD_CUSTOM_SPELL](state, spell) {
      // this will overwrite the spell if it exists in the custom spells
      Vue.set(state.spells, spell.name, spell)
    },
    [MUTATION.DELETE_CUSTOM_SPELL](state, name) {
      Vue.delete(state.spells, name)
    },
    [MUTATION.VALIDATE_SPELLS](state) {
      // checks that the given keys exist in the spell list
      state.monster.spellcasting.standard = state.monster.spellcasting.standard.filter(
        (id) => id in state.spells
      )

      for (const atWill of state.monster.spellcasting.atWill) {
        atWill.spells = atWill.spells.filter((id) => id in state.spells)
      }
    },
    [MUTATION.ADD_CUSTOM_TEMPLATE](state, { id, template }) {
      // strip out the id from template if it exists
      if ('id' in template) {
        delete template.id
      }

      if (id in state.customTemplates) {
        Vue.delete(state.customTemplates, id)
      }

      Vue.set(state.customTemplates, id, template)
    },
    [MUTATION.DELETE_CUSTOM_TEMPLATE](state, id) {
      if (id in state.customTemplates) {
        Vue.delete(state.customTemplates, id)
      }
    },
    [MUTATION.SET_DATA_PARAM](state, data) {
      state.dataParam = data
    },
  },
  actions: {
    [ACTION.DELETE_SPELL_AND_VALIDATE]({ commit }, spellName) {
      commit(MUTATION.DELETE_CUSTOM_SPELL, spellName)
      commit(MUTATION.VALIDATE_SPELLS)
    },
    [ACTION.UPDATE_SPELL_AND_VALIDATE]({ commit }, { spell, originalName }) {
      commit(MUTATION.DELETE_CUSTOM_SPELL, originalName)
      commit(MUTATION.ADD_CUSTOM_SPELL, spell)
      commit(MUTATION.VALIDATE_SPELLS)
    },
    async [ACTION.LOAD_LAST_STATE]({ commit }) {
      // load monster from local storage
      const monster = localStorage.getItem('app.monster')
      if (monster) {
        commit(MUTATION.LOAD_MONSTER, JSON.parse(monster))
      }

      commit(MUTATION.LOAD_LAST_STATE)
      commit(MUTATION.VALIDATE_SPELLS)

      let uri = window.location.search.substring(1)
      let params = new URLSearchParams(uri)

      if (params.has('data')) {
        try {
          const state = await codec.decompress(params.get('data'))
          const stateJson = JSON.parse(state)
          commit(MUTATION.SET_DATA_PARAM, stateJson)
        } catch (e) {
          console.log(e)
        }
      }
    },
    [ACTION.LOAD_MONSTER]({ commit }, monster) {
      commit(MUTATION.LOAD_MONSTER, monster)
      commit(MUTATION.VALIDATE_SPELLS)
    },
    [ACTION.LOAD_CUSTOM_SPELLS]({ commit }, spellList) {
      // overwrites existing spells
      for (const spell of spellList) {
        commit(MUTATION.DELETE_CUSTOM_SPELL, spell.name)
        commit(MUTATION.ADD_CUSTOM_SPELL, spell)
      }

      commit(MUTATION.VALIDATE_SPELLS)
    },
    [ACTION.LOAD_CUSTOM_TEMPLATES]({ commit }, templates) {
      for (const id in templates) {
        commit(MUTATION.ADD_CUSTOM_TEMPLATE, { id, template: templates[id] })
      }
    },
  },
  modules: {},
})
