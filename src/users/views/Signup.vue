<template>
  <section class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-5-tablet is-4-desktop is-3-widescreen">
          <form class="box" @submit.prevent="submitForm">
            <h1 class="title">
              Sign up
            </h1>
            <div class="field">
              <div class="control has-icons-left">
                <input
                  v-model="signupData.email"
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
                  v-model="signupData.name"
                  class="input"
                  placeholder="Your name"
                  required
                  type="text"
                  autocomplete="name"
                />
                <span class="icon is-small is-left">
                  <font-awesome-icon icon="id-badge" />
                </span>
              </div>
            </div>
            <div class="field">
              <div class="control has-icons-left">
                <input
                  v-model="signupData.password"
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

            <div v-if="signupErrors.length" class="notification is-danger">
              <ul>
                <li v-for="error in signupErrors" :key="error">
                  {{ error.message }}
                </li>
              </ul>
            </div>

            <div class="field">
              <button :disabled="loading" class="button is-success">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { onLogout } from "@/utils/apollo";
import { useMutation } from "@vue/apollo-composable";
import { ref } from "vue";
import creatUserMutation from "../graphql/createUser.mutation.gql";

export default {
  setup() {
    const signupData = ref(null);
    const signupErrors = ref([]);

    const { mutate: doCreate, loading, onError } = useMutation(
      creatUserMutation
    );
    onError(errors => {
      signupErrors.value = errors.graphQLErrors;
    });

    return { doCreate, loading, signupData, signupErrors };
  },
  methods: {
    submitForm() {
      this.signupErrors = [];
      this.doCreate(this.signupData).then(() => {
        onLogout();
        this.$router.push({ name: "usersLogin" });
      });
    }
  }
};
</script>
