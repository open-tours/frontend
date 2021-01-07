<template>
  <nav aria-label="main navigation" class="navbar has-shadow" role="navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="/" @click="hideNavBarMenu">
        <img height="28" src="../assets/logo.png" />
      </a>

      <a
        aria-expanded="false"
        aria-label="menu"
        class="navbar-burger"
        data-target="navbarBasicExample"
        role="button"
        v-bind:class="{ 'is-active': isNavBarMenuActive }"
        @click="toogleNavBarMenu"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div class="navbar-menu" v-bind:class="{ 'is-active': isNavBarMenuActive }">
      <div class="navbar-start">
        <router-link
          :to="{ name: 'home' }"
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
          v-if="isAuthenticated"
          @click="hideNavBarMenu"
          class="navbar-item has-dropdown is-hoverable"
        >
          <a class="navbar-link">
            My
          </a>

          <div class="navbar-dropdown">
            <router-link
              :to="{ name: 'usersMyProfile' }"
              class="navbar-item"
              tag="a"
              @click="hideNavBarMenu"
            >
              Profile
            </router-link>

            <router-link
              :to="{ name: 'toursMyTours' }"
              class="navbar-item"
              tag="a"
              @click="hideNavBarMenu"
            >
              Tracks
            </router-link>

            <router-link
              @click="hideNavBarMenu"
              :to="{ name: 'usersLogout' }"
              class="navbar-item"
              tag="a"
            >
              Log out
            </router-link>
          </div>
        </div>
      </div>

      <div class="navbar-end">
        <div class="navbar-item" @click="hideNavBarMenu">
          <div v-if="isAuthenticated" class="buttons">
            <router-link
              :to="{ name: 'toursMyTrackAdd' }"
              class="button is-success"
              tag="a"
            >
              <span class="icon is-small">
                <font-awesome-icon icon="plus" />
              </span>
              <span>Track</span>
            </router-link>
          </div>
          <div v-if="!isAuthenticated" class="buttons">
            <router-link :to="{ name: 'usersSignup' }" class="button" tag="a">
              <strong>Sign up</strong>
            </router-link>

            <router-link
              :to="{ name: 'usersLogin' }"
              class="button is-success"
              tag="a"
            >
              <strong>Log in</strong>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref } from "vue";

export default {
  props: ["isAuthenticated"],
  setup() {
    const isNavBarMenuActive = ref(false);
    return { isNavBarMenuActive };
  },
  methods: {
    toogleNavBarMenu() {
      this.isNavBarMenuActive = !this.isNavBarMenuActive;
    },
    hideNavBarMenu() {
      this.isNavBarMenuActive = false;
    }
  }
};
</script>
