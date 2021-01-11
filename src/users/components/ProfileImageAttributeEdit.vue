<template>
  <tr>
    <td>
      <strong>{{ name }}</strong>
    </td>
    <td v-if="!doEdit"></td>
    <td>
      <button v-if="!doEdit" class="is-small" @click="doEdit = true">
        <span class="icon is-small">
          <font-awesome-icon icon="pen" />
        </span>
      </button>
      <div v-else class="file has-name is-fullwidth is-small">
        <label class="file-label">
          <input
            accept="image/jpg,image/jpeg,image/png"
            class="file-input"
            type="file"
            @change="save"
          />
          <span class="file-cta">
            <span v-if="!processingGPXFileUpload" class="file-icon">
              <font-awesome-icon icon="upload" />
            </span>
            <span v-if="!processingGPXFileUpload" class="file-label">
              Choose a file…
            </span>
            <span v-if="processingGPXFileUpload">
              <font-awesome-icon icon="spinner is-small" pulse />
            </span>
          </span>
          <span v-if="gpxFile" class="file-name">
            {{ gpxFile.name }}
          </span>
        </label>
      </div>
    </td>
  </tr>
</template>

<script>
import { useMutation } from "@vue/apollo-composable";
import { ref } from "vue";
import userUpdateMutation from "../graphql/userUpdate.mutation.gql";

export default {
  props: {
    name: String,
    attributeName: String,
    attributeValue: String
  },
  setup(props) {
    const doEdit = ref(false);
    const value = ref(props.attributeValue);
    const { mutate: doUpdate, loading } = useMutation(userUpdateMutation);
    // TODO: error handling
    return {
      value,
      doUpdate,
      loading,
      doEdit
    };
  },
  methods: {
    save(event) {
      const files = event.target.files;
      if (files.length != 1) return;
      this.doUpdate({ [this.attributeName]: files[0] }).then(() => {
        this.doEdit = false;
      });
    }
  }
};
</script>
