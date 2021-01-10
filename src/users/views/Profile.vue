<template>
  <section v-if="profileData.id" class="section">
    <h1 class="title">Your Profile</h1>

    <table class="table">
      <tbody>
        <tr>
          <td><strong>Email</strong></td>
          <td>{{ profileData.email }}</td>
          <td></td>
        </tr>
        <tr>
          <td><strong>Name</strong></td>
          <td>
            {{ profileData.name }}
          </td>
          <td>
            <button class="is-small">
              <span class="icon is-small">
                <font-awesome-icon icon="pen" />
              </span>
            </button>
          </td>
        </tr>
        <tr>
          <td><strong>Logbook Name</strong></td>
          <td>
            {{ profileData.logbookTitle || "not set" }}
          </td>
          <td>
            <button class="is-small">
              <span class="icon is-small">
                <font-awesome-icon icon="pen" />
              </span>
            </button>
          </td>
        </tr>
        <tr>
          <td><strong>Logbook URL</strong></td>
          <td>
            <span v-if="logbookUrl">
              <a :href="logbookUrl" target="_blank">{{ logbookUrl }}</a>
            </span>
            <span v-else>not set</span>
          </td>
          <td></td>
        </tr>
        <tr>
          <td><strong>Last login</strong></td>
          <td>{{ lastLogin }}</td>
          <td></td>
        </tr>
        <tr>
          <td><strong>Date joined</strong></td>
          <td>{{ dateJoined }}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
<script>
import { formatDateTime } from "@/utils/filters";
import { useQuery, useResult } from "@vue/apollo-composable";
import { ref } from "vue";
import meQuery from "../graphql/me.query.gql";

export default {
  setup() {
    const env = ref(process.env);
    const { result } = useQuery(meQuery);

    const profileData = useResult(result, {}, d => d.me);
    return { env, profileData };
  },
  computed: {
    lastLogin() {
      return formatDateTime(this.profileData.lastLogin);
    },
    dateJoined() {
      return formatDateTime(this.profileData.dateJoined);
    },
    logbookUrl() {
      if (this.profileData.logbookPrefix) {
        return `${window.location.origin}/${this.profileData.logbookPrefix}`;
      }
      return null;
    }
  }
};
</script>
