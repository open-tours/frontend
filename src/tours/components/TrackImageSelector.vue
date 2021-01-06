<template>
  <div class="field">
    <label class="label">Add up to 10 images</label>

    <span v-for="image in images" :key="image.name">
      <div class="columns">
        <div class="column">{{ image.name }}</div>
        <div class="column is-one-fifth">
          <button
            @click="fileDelete(image.name)"
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
        <input class="file-input" type="file" multiple accept="image/jpeg,image/jpg" @change="fileChange" />
        <span class="file-cta">
          <span v-if="!processingFileUpload" class="file-icon">
            <font-awesome-icon icon="upload" />
          </span>
          <span v-if="!processingFileUpload" class="file-label">
            Choose a JPEG image
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
    const images = ref([]);
    return { images, processingFileUpload };
  },
  methods: {
    fileChange(event) {
      for (const file of event.target.files) {
        this.images.push(file);
      }
    },
    fileDelete(imageName) {
      let index = -1;
      for (const [i, image] of this.images.entries()) {
        if (imageName === image.name) {
          index = i;
        }
      }
      if (index > -1) {
        this.images.splice(index, 1);
      }
    }
  }
};
</script>
