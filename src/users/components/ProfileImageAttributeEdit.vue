<template>
  <tr>
    <td>
      <strong>{{ name }}</strong>
    </td>
    <td>
      <div v-if="!processing">
        <img v-if="attributeValue" :src="attributeValue" class="image" />
      </div>
      <br />
      <div v-if="doEdit" class="file has-name is-fullwidth is-small">
        <label class="file-label">
          <input
            accept="image/jpg,image/jpeg,image/png"
            class="file-input"
            type="file"
            @change="save"
          />
          <span class="file-cta">
            <span class="file-icon">
              <font-awesome-icon v-if="!processing" icon="upload" />
              <font-awesome-icon v-else icon="spinner is-small" pulse />
            </span>
            <span v-if="!processing" class="file-label">
              Choose a file…
            </span>
          </span>
        </label>
      </div>
    </td>
    <td>
      <button v-if="!doEdit" class="is-small" @click="doEdit = true">
        <span class="icon is-small">
          <font-awesome-icon icon="pen" />
        </span>
      </button>
      <button v-else class="is-small is-danger" @click="doEdit = false">
        <span class="icon is-small">
          <font-awesome-icon icon="window-close" />
        </span>
      </button>
    </td>
  </tr>
  <tr v-if="error">
    <td colspan="3">
      <div class="notification is-danger">
        {{ error.graphQLErrors[0].message }}
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
    const { mutate: doUpdate, processing, error } = useMutation(
      userUpdateMutation
    );
    // TODO: error handling
    return {
      value,
      doUpdate,
      processing,
      error,
      doEdit
    };
  },
  methods: {
    save(event) {
      const files = event.target.files;
      if (files.length != 1) return;
      this.doUpdate({ [this.attributeName]: files[0] }).then(() => {
        this.$parent.refetch();
        this.doEdit = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.image {
  height: 100px;
}
</style>
