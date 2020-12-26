import userStore from './users/store';
import {createStore} from 'vuex';

const store = createStore({
  modules: {
    user: userStore,
  },
});

export default store;
