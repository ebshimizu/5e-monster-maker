import { MUTATION } from '../data/ACTIONS';

export const Persistence = (store) => {
  store.subscribe(({ type }, state) => {
    localStorage.setItem('app.monster', JSON.stringify(state.monster));

    if (
      type === MUTATION.ADD_CUSTOM_SPELL ||
      type === MUTATION.DELETE_CUSTOM_SPELL
    ) {
      // persist custom spells to app.customSpells
      localStorage.setItem(
        'app.customSpells',
        JSON.stringify(store.getters.customSpellArray)
      );
    }
    if (
      type === MUTATION.ADD_CUSTOM_TEMPLATE ||
      type === MUTATION.DELETE_CUSTOM_TEMPLATE
    ) {
      localStorage.setItem(
        'app.customTemplates',
        JSON.stringify(state.customTemplates)
      );
    }
  });
};
