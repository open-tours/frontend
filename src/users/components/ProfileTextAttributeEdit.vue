<template>
  <tr>
    <td>
      <strong>{{ name }}</strong>
    </td>
    <td>
      <input
        v-if="doEdit"
        v-model="value"
        v-on:keyup.enter="save"
        class="input is-small"
      />
      <span v-else>{{ value }}</span>
    </td>
    <td>
      <button v-if="!doEdit" @click="doEdit = true" class="is-small">
        <span class="icon is-small">
          <font-awesome-icon icon="pen" />
        </span>
      </button>
      <button v-else @click="save" :disabled="processing" class="is-small">
        <span class="icon is-small">
          <font-awesome-icon v-if="!processing" icon="check" />
          <font-awesome-icon v-else icon="spinner" pulse />
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
import userUpdateMutation from "../graphql/userUpdate.mutation.gql";
import { ref } from "vue";

export default {
  props: {
    name: String,
    attributeName: String,
    attributeValue: String
  },
  setup(props) {
    const doEdit = ref(false);
    const value = ref(props.attributeValue);
    const { mutate: doUpdate, loading: processing, error } = useMutation(
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
    save() {
      this.doUpdate({ [this.attributeName]: this.value }).then(() => {
        this.$parent.refetch();
        this.doEdit = false;
      });
    }
  }
};
</script>
