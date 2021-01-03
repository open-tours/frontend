<template>
  <section v-if="!loading && tours" class="section">
    <h1 class="title">Your tours</h1>

    <table class="table">
      <thead>
        <th>Name</th>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Created at</th>
        <th>Edit</th>
      </thead>
      <tbody>
        <tr v-for="tour in tours" :key="tour.id">
          <td>{{ tour.name }}</td>
          <td>{{ tour.startDate }}</td>
          <td>{{ tour.endDate }}</td>
          <td>{{ tour.created }}</td>
          <td>
            <router-link
              :to="{ name: 'toursMyTour', params: { id: tour.id } }"
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
import myToursQuery from "../graphql/myTours.query.gql";

export default {
  setup() {
    const { result, loading, error } = useQuery(myToursQuery);
    const tours = useResult(result, null, data => data.myTours);
    return { tours, loading, error };
  }
};
</script>
