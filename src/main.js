import {library} from '@fortawesome/fontawesome-svg-core';
import {faEnvelope, faLock} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {createApp} from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

require('@/assets/main.scss');

// register icons
library.add([faLock, faEnvelope]);

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .use(store)
  .use(router)
  .mount('#app');
