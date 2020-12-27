<template>
  <div />
</template>

<script>
import {onLogout} from '@/utils/apollo';

export default {
  mounted() {
    onLogout();
    this.$root.isAuthenticated = false;
    this.$router.push({name: 'home'});
  },
};
</script>
