export const Persistence = (store) => {
  store.subscribe((_, state) => {
    localStorage.setItem('app.monster', JSON.stringify(state.monster));
  });
};
