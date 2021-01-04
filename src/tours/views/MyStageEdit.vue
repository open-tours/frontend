<template>
  <div class="section">
    <div class="columns">
      <div class="column is-three-fifths">
        <form class="box" @submit.prevent="submitForm">
          <h1 class="title">
            Add Stage
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
                  name="resume"
                  type="file"
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
              <input v-model="stageData.name" class="input" type="text" />
            </div>
          </div>

          <div class="field">
            <label class="label">Description</label>
            <div class="control">
              <input
                v-model="stageData.description"
                class="input"
                type="text"
              />
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
            <div v-if="stageCreateErrors.length" class="notification is-danger">
              <ul>
                <li v-for="error in stageCreateErrors" :key="error">
                  {{ error.message }}
                </li>
              </ul>
            </div>

            <button
              :disabled="processingStageCreate || processingGPXFileUpload"
              class="button is-success"
              @click="addStage"
            >
              <span v-if="processingStageCreate" class="icon">
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
import { useMutation, useQuery, useResult } from "@vue/apollo-composable";
import { ref } from "@vue/reactivity";
import { useRoute } from "vue-router";
import stageQuery from "../graphql/stage.query.gql";
import gpxFileInfoMutation from "../graphql/gpxFileInfo.mutation.gql";
import stageCreateMutation from "../graphql/stageCreate.mutation.gql";

export default {
  setup() {
    const stageData = ref({
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
    const stageCreateErrors = ref([]);
    const route = useRoute();

    const { result } = useQuery(stageQuery, {
      id: route.params.id
    });
    const stage = useResult(result, {}, d => d.stage);

    // gpx file upload
    const {
      mutate: doGPXFileUpload,
      onDone: onGPXFileUploadDone,
      onError: onGPXFileUploadError,
      loading: processingGPXFileUpload
    } = useMutation(gpxFileInfoMutation);
    onGPXFileUploadDone(result => {
      stageData.value = result.data.gpxFileInfo;
    });
    onGPXFileUploadError(errors => {
      gpxFileUploadErrors.value = errors.graphQLErrors;
    });

    // add stage mutation
    const {
      mutate: doStageCreate,
      onDone: onstageCreateMutationDone,
      onError: onstageCreateMutationError,
      loading: processingStageCreate
    } = useMutation(stageCreateMutation);
    onstageCreateMutationDone(result => {
      stageData.value = result.data.gpxFileInfo;
    });
    onstageCreateMutationError(errors => {
      stageCreateErrors.value = errors.graphQLErrors;
    });

    return {
      stage,
      stageData,
      gpxFile,
      doGPXFileUpload,
      processingGPXFileUpload,
      gpxFileUploadErrors,
      doStageCreate,
      processingStageCreate,
      stageCreateErrors
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
    addStage() {
      if (this.gpxFile) {
        this.stageData.gpxFile = this.gpxFile;
      }

      // make GQL inputs flat
      this.stageData.movingTimeHours = this.stageData.movingTime.hours;
      this.stageData.movingTimeMinutes = this.stageData.movingTime.minutes;
      this.stageData.stoppedTimeHours = this.stageData.stoppedTime.hours;
      this.stageData.stoppedTimeMinutes = this.stageData.stoppedTime.minutes;

      // create
      this.stageCreateErrors = [];
      this.doStageCreate(this.stageData).then(() => {
        this.$router.push({ name: "toursMyStages" });
      });
    }
  }
};
</script>
