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
        v-if="track.photos && track.photos.length && activePhotoIndex > -1"
        class="column is-one-quarter"
      >
        <figure class="image" @click="showNextImage">
          <img
            :src="track.photos[activePhotoIndex].previewUrl"
            alt="Track photo"
          />
          <figcaption
            class="caption has-text-right is-overlay"
            style="top: auto;"
          >
            <span class="tag is-info"
              >{{ activePhotoIndex + 1 }} / {{ track.photos.length }}</span
            >
          </figcaption>
          <figcaption
            class="caption is-overlay"
            style="top: auto; cursor: pointer;"
          >
            <span
              v-if="track.photos[activePhotoIndex].longitude"
              class="tag is-info"
            >
              <span class="icon is-small" @click="openImageOverlay">
                <font-awesome-icon icon="search-plus" />
              </span>
            </span>
            <span
              v-if="track.photos[activePhotoIndex].longitude"
              class="tag is-info"
            >
              <span
                class="icon is-small"
                @click="zoomToImageOnMap(activePhotoIndex, $event)"
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
    v-if="photoOverlayActive"
    @keydown.esc="closeImageOverlay"
    class="modal"
    :class="{ 'is-active': photoOverlayActive }"
    tabindex="0"
  >
    <div class="modal-background"></div>
    <div class="modal-content">
      <p class="image">
        <img
          @click="showNextImage"
          :src="track.photos[activePhotoIndex].previewUrl"
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
    const activePhotoIndex = ref(-1);
    const photoOverlayActive = ref(false);
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
      if (!track.value.photos || !track.value.photos.length) {
        return;
      }

      for (const [index, image] of track.value.photos.entries()) {
        if (image.latitude === null) {
          continue;
        }

        const icon = L.icon({
          iconUrl: image.iconUrl,
          iconSize: [64, -1], // size of the icon
          iconAnchor: [0, 80], // point of the icon which will correspond to marker's location
          popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
        });
        L.marker([image.latitude, image.longitude], { icon: icon })
          .addTo(mapRef.value.map)
          .on("click", function() {
            activePhotoIndex.value = index;
          });
        L.marker([image.latitude, image.longitude]).addTo(mapRef.value.map);
      }
    });

    return {
      track,
      trackData,
      geojsonLayers,
      activePhotoIndex,
      mapRef,
      photoOverlayActive
    };
  },
  components: {
    Map
  },
  methods: {
    showNextImage: function() {
      const newIndex = this.activePhotoIndex + 1;
      const images = this.track.photos;

      if (images && newIndex === images.length) {
        this.activePhotoIndex = 0;
      } else {
        this.activePhotoIndex = newIndex;
      }
    },
    zoomToImageOnMap: function(index, event) {
      event.stopPropagation();
      const image = this.track.photos[index];
      this.mapRef.map.flyTo([image.latitude, image.longitude], 14);
    },
    openImageOverlay: function(event) {
      event.stopPropagation();
      this.photoOverlayActive = true;
    },
    closeImageOverlay: function() {
      this.photoOverlayActive = false;
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
