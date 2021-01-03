<template>
  <section v-if="!loading && trips" class="section">
    <h1 class="title">Your Trips</h1>

    <table class="table">
      <thead>
        <th>Name</th>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Created at</th>
        <th>Edit</th>
      </thead>
      <tbody>
        <tr v-for="trip in trips" :key="trip.id">
          <td>{{ trip.name }}</td>
          <td>{{ trip.startDate }}</td>
          <td>{{ trip.endDate }}</td>
          <td>{{ trip.created }}</td>
          <td>
            <router-link
              :to="{name: 'tripsMyTrip', params: {id: trip.id}}"
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
import {useQuery, useResult} from '@vue/apollo-composable';
import myTripsQuery from '../graphql/myTrips.query.gql';

export default {
  setup() {
    const {result, loading, error} = useQuery(myTripsQuery);
    const trips = useResult(result, null, data => data.myTrips);
    return {trips, loading, error};
  },
};
</script>
