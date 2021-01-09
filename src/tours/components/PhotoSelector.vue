<template>
  <div class="field">
    <label class="label">Add up to 10 photos</label>

    <span v-for="photos in photos" :key="photos.name">
      <div class="columns">
        <div class="column">{{ photos.name }}</div>
        <div class="column is-one-fifth">
          <button
            @click="fileDelete(photos.name)"
            class="button is-small is-danger is-pulled-right"
          >
            <span class="icon is-small">
              <font-awesome-icon icon="window-close" />
            </span>
          </button>
        </div>
      </div>
    </span>

    <div class="file has-name is-fullwidth">
      <label class="file-label">
        <input
          class="file-input"
          type="file"
          multiple
          accept="image/jpeg,image/jpg"
          @change="fileChange"
        />
        <span class="file-cta">
          <span v-if="!processingFileUpload" class="file-icon">
            <font-awesome-icon icon="upload" />
          </span>
          <span v-if="!processingFileUpload" class="file-label">
            Choose a JPEG file
          </span>
          <span v-if="processingFileUpload">
            <font-awesome-icon icon="spinner" pulse />
          </span>
        </span>
      </label>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";

export default {
  setup() {
    const processingFileUpload = ref(false);
    const photos = ref([]);
    return { photos, processingFileUpload };
  },
  methods: {
    fileChange(event) {
      for (const file of event.target.files) {
        this.photos.push(file);
      }
    },
    fileDelete(photoName) {
      let index = -1;
      for (const [i, photo] of this.photos.entries()) {
        if (photoName === photo.name) {
          index = i;
        }
      }
      if (index > -1) {
        this.photos.splice(index, 1);
      }
    }
  }
};
</script>
