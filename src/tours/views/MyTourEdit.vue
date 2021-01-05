<template>
  <section v-if="Object.keys(track).length" class="hero is-primary is-small">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">
          <h1 class="title">{{ track.name }}</h1>
        </h1>
        <h2 class="subtitle">{{ startEndDate }} - by {{ track.owner.name }}</h2>
      </div>
    </div>
  </section>

  <div v-if="!createTrackOpen">
    <div class="columns">
      <div class="column">
        <Map
          v-bind:geojsonLayers="geojsonLayers"
          style="width: 100%; height: 100%; min-height: 350px;"
        ></Map>
      </div>

      <div class="column is-one-third">
        <div class="panel">
          <p class="panel-heading">
            Tracks
            <button
              class="button is-small is-pulled-right"
              v-on:click="createTrackOpen = true"
            >
              <span class="icon is-small">
                <font-awesome-icon icon="plus" />
              </span>
            </button>
          </p>
          <a v-for="track in track.tracks" :key="track.id" class="panel-block">
            {{ track.name }}
          </a>
        </div>

        <div class="card">
          <div class="card-image">
            <figure class="image is-4by3">
              <img alt="Placeholder image" v-bind:src="track.coverImage" />
            </figure>
          </div>
          <div class="card-content">
            {{ track.description }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="createTrackOpen">
    <div class="columns">
      <div class="column">
        <form class="box" @submit.prevent="submitForm">
          <h1 class="title">
            Add Track
            <button
              class="button is-small is-danger is-pulled-right"
              v-on:click="createTrackOpen = close"
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

            <div v-if="trackCreateError.length" class="notification is-danger">
              <ul>
                <li v-for="error in trackCreateError" :key="error">
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
                  <span v-if="!doingGPXFileUpload" class="file-icon">
                    <font-awesome-icon icon="upload" />
                  </span>
                  <span v-if="!doingGPXFileUpload" class="file-label">
                    Choose a file…
                  </span>
                  <span v-if="doingGPXFileUpload">
                    <font-awesome-icon icon="spinner" pulse />
                  </span>
                </span>
                <span class="file-name">
                  {{ gpxFile.name }}
                </span>
              </label>
            </div>
          </div>

          <div class="field">
            <label class="label">Name</label>
            <div class="control">
              <input v-model="trackData.name" class="input" type="text" />
            </div>
          </div>

          <div class="field">
            <label class="label">Description</label>
            <div class="control">
              <input
                v-model="trackData.description"
                class="input"
                type="text"
              />
            </div>
          </div>

          <div class="field">
            <label class="label">Start date</label>
            <div class="control">
              <input v-model="trackData.startDate" class="input" type="text" />
            </div>
          </div>

          <div class="field">
            <label class="label">End date</label>
            <div class="control">
              <input v-model="trackData.endDate" class="input" type="text" />
            </div>
          </div>

          <div class="field">
            <label class="label">Moving time</label>
            <div class="columns">
              <div class="column">
                <div class="control">
                  <input
                    v-model="trackData.movingTime.hours"
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
                      v-model="trackData.movingTime.minutes"
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
                    v-model="trackData.stoppedTime.hours"
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
                      v-model="trackData.stoppedTime.minutes"
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
              <input v-model="trackData.distanceKm" class="input" type="text" />
            </div>
          </div>

          <div class="field">
            <label class="label">Average Speed (km/h)</label>
            <div class="control">
              <input
                v-model="trackData.avgSpeedKmPerH"
                class="input"
                type="text"
              />
            </div>
          </div>

          <div class="field">
            <label class="label">Maximum Speed (km/h)</label>
            <div class="control">
              <input
                v-model="trackData.maxSpeedKmPerH"
                class="input"
                type="text"
              />
            </div>
          </div>

          <div class="field">
            <label class="label">Uphill (m)</label>
            <div class="control">
              <input v-model="trackData.uphillM" class="input" type="text" />
            </div>
          </div>

          <div class="field">
            <label class="label">Downhill (m)</label>
            <div class="control">
              <input v-model="trackData.downhillM" class="input" type="text" />
            </div>
          </div>

          <div class="field">
            <button
              :disabled="doTrackCreate || doingGPXFileUpload"
              class="button is-success"
              @click="addTrack"
            >
              Add
            </button>
          </div>
        </form>
      </div>
      <div class="column"></div>
    </div>
  </div>
</template>

<script>
import { formatDate } from "@/utils/filters";
import { useMutation, useQuery, useResult } from "@vue/apollo-composable";
import { ref } from "@vue/reactivity";
import axios from "axios";
import { useRoute } from "vue-router";
import Map from "../components/Map";
import gpxFileInfoMutation from "../graphql/gpxFileInfo.mutation.gql";
import trackCreateMutation from "../graphql/trackCreate.mutation.gql";
import tourQuery from "../graphql/track.query.gql";

export default {
  setup() {
    const geojsonLayers = ref([]);
    const createTrackOpen = ref(false);
    const trackData = ref({
      movingTime: {
        hours: null,
        minutes: null
      },
      stoppedTime: {
        hours: null,
        minutes: null
      }
    });
    let gpxFile = ref({});
    const trackCreateError = ref([]);
    const route = useRoute();

    const { result, onResult: onTourQueryResult } = useQuery(tourQuery, {
      id: route.params.id
    });
    const track = useResult(result, {}, d => d.track);

    const getGeoJsonPreview = async () => {
      const promises = [];
      for (const track of track.value.tracks) {
        promises.push(axios.get(track.geojsonPreview));
      }
      Promise.all(promises).then(function(results) {
        for (const result of results) {
          geojsonLayers.value.push(result.data);
        }
      });
    };

    onTourQueryResult(() => {
      getGeoJsonPreview();
    });

    // GPX file upload
    const {
      mutate: doGPXFileUpload,
      onDone: onGPXFileUploadDone,
      onError: onGPXFileUploadError,
      loading: processingGPXFileUpload
    } = useMutation(gpxFileInfoMutation);
    onGPXFileUploadDone(result => {
      trackData.value = result.data.gpxFileInfo;
    });
    onGPXFileUploadError(errors => {
      trackCreateError.value = errors.graphQLErrors;
    });

    // add Track
    const {
      mutate: doTrackCreate,
      onDone: ontrackCreateMutationDone,
      onError: ontrackCreateMutationError,
      loading: processingTrackCreate
    } = useMutation(trackCreateMutation);
    ontrackCreateMutationDone(result => {
      trackData.value = result.data.gpxFileInfo;
    });
    ontrackCreateMutationError(errors => {
      trackCreateError.value = errors.graphQLErrors;
    });

    return {
      track,
      trackData,
      geojsonLayers,
      createTrackOpen,
      gpxFile,
      doGPXFileUpload,
      processingGPXFileUpload,
      doTrackCreate,
      processingTrackCreate,
      trackCreateError
    };
  },
  components: {
    Map
  },
  computed: {
    startEndDate() {
      let startEndDate = formatDate(this.track.startDate);
      if (this.track.endDate) {
        startEndDate += ` - ${formatDate(this.track.endDate)}`;
      }
      return startEndDate;
    }
  },
  methods: {
    gpxFileChange(event) {
      if (!event.target.files.length) {
        return;
      }
      this.trackCreateError = [];
      this.gpxFile = event.target.files[0];
      this.doGPXFileUpload({ file: this.gpxFile }).then(() => {});
    },
    addTrack() {
      this.trackData.tourId = this.$route.params.id;

      if (this.gpxFile) {
        this.trackData.gpxFile = this.gpxFile;
      }

      // make GQL inputs flat
      this.trackData.movingTimeHours = this.trackData.movingTime.hours;
      this.trackData.movingTimeMinutes = this.trackData.movingTime.minutes;
      this.trackData.stoppedTimeHours = this.trackData.stoppedTime.hours;
      this.trackData.stoppedTimeMinutes = this.trackData.stoppedTime.minutes;

      // create
      this.doTrackCreate(this.trackData).then(() => {
        this.createTrackOpen = false;
      });
    }
  }
};
</script>
