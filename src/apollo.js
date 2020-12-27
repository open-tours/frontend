import {InMemoryCache} from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import {ApolloLink, concat} from 'apollo-link';
import {createHttpLink} from 'apollo-link-http';

export const AUTH_TOKEN_KEY = 'auth-token';

const httpEndpoint = createHttpLink({
  uri: 'http://localhost:8080/api/v1/',
});

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY) || null;
}

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext({
    headers: {
      Authorization: `JWT ${getAuthToken()}`,
    },
  });
  return forward(operation);
});

const cache = new InMemoryCache();

export const apolloClient = new ApolloClient({
  link: concat(authMiddleware, httpEndpoint),
  cache,
});

export async function onLogin(token) {
  if (typeof localStorage !== 'undefined' && token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
  try {
    await apolloClient.resetStore();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('%cError on cache reset (login)', 'color: orange;', e.message);
  }
}

export async function onLogout() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
  try {
    await apolloClient.resetStore();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('%cError on cache reset (logout)', 'color: orange;', e.message);
  }
}
