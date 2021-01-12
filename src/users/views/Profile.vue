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

        <ProfileTextAttributeEdit
          name="Name"
          attributeName="name"
          :attributeValue="profileData.name || 'not set'"
        />
        <ProfileImageAttributeEdit
          name="Profile image"
          attributeName="profileImage"
          :attributeValue="profileData.profileImage"
        />
        <ProfileTextAttributeEdit
          name="Logbook title"
          attributeName="logbookTitle"
          :attributeValue="profileData.logbookTitle || 'not set'"
        />
        <ProfileImageAttributeEdit
          name="Logbook header image"
          attributeName="logbookHeaderImage"
          :attributeValue="profileData.logbookHeaderImage"
        />

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
import ProfileTextAttributeEdit from "../components/ProfileTextAttributeEdit";
import ProfileImageAttributeEdit from "../components/ProfileImageAttributeEdit";

export default {
  setup() {
    const env = ref(process.env);
    const { result, refetch } = useQuery(meQuery);
    const profileData = useResult(result, {}, d => d.me);
    return { env, profileData, refetch };
  },
  components: {
    ProfileTextAttributeEdit,
    ProfileImageAttributeEdit
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
