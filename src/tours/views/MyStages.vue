<template>
  <section v-if="!loading && stages" class="section">
    <h1 class="title">Your Tour Stages</h1>

    <table class="table">
      <thead>
        <th>Name</th>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Created at</th>
        <th>Edit</th>
      </thead>
      <tbody>
        <tr v-for="stage in stages" :key="stage.id">
          <td>{{ stage.name }}</td>
          <td>{{ stage.startDate }}</td>
          <td>{{ stage.endDate }}</td>
          <td>{{ stage.created }}</td>
          <td>
            <router-link
              :to="{ name: 'toursMyStage', params: { id: stage.id } }"
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
import myStagesQuery from "../graphql/myStages.query.gql";

export default {
  setup() {
    const { result, loading, error } = useQuery(myStagesQuery);
    const stages = useResult(result, null, data => data.myStages);
    return { stages: stages, loading, error };
  }
};
</script>
