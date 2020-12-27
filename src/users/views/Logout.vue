<script>
import {onLogout} from '@/apollo';

export default {
  mounted() {
    onLogout();
    this.$root.isAuthenticated = false;
    this.$router.push({name: 'home'});
  },
};
</script>
