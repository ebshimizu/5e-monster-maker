import actions from './templates/actions';
import attacks from './templates/attacks';
import traits from './templates/traits';
import { attackTemplateSubtitle } from '../components/util';

export const TEMPLATE_TYPE = {
  ATTACK: 'Attack',
  ACTION: 'Action',
  TRAIT: 'Trait',
};

export const DEFAULT_TEMPLATE_ICON = {
  [TEMPLATE_TYPE.ATTACK]: 'mdi-sword',
  [TEMPLATE_TYPE.ACTION]: 'mdi-cards',
  [TEMPLATE_TYPE.TRAIT]: 'mdi-human-handsup',
};

// map types to these
export const TEMPLATES = {
  actions: actions.actions.map((a) => {
    return { type: TEMPLATE_TYPE.ACTION, subtitle: '', ...a };
  }),
  attacks: attacks.attacks.map((a) => {
    return { type: TEMPLATE_TYPE.ATTACK, subtitle: attackTemplateSubtitle(a), ...a };
  }),
  traits: traits.traits.map((t) => {
    return { type: TEMPLATE_TYPE.TRAIT, subtitle: '', ...t };
  }),
};

export default TEMPLATES;
