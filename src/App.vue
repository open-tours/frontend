<template>
  <NavBar v-bind:isAuthenticated="isAuthenticated" />
  <router-view />
</template>

<script>
import {getAuthToken} from '@/utils/apollo';
import {ref} from 'vue';
import NavBar from '@/components/NavBar';

export default {
  components: {
    NavBar,
  },
  setup() {
    const isAuthenticated = ref(false);
    return {isAuthenticated};
  },
  mounted() {
    if (getAuthToken()) this.isAuthenticated = true;
  },
};
</script>
