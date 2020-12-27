<template>
  <nav aria-label="main navigation" class="navbar" role="navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="https://bulma.io" @click="hideNavBarMenu">
        <img
          height="28"
          src="https://bulma.io/images/bulma-logo.png"
          width="112"
        />
      </a>

      <a
        aria-expanded="false"
        aria-label="menu"
        class="navbar-burger"
        data-target="navbarBasicExample"
        role="button"
        v-bind:class="{'is-active': isNavBarMenuActive}"
        @click="toogleNavBarMenu"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div class="navbar-menu" v-bind:class="{'is-active': isNavBarMenuActive}">
      <div class="navbar-start">
        <router-link
          :to="{name: 'home'}"
          class="navbar-item"
          tag="a"
          @click="hideNavBarMenu"
        >
          Home
        </router-link>

        <a class="navbar-item" @click="hideNavBarMenu">
          Explore Tours
        </a>

        <div
          class="navbar-item has-dropdown is-hoverable"
          @click="hideNavBarMenu"
        >
          <a class="navbar-link">
            You
          </a>

          <div class="navbar-dropdown">
            <router-link
              :to="{name: 'userProfile'}"
              class="navbar-item"
              tag="a"
              @click="hideNavBarMenu"
            >
              Profile
            </router-link>

            <a class="navbar-item">
              Your Tours
            </a>

            <router-link :to="{name: 'userLogout'}" class="navbar-item" tag="a">
              Log out
            </router-link>
          </div>
        </div>
      </div>

      <div class="navbar-end">
        <div class="navbar-item" @click="hideNavBarMenu">
          <div v-if="isAuthenticated" class="buttons">
            <button class="button is-success">
              <span class="icon is-small">
                <font-awesome-icon icon="plus" />
              </span>
              <span>Tour</span>
            </button>
          </div>
          <div v-if="!isAuthenticated" class="buttons">
            <a class="button is-primary">
              <strong>Sign up</strong>
            </a>

            <router-link
              :to="{name: 'userLogin'}"
              class="button is-light"
              tag="a"
            >
              <strong>Log in</strong>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
  <router-view />
</template>

<script>
import {getAuthToken} from '@/apollo';
import {ref} from 'vue';

export default {
  setup() {
    const isAuthenticated = ref(false);
    const isNavBarMenuActive = ref(false);
    return {isNavBarMenuActive, isAuthenticated};
  },
  mounted() {
    if (getAuthToken()) this.isAuthenticated = true;
  },
  methods: {
    toogleNavBarMenu() {
      this.isNavBarMenuActive = !this.isNavBarMenuActive;
    },
    hideNavBarMenu() {
      this.isNavBarMenuActive = false;
    },
  },
};
</script>
