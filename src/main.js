import Vue from 'vue';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faGithub, faTwitter, faTelegram, faMedium, faDiscord
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';


import App from './App.vue';
import router from './router';
import Buefy from 'buefy';
import AsyncComputed from 'vue-async-computed'

import 'buefy/dist/buefy.css';
import './assets/font/font.css';

Vue.use(Buefy);
Vue.use(AsyncComputed)
// use plugin,it will mount Banner and slide components globally

library.add(faGithub, faTwitter, faTelegram, faMedium, faDiscord);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;
new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
