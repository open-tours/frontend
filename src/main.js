import {library} from '@fortawesome/fontawesome-svg-core';
import {faEnvelope, faLock} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {DefaultApolloClient} from '@vue/apollo-composable';
import {InMemoryCache} from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import {ApolloLink, concat} from 'apollo-link';
import {createHttpLink} from 'apollo-link-http';
import {createApp} from 'vue';
import App from './App.vue';
import router from './router';
import {AUTH_TOKEN_KEY} from './apollo';
import store from './store';

require('@/assets/main.scss');

// register icons
library.add([faLock, faEnvelope]);

const httpEndpoint = createHttpLink({
  uri: 'http://localhost:8080/api/v1/',
});

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext({
    headers: {
      authorization: localStorage.getItem(AUTH_TOKEN_KEY) || null,
    },
  });
  return forward(operation);
});

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  link: concat(authMiddleware, httpEndpoint),
  cache,
});

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .use(store)
  .use(router)
  .provide(DefaultApolloClient, apolloClient)
  .mount('#app');
