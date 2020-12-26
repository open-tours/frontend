<template>
  <section class="section">
    <div class="container">
      <div class="columns is-centered">
        <form class="box" @submit="checkForm">
          <h1 class="title">
            Login
          </h1>
          <div class="field">
            <div class="control has-icons-left">
              <input
                class="input"
                placeholder="Email address"
                required
                type="email"
              />
              <span class="icon is-small is-left">
                <font-awesome-icon icon="envelope" />
              </span>
            </div>
          </div>
          <div class="field">
            <div class="control has-icons-left">
              <input
                class="input"
                placeholder="Password"
                required
                type="password"
              />
              <span class="icon is-small is-left">
                <font-awesome-icon icon="lock" />
              </span>
            </div>
          </div>
          <div class="field">
            <label class="checkbox" for="">
              <input type="checkbox" />
              Remember me
            </label>
          </div>
          <div class="field">
            <button class="button is-success">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  methods: {
    checkForm: function() {},
  },
};
</script>
