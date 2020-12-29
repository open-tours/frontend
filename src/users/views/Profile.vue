<template>
  <section v-if="Object.keys(profileData).length" class="section">
    <h1 class="title">Your Profile</h1>

    <table class="table">
      <tbody>
        <tr>
          <td><strong>Email</strong></td>
          <td>{{ profileData.email }}</td>
        </tr>
        <tr>
          <td><strong>Last login</strong></td>
          <td>{{ lastLogin }}</td>
        </tr>
        <tr>
          <td><strong>Date joined</strong></td>
          <td>{{ dateJoined }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
<script>
import {formatDateTime} from '@/utils/filters';
import {useQuery, useResult} from '@vue/apollo-composable';
import meQuery from '../graphql/me.query.gql';

export default {
  setup() {
    const {result} = useQuery(meQuery);

    const profileData = useResult(result, {}, d => d.me);
    return {profileData};
  },
  computed: {
    lastLogin() {
      return formatDateTime(this.profileData.lastLogin);
    },
    dateJoined() {
      return formatDateTime(this.profileData.dateJoined);
    },
  },
};
</script>
