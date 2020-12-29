<template>
  <section v-if="Object.keys(trip).length" class="hero is-primary">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">
          <h1 class="title">{{ trip.name }}</h1>
        </h1>
        <h2 class="subtitle">
          {{ this.startEndDate }} - by {{ trip.owner.name }}
        </h2>
      </div>
    </div>
  </section>
  <div v-if="Object.keys(trip).length" class="tile is-ancestor">
    <div class="tile is-vertical is-12">
      <div class="tile">
        <div class="tile is-parent">
          <section class="section">
            <div class="card">
              <div class="card-image">
                <figure class="image is-4by3">
                  <img alt="Placeholder image" v-bind:src="trip.coverImage" />
                </figure>
              </div>
              <div class="card-content">
                {{ trip.description }}
              </div>
            </div>
          </section>
        </div>

        <div class="tile is-parent is-vertical">
          <section class="section">
            <div class="tile is-child">
              <div class="panel is-dark">
                <p class="panel-heading">
                  Stages
                </p>
                <a class="panel-block is-active">
                  München - Schrozberg
                </a>
                <a class="panel-block is-active">
                  Schrozberg - Frankfurt a. M.
                </a>
              </div>
            </div>
            <br />
            <div class="tile is-child">
              <Map />
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {formatDate} from '@/utils/filters';
import {useQuery, useResult} from '@vue/apollo-composable';
import {useRoute} from 'vue-router';
import Map from '../components/Map';
import tripQuery from '../graphql/trip.query.gql';

export default {
  setup() {
    const route = useRoute();
    const {result} = useQuery(tripQuery, {
      id: route.params.id,
    });
    const trip = useResult(result, {}, d => d.trip);
    return {trip};
  },
  components: {
    Map,
  },
  computed: {
    startEndDate() {
      let startEndDate = formatDate(this.trip.startDate);
      if (this.trip.endDate) {
        startEndDate += ` - ${formatDate(this.trip.endDate)}`;
      }
      return startEndDate;
    },
  },
};
</script>
