import Vue from 'vue';
import Vuex from 'vuex';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { Persistence } from './persistence';

import {
  saveModifier,
  statModifier,
  newAttack,
  avgRoll,
  newMonster,
} from '../components/util';
import SKILL from '../data/SKILL';
import { MUTATION } from '../data/ACTIONS';
import SPELLS from '../data/SPELLS';
import TEMPLATES from '../data/TEMPLATES';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [Persistence],
  state: {
    appVersion: process.env.PACKAGE_VERSION || '0.0.0',
    buildNumber: process.env.BUILD_NUMBER || '0',
    monster: newMonster(),
    spells: SPELLS,
    templates: TEMPLATES,
  },
  getters: {
    majorVersion: (state) => {
      return state.appVersion.split('.')[0];
    },
    minorVersion: (state) => {
      return state.appVersion.split('.')[1];
    },
    avgHp: (state) => {
      return (
        avgRoll(state.monster.HP.HD, state.monster.HP.type) +
        state.monster.HP.modifier
      );
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
      return (
        state.monster.spellcasting.standard.length > 0 ||
        state.monster.spellcasting.atWill.length > 0
      );
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
    allSpells: (state) => {
      // future planning
      return state.spells.ALL;
    },
    attackInfo: (state, getters) => {
      // returns an object containing all you need to know for calculating CR
      const data = {
        attacks: [],
        actions: [],
        legendary: [],
        traits: [],
        spells: [],
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
          type: 'attack',
        });
      }

      // multi
      for (const idx in state.monster.multiattacks) {
        // multiattacks have no modifiers
        data.attacks.push({
          name: `Multiattack Group ${idx + 1}`,
          damage: getters.multiattackDamage(state.monster.multiattacks[idx]),
          save: 0,
          toHit: 0,
          type: 'multiattack',
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
            type: 'action',
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
            type: 'trait',
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
              type: 'legendary',
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
            type: 'legendary',
          });
        }
      }
      data.legendaryCount = state.monster.legendaryActions.count;

      // sort
      data.legendary.sort((a, b) => {
        return b.damage - a.damage;
      });

      // spells
      // for simplicity, we're going to assume spells can be cast once (disregard concentration)
      // and that spells won't be upcasted (yeah yeah I know about upcasted fireball but you'll just have to
      // figure that out yourself)
      // there's a few spellcasting lists... let's combine them
      const spells = _.union(
        state.monster.spellcasting.standard,
        state.monster.spellcasting.atWill.map((a) => a.spells)
      );

      // got all the ids, get the dataaaaa
      for (const id of spells) {
        const spell = getters.allSpells[id];

        // cantrip scaling based on caster level
        const damage =
          spell.damage *
          (spell.level === 0
            ? Math.max(1, 1 + Math.floor(state.monster.spellcasting.level + 1) / 6)
            : 1);

        data.spells.push({
          name: spell.name,
          damage: spell.multitarget ? damage * 2 : damage,
          type: 'spell',
        });
      }

      data.spells.sort((a, b) => {
        return b.damage - a.damage;
      });

      return data;
    },
    allTemplates: (state) => {
      // concats all templates to a list
      return []
        .concat(...Object.values(state.templates))
        .sort((a, b) => {
          const na = a.templateName.toLowerCase();
          const nb = b.templateName.toLowerCase();

          if (na < nb) return -1;
          if (na > nb) return 1;

          return 0;
        })
        .map((t, idx) => {
          return { order: idx, ...t };
        });
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
    [MUTATION.LOAD_LAST_STATE](state) {
      // load from local storage
      const monster = localStorage.getItem('app.monster');
      if (monster) {
        Vue.set(state, 'monster', JSON.parse(monster));
      }
    },
    [MUTATION.LOAD_MONSTER](state, monster) {
      // just replaces the entire thing, assumes input is valid
      Vue.set(state, 'monster', monster);
    },
    [MUTATION.RESET](state) {
      Vue.set(state, 'monster', newMonster());
    },
  },
  actions: {},
  modules: {},
});
