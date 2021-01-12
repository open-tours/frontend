<template>
  <section v-if="logbook" class="hero is-primary is-large is-bold">
    <div
      class="hero-body"
      v-bind:style="{ backgroundImage: 'url(' + logbook.headerImage + ')' }"
    >
      <div class="container has-text-centered">
        <h1 class="title is-size-1">
          {{ logbook.title }}
        </h1>
      </div>
    </div>
  </section>

  <div v-if="logbook" class="container">
    <section class="articles">
      <div class="column is-8 is-offset-2">
        <div
          class="card article"
          v-for="track in logbook.tracks"
          :key="track.id"
        >
          <div class="card-content">
            <div class="media">
              <div class="media-center">
                <img
                  alt="Placeholder image"
                  class="author-image"
                  v-bind:src="track.owner.profileImage"
                />
              </div>
              <div class="media-content has-text-centered">
                <p class="title article-title">
                  {{ track.name }}
                </p>
                <p class="subtitle is-6 article-subtitle">
                  <a href="#">@{{ track.owner.name }}</a> on October 7, 2017
                </p>
              </div>
            </div>
            <div class="content article-body">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Accumsan lacus vel facilisis volutpat est velit egestas. Sapien
                eget mi proin sed. Sit amet mattis vulputate enim.
              </p>
              <p>
                Commodo ullamcorper a lacus vestibulum sed arcu. Fermentum leo
                vel orci porta non. Proin fermentum leo vel orci porta non
                pulvinar. Imperdiet proin fermentum leo vel. Tortor posuere ac
                ut consequat semper viverra. Vestibulum lectus mauris ultrices
                eros.
              </p>
              <h3 class="has-text-centered">
                “Everyone should be able to do one card trick, tell two jokes,
                and recite three poems, in case they are ever trapped in an
                elevator.”
              </h3>
              <p>
                In eu mi bibendum neque egestas congue quisque egestas diam.
                Enim nec dui nunc mattis enim ut tellus. Ut morbi tincidunt
                augue interdum velit euismod in. At in tellus integer feugiat
                scelerisque varius morbi enim nunc. Vitae suscipit tellus mauris
                a diam. Arcu non sodales neque sodales ut etiam sit amet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { useQuery, useResult } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import logbookQuery from "../graphql/logbook.query.gql";

export default {
  setup() {
    const router = useRouter();

    // cut logbook name from host bernhard.opentours.net => bernhard
    const host = window.location.host;
    const hostParts = host.split(".");
    if (hostParts.length != 3) {
      router.push({ name: "home" });
    }
    const { result, loading, error, onError } = useQuery(logbookQuery, {
      subdomain: hostParts[0]
    });
    const logbook = useResult(result, null, data => data.logbook);
    onError(() => {
      router.push({ name: "404" });
    });

    return { logbook, loading, error };
  }
};
</script>

<style lang="scss" scoped>
.hero-body {
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  height: 500px;
}
.articles {
  margin: 5rem 0;
  margin-top: -200px;
  .content {
    p {
      line-height: 1.9;
      margin: 15px 0;
    }
  }
}
.author-image {
  position: absolute;
  top: -30px;
  left: 50%;
  width: 60px;
  height: 60px;
  margin-left: -30px;
  border: 3px solid #ccc;
  border-radius: 50%;
}
.media-center {
  display: block;
  margin-bottom: 1rem;
}
.media-content {
  margin-top: 3rem;
}
.article {
  margin-top: 6rem;
}
.promo-block {
  margin-top: 6rem;
}
div.column.is-8 {
  &:first-child {
    padding-top: 0;
    margin-top: 0;
  }
}
.article-title {
  font-size: 2rem;
  font-weight: lighter;
  line-height: 2;
}
.article-subtitle {
  color: #909aa0;
  margin-bottom: 3rem;
}
.article-body {
  line-height: 1.4;
  margin: 0 6rem;
}
</style>
