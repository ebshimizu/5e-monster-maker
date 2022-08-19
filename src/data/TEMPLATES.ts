import actions from './templates/actions.json'
import attacks from './templates/attacks.json'
import traits from './templates/traits.json'
import {
  AttackTemplate,
  ActionTemplate,
  TraitTemplate,
  DndAttack,
  DndStat,
} from '../components/models'

export const DEFAULT_TEMPLATE_ICON: Record<string, string> = {
  Attack: 'mdi-sword',
  Action: 'mdi-movie-open',
  Trait: 'fa-solid fa-dna',
}

// right these are all global, as in they won't change unless the app is reloaded
const srd_actions: Record<string, ActionTemplate> = {}
actions.actions.forEach((a) => {
  srd_actions[a.templateName.toLowerCase()] = {
    ...a,
    templateName: a.templateName.toLowerCase(),
    type: 'Action',
    icon: a.icon === '' ? DEFAULT_TEMPLATE_ICON.Action : a.icon,
  }
})

const srd_attacks: Record<string, AttackTemplate> = {}
attacks.attacks.forEach((a) => {
  srd_attacks[a.templateName.toLowerCase()] = {
    ...a,
    templateName: a.templateName.toLowerCase(),
    // couple of manual casts, the data is formatted accordingly
    // this might seem like overkill but i'm trying to avoid a cast in order to catch errors as things
    // get imported in the future
    distance: a.distance as DndAttack['distance'],
    kind: a.kind as DndAttack['kind'],
    modifier: {
      ...a.modifier,
      stat: a.modifier.stat as DndStat,
    },
    damage: {
      ...a.damage,
      modifier: {
        ...a.damage.modifier,
        stat: a.damage.modifier.stat as DndStat,
      },
    },
    alternateDamage: {
      ...a.alternateDamage,
      modifier: {
        ...a.alternateDamage.modifier,
        stat: a.alternateDamage.modifier.stat as DndStat,
      },
    },
    type: 'Attack',
    icon: a.icon === '' ? DEFAULT_TEMPLATE_ICON.Attack : a.icon,
  }
})

const srd_traits: Record<string, TraitTemplate> = {}
traits.traits.map((t) => {
  srd_traits[t.templateName.toLowerCase()] = {
    ...t,
    templateName: t.templateName.toLowerCase(),
    type: 'Trait',
    icon: t.icon === '' ? DEFAULT_TEMPLATE_ICON.Trait : t.icon,
  }
})

// map types to these
export function useTemplates() {
  return {
    srd_actions,
    srd_attacks,
    srd_traits,
  }
}
