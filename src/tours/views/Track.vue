<template>
  <section v-if="track.id" class="hero is-primary is-small">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">
          <h1 class="title">{{ track.name }}</h1>
        </h1>
        <h2 class="subtitle">{{ startEndDate }} - by {{ track.owner.name }}</h2>
      </div>
    </div>
  </section>

  <div class="content">
    <div class="columns">
      <div class="column">
        <Map
          ref="mapRef"
          style="width: 100%; height: 100%; min-height: 350px;"
          :geojsonLayers="geojsonLayers"
        ></Map>
      </div>

      <div
        v-if="
          track.previewImages && track.previewImages.length && imageIndex > -1
        "
        class="column is-one-quarter"
      >
        <figure class="image" @click="showNextImage">
          <img :src="track.previewImages[imageIndex].url" alt="Track photo" />
          <figcaption
            class="caption has-text-right is-overlay"
            style="top: auto;"
          >
            <span class="tag is-info"
              >{{ imageIndex + 1 }} / {{ track.previewImages.length }}</span
            >
          </figcaption>
          <figcaption
            class="caption is-overlay"
            style="top: auto; cursor: pointer;"
          >
            <span
              v-if="track.previewImages[imageIndex].longitude"
              class="tag is-info"
            >
              <span class="icon is-small" @click="openImageOverlay">
                <font-awesome-icon icon="search-plus" />
              </span>
            </span>
            <span
              v-if="track.previewImages[imageIndex].longitude"
              class="tag is-info"
            >
              <span
                class="icon is-small"
                @click="zoomToImageOnMap(imageIndex, $event)"
              >
                <font-awesome-icon icon="map-marked-alt" />
              </span>
            </span>
          </figcaption>
        </figure>
      </div>
    </div>
  </div>

  <div
    v-if="imageOverlayActive"
    @keydown.esc="closeImageOverlay"
    class="modal"
    :class="{ 'is-active': imageOverlayActive }"
    tabindex="0"
  >
    <div class="modal-background"></div>
    <div class="modal-content">
      <p class="image">
        <img
          @click="showNextImage"
          :src="track.previewImages[imageIndex].url"
        />
      </p>
    </div>
    <button
      @click="closeImageOverlay"
      class="modal-close is-large"
      aria-label="close"
    ></button>
  </div>
</template>

<script>
import { formatDate } from "@/utils/filters";
import { useQuery, useResult } from "@vue/apollo-composable";
import axios from "axios";
import L from "leaflet";

import { ref } from "vue";
import { useRoute } from "vue-router";
import Map from "../components/Map";
import trackQuery from "../graphql/track.query.gql";

export default {
  setup() {
    const geojsonLayers = ref([]);
    const imageIndex = ref(-1);
    const imageOverlayActive = ref(false);
    const mapRef = ref(null);
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
    const route = useRoute();

    const { result, onResult: onTrackQueryResult } = useQuery(trackQuery, {
      id: route.params.id
    });
    const track = useResult(result, {}, d => d.track);

    onTrackQueryResult(() => {
      // push goejson layers to map
      axios.get(track.value.geojson).then(function(response) {
        geojsonLayers.value.push(response.data);
      });

      // add photo markers
      if (!track.value.previewImages || !track.value.previewImages.length) {
        return;
      }

      for (const image of track.value.previewImages) {
        if (image.latitude === null) {
          continue;
        }

        const icon = L.icon({
          iconUrl: image.url,
          iconSize: [64, -1], // size of the icon
          iconAnchor: [0, 80], // point of the icon which will correspond to marker's location
          popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
        });
        L.marker([image.latitude, image.longitude], { icon: icon }).addTo(
          mapRef.value.map
        );
        L.marker([image.latitude, image.longitude]).addTo(mapRef.value.map);
      }
    });

    return {
      track,
      trackData,
      geojsonLayers,
      imageIndex,
      mapRef,
      imageOverlayActive
    };
  },
  components: {
    Map
  },
  methods: {
    showNextImage: function() {
      const newIndex = this.imageIndex + 1;
      const images = this.track.previewImages;

      if (images && newIndex === images.length) {
        this.imageIndex = 0;
      } else {
        this.imageIndex = newIndex;
      }
    },
    zoomToImageOnMap: function(index, event) {
      event.stopPropagation();
      const image = this.track.previewImages[index];
      this.mapRef.map.flyTo([image.latitude, image.longitude], 14);
    },
    openImageOverlay: function() {
      this.imageOverlayActive = true;
    },
    closeImageOverlay: function() {
      this.imageOverlayActive = false;
    }
  },
  mounted() {
    this.showNextImage();
  },
  computed: {
    startEndDate() {
      let startEndDate = formatDate(this.track.startDate);
      if (this.track.endDate) {
        startEndDate += ` - ${formatDate(this.track.endDate)}`;
      }
      return startEndDate;
    }
  }
};
</script>
