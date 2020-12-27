<template>
  <section class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-5-tablet is-4-desktop is-3-widescreen">
          <form class="box" @submit.prevent="submitForm">
            <h1 class="title">
              Login
            </h1>
            <div class="field">
              <div class="control has-icons-left">
                <input
                  v-model="authData.email"
                  class="input"
                  placeholder="Email address"
                  required
                  type="email"
                  autocomplete="username"
                />
                <span class="icon is-small is-left">
                  <font-awesome-icon icon="envelope" />
                </span>
              </div>
            </div>
            <div class="field">
              <div class="control has-icons-left">
                <input
                  v-model="authData.password"
                  class="input"
                  placeholder="Password"
                  required
                  type="password"
                  autocomplete="current-password"
                />
                <span class="icon is-small is-left">
                  <font-awesome-icon icon="lock" />
                </span>
              </div>
            </div>
            <div class="field">
              <label class="checkbox" for="">
                <input type="checkbox" />
                Remember me
              </label>
            </div>

            <div v-if="authErrors.length" class="notification is-danger">
              <ul>
                <li v-for="error in authErrors" :key="error">
                  {{ error.message }}
                </li>
              </ul>
            </div>

            <div class="field">
              <button :disabled="loading" class="button is-success">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {onLogin} from '@/utils/apollo';
import {useMutation} from '@vue/apollo-composable';
import {ref} from 'vue';
import tokenAuthMutation from '../graphql/tokenAuth.mutation.gql';

export default {
  setup() {
    const authData = ref({});
    const authErrors = ref([]);

    const {mutate: doTokenAuth, loading, onError, onDone} = useMutation(
      tokenAuthMutation,
    );
    onDone(result => {
      onLogin(result.data.tokenAuth.token);
    });
    onError(errors => {
      authErrors.value = errors.graphQLErrors;
    });

    return {doTokenAuth, loading, authData, authErrors};
  },
  methods: {
    submitForm() {
      this.authErrors = [];
      this.doTokenAuth(this.authData).then(() => {
        this.$root.isAuthenticated = true;
        this.$router.push({name: 'userProfile'});
      });
    },
  },
};
</script>
