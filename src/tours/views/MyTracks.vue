<template>
  <section v-if="!loading && tracks" class="section">
    <h1 class="title">Your Tracks</h1>

    <table class="table">
      <thead>
        <th>Name</th>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Created at</th>
        <th>Edit</th>
      </thead>
      <tbody>
        <tr v-for="track in tracks" :key="track.id">
          <td>{{ track.name }}</td>
          <td>{{ track.startDate }}</td>
          <td>{{ track.endDate }}</td>
          <td>{{ track.created }}</td>
          <td>
            <router-link
              :to="{ name: 'toursMyTrack', params: { id: track.id } }"
              tag="a"
            >
              edit
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
import { useQuery, useResult } from "@vue/apollo-composable";
import myTracksQuery from "../graphql/myTracks.query.gql";

export default {
  setup() {
    const { result, loading, error } = useQuery(myTracksQuery);
    const tracks = useResult(result, null, data => data.myTracks);
    return { tracks: tracks, loading, error };
  }
};
</script>
