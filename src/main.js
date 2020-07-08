import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify';
import { ACTION } from './data/ACTIONS';

Vue.config.productionTip = false

new Vue({
  store,
  vuetify,
  render: h => h(App),
  beforeMount() {
    this.$store.dispatch(ACTION.LOAD_LAST_STATE);
  }
}).$mount('#app')
