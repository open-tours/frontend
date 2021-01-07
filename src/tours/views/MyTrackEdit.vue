<template>
  <div class="section">
    <div class="columns">
      <div class="column is-three-fifths">
        <form class="box">
          <h1 class="title">
            Add Track
            <router-link
              :to="{ name: 'toursMyTracks' }"
              class="button is-small is-danger is-pulled-right"
              tag="a"
            >
              <span class="icon is-small">
                <font-awesome-icon icon="window-close" />
              </span>
            </router-link>
          </h1>

          <div class="field">
            <label class="label"
              >Start with a GPX file to get the fields below prefilled
              (optional)</label
            >

            <div
              v-if="gpxFileUploadErrors.length"
              class="notification is-danger"
            >
              <ul>
                <li v-for="error in gpxFileUploadErrors" :key="error">
                  {{ error.message }}
                </li>
              </ul>
            </div>

            <div class="file has-name is-fullwidth">
              <label class="file-label">
                <input
                  class="file-input"
                  type="file"
                  accept="application/gpx+xml,application/xml"
                  @change="gpxFileChange"
                />
                <span class="file-cta">
                  <span v-if="!processingGPXFileUpload" class="file-icon">
                    <font-awesome-icon icon="upload" />
                  </span>
                  <span v-if="!processingGPXFileUpload" class="file-label">
                    Choose a file…
                  </span>
                  <span v-if="processingGPXFileUpload">
                    <font-awesome-icon icon="spinner" pulse />
                  </span>
                </span>
                <span v-if="gpxFile" class="file-name">
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

          <TrackImageSelector ref="imageSelector" />

          <div class="field">
            <div v-if="trackCreateErrors.length" class="notification is-danger">
              <ul>
                <li v-for="error in trackCreateErrors" :key="error">
                  {{ error.message }}
                </li>
              </ul>
            </div>

            <button
              :disabled="processingTrackCreate || processingGPXFileUpload"
              class="button is-success"
              @click.prevent="saveTrack"
            >
              <span v-if="processingTrackCreate" class="icon">
                <font-awesome-icon icon="spinner" pulse />
              </span>
              <span>Add</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useMutation } from "@vue/apollo-composable";
import { ref } from "@vue/reactivity";
import gpxFileInfoMutation from "../graphql/gpxFileInfo.mutation.gql";
import trackCreateMutation from "../graphql/trackCreate.mutation.gql";
import TrackImageSelector from "../components/TrackImageSelector";

export default {
  components: {
    TrackImageSelector
  },
  setup() {
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
    const gpxFileUploadErrors = ref([]);
    const trackCreateErrors = ref([]);

    // gpx file upload
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
      gpxFileUploadErrors.value = errors.graphQLErrors;
    });

    // add track mutation
    const {
      mutate: doTrackCreate,
      onError: ontrackCreateMutationError,
      loading: processingTrackCreate
    } = useMutation(trackCreateMutation);
    ontrackCreateMutationError(errors => {
      trackCreateErrors.value = errors.graphQLErrors;
    });

    return {
      trackData,
      gpxFile,
      doGPXFileUpload,
      processingGPXFileUpload,
      gpxFileUploadErrors,
      doTrackCreate,
      processingTrackCreate,
      trackCreateErrors
    };
  },
  methods: {
    gpxFileChange(event) {
      if (!event.target.files.length) {
        return;
      }
      this.gpxFileUploadErrors = [];
      this.gpxFile = event.target.files[0];
      this.doGPXFileUpload({ file: this.gpxFile }).then(() => {});
    },
    saveTrack() {
      // add files
      if (this.gpxFile) {
        this.trackData.gpxFile = this.gpxFile;
      }
      let images = this.$refs.imageSelector.images;
      if (images.length) {
        this.trackData.images = images;
      }

      // make GQL inputs flat
      this.trackData.movingTimeHours = this.trackData.movingTime.hours;
      this.trackData.movingTimeMinutes = this.trackData.movingTime.minutes;
      this.trackData.stoppedTimeHours = this.trackData.stoppedTime.hours;
      this.trackData.stoppedTimeMinutes = this.trackData.stoppedTime.minutes;

      // create
      this.trackCreateErrors = [];
      this.doTrackCreate(this.trackData).then(() => {
        this.$router.push({ name: "toursMyTracks" });
      });
    }
  }
};
</script>
