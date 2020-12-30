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

  <div v-if="!addStageOpen">
    <div class="columns">
      <div class="column">
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

      <div class="column">
        <section class="section">
          <div class="panel is-dark">
            <p class="panel-heading">
              Stages
              <button
                class="button is-small is-success is-pulled-right"
                v-on:click="addStageOpen = true"
              >
                <span class="icon is-small">
                  <font-awesome-icon icon="plus" />
                </span>
              </button>
            </p>
            <a class="panel-block is-active">
              München - Schrozberg
            </a>
            <a class="panel-block is-active">
              Schrozberg - Frankfurt a. M.
            </a>
          </div>
          <br />
          <Map />
        </section>
      </div>
    </div>
  </div>

  <div v-if="addStageOpen">
    <div class="columns">
      <div class="column">
        <form class="box" @submit.prevent="submitForm">
          <h1 class="title">
            Add Stage
            <button
              class="button is-small is-danger is-pulled-right"
              v-on:click="addStageOpen = close"
            >
              <span class="icon is-small">
                <font-awesome-icon icon="window-close" />
              </span>
            </button>
          </h1>

          <div class="field">
            <label class="label"
              >Start with a GPX file to get the fields below prefilled
              (optional)</label
            >

            <div v-if="addStageErrors.length" class="notification is-danger">
              <ul>
                <li v-for="error in addStageErrors" :key="error">
                  {{ error.message }}
                </li>
              </ul>
            </div>

            <div class="file has-name is-fullwidth">
              <label class="file-label">
                <input
                  class="file-input"
                  name="resume"
                  type="file"
                  @change="gpxFileChange"
                />
                <span class="file-cta">
                  <span v-if="!loadingGPXFileUpload" class="file-icon">
                    <font-awesome-icon icon="upload" />
                  </span>
                  <span v-if="!loadingGPXFileUpload" class="file-label">
                    Choose a file…
                  </span>
                  <span v-if="loadingGPXFileUpload">
                    <font-awesome-icon icon="spinner" pulse />
                  </span>
                </span>
                <span class="file-name">
                  {{ gpxFileName }}
                </span>
              </label>
            </div>
          </div>

          <div class="field">
            <label class="label">Name</label>
            <div class="control">
              <input v-model="stageData.name" class="input" type="text" />
            </div>
          </div>

          <div class="field">
            <label class="label">Start date</label>
            <div class="control">
              <input v-model="stageData.startDate" class="input" type="text" />
            </div>
          </div>

          <div class="field">
            <label class="label">End date</label>
            <div class="control">
              <input v-model="stageData.endDate" class="input" type="text" />
            </div>
          </div>

          <div class="field">
            <label class="label">Moving time</label>
            <div class="columns">
              <div class="column">
                <div class="control">
                  <input
                    v-model="stageData.movingTime.hours"
                    class="input"
                    type="text"
                  />
                  hours
                </div>
              </div>
              <div class="column">
                <div class="field">
                  <div class="control">
                    <input
                      v-model="stageData.movingTime.minutes"
                      class="input"
                      type="text"
                    />
                    minutes
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="field">
            <label class="label">Stopped time</label>
            <div class="columns">
              <div class="column">
                <div class="control">
                  <input
                    v-model="stageData.stoppedTime.hours"
                    class="input"
                    type="text"
                  />
                  hours
                </div>
              </div>
              <div class="column">
                <div class="field">
                  <div class="control">
                    <input
                      v-model="stageData.stoppedTime.minutes"
                      class="input"
                      type="text"
                    />
                    minutes
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="field">
            <label class="label">Distance (km)</label>
            <div class="control">
              <input v-model="stageData.distanceKm" class="input" type="text" />
            </div>
          </div>

          <div class="field">
            <label class="label">Average Speed (km/h)</label>
            <div class="control">
              <input
                v-model="stageData.avgSpeedKmPerH"
                class="input"
                type="text"
              />
            </div>
          </div>

          <div class="field">
            <label class="label">Maximum Speed (km/h)</label>
            <div class="control">
              <input
                v-model="stageData.maxSpeedKmPerH"
                class="input"
                type="text"
              />
            </div>
          </div>

          <div class="field">
            <label class="label">Uphill (m)</label>
            <div class="control">
              <input v-model="stageData.uphillM" class="input" type="text" />
            </div>
          </div>

          <div class="field">
            <label class="label">Downhill (m)</label>
            <div class="control">
              <input v-model="stageData.downhillM" class="input" type="text" />
            </div>
          </div>

          <div class="field">
            <button :disabled="addStageLoading" class="button is-success">
              Add
            </button>
          </div>
        </form>
      </div>
      <div class="column"></div>
      <div class="column"></div>
    </div>
  </div>
</template>

<script>
import {formatDate} from '@/utils/filters';
import {useMutation, useQuery, useResult} from '@vue/apollo-composable';
import {ref} from '@vue/reactivity';
import {useRoute} from 'vue-router';
import Map from '../components/Map';
import gpxFileInfoMutation from '../graphql/gpxFileInfo.mutation.gql';
import tripQuery from '../graphql/trip.query.gql';

export default {
  setup() {
    const addStageOpen = ref(false);
    const stageData = ref({
      movingTime: {
        hours: null,
        minutes: null,
      },
      stoppedTime: {
        hours: null,
        minutes: null,
      },
    });
    const gpxFileName = ref('');
    const addStageLoading = ref(false);
    const addStageErrors = ref([]);
    const route = useRoute();

    const {result} = useQuery(tripQuery, {
      id: route.params.id,
    });
    const trip = useResult(result, {}, d => d.trip);

    const {
      mutate: doGPXFileUpload,
      onDone,
      onError,
      loading: loadingGPXFileUpload,
    } = useMutation(gpxFileInfoMutation);
    onDone(result => {
      stageData.value = result.data.gpxFileInfo;
    });
    onError(errors => {
      addStageErrors.value = errors.graphQLErrors;
    });

    return {
      trip,
      stageData,
      addStageOpen,
      gpxFileName,
      doGPXFileUpload,
      loadingGPXFileUpload,
      addStageLoading,
      addStageErrors,
    };
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
  methods: {
    gpxFileChange(event) {
      if (!event.target.files.length) {
        return;
      }
      this.addStageErrors = [];
      this.gpxFileName = event.target.files[0].name;
      const file = event.target.files[0];
      this.doGPXFileUpload({file}).then(() => {});
    },
  },
};
</script>
