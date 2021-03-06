import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { createUploadLink } from "apollo-upload-client";
import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";

export const AUTH_TOKEN_KEY = "auth-token";

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY) || null;
}

let apiURL = process.env.VUE_APP_API_URL;

// we need to overwrite dynamically to handle CORS for subdomains
if (process.env.NODE_ENV === "development") {
  const l = window.location;
  apiURL = `${l.protocol}//${l.host}/api/v1/`;
}

// http and upload Link
const uploadLink = createUploadLink({
  uri: apiURL
});

const authLink = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  if (getAuthToken()) {
    operation.setContext({
      headers: {
        Authorization: `JWT ${getAuthToken()}`
      }
    });
  }
  return forward(operation);
});

const errorLink = onError(({ networkError, graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `!!! [GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
  if (networkError) console.log(`!!! [Network error]: ${networkError}`);
});

const cache = new InMemoryCache();

const link = ApolloLink.from([errorLink, authLink, uploadLink]);

export const apolloClient = new ApolloClient({
  link: link,
  cache
});

export async function onLogin(token) {
  if (typeof localStorage !== "undefined" && token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
  try {
    await apolloClient.resetStore();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("%cError on cache reset (login)", "color: orange;", e.message);
  }
}

export async function onLogout() {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
  try {
    await apolloClient.resetStore();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log("%cError on cache reset (logout)", "color: orange;", e.message);
  }
}
