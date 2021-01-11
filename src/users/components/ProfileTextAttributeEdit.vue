<template>
  <tr>
    <td>
      <strong>{{ name }}</strong>
    </td>
    <td>
      <input v-if="doEdit" v-model="value" class="input is-small" />
      <span v-else>{{ value }}</span>
    </td>
    <td>
      <button v-if="!doEdit" @click="doEdit = true" class="is-small">
        <span class="icon is-small">
          <font-awesome-icon icon="pen" />
        </span>
      </button>
      <button v-else @click="save" :disabled="loading" class="is-small">
        <span class="icon is-small">
          <font-awesome-icon icon="check" />
        </span>
      </button>
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
    save() {
      this.doUpdate({ [this.attributeName]: this.value }).then(() => {
        this.doEdit = false;
      });
    }
  }
};
</script>
