<template>
  <div id="map" class="map"></div>
</template>

<script>
import L from "leaflet";
import "@runette/leaflet-fullscreen/dist/Leaflet.fullscreen";
import "@runette/leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet/dist/leaflet.css";
import { onMounted, ref } from "vue";

export default {
  setup() {
    const map = ref();
    const mainLayerGroup = ref();

    onMounted(() => {
      delete L.Icon.Default.prototype._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
        iconUrl: require("leaflet/dist/images/marker-icon.png"),
        shadowUrl: require("leaflet/dist/images/marker-shadow.png")
      });

      map.value = L.map("map", {
        renderer: L.svg({ padding: 2.0 }),
        fullscreenControl: {
          pseudoFullscreen: false // if true, fullscreen to page width and height
        }
      });

      mainLayerGroup.value = L.layerGroup().addTo(map.value);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank"> OpenStreetMap</a> contributors, &copy;'
      }).addTo(mainLayerGroup.value);
      map.value.setView([0, 0], 3);
    });

    return {
      map,
      mainLayerGroup
    };
  },
  props: {
    geojsonLayers: Array
  },
  watch: {
    geojsonLayers: {
      deep: true,
      handler(layers) {
        // get bounds of all geo objects and fit map bound to it
        const bounds = [];
        for (const layer of layers) {
          const geojsonlayer = L.geoJSON(layer);
          bounds.push(geojsonlayer.getBounds());
          geojsonlayer.addTo(this.mainLayerGroup);

          // add start / end markers
          const coordinates = layer.coordinates;
          L.marker([coordinates[0][1], coordinates[0][0]]).addTo(this.map);
          L.marker([
            coordinates[coordinates.length - 1][1],
            coordinates[coordinates.length - 1][0]
          ]).addTo(this.map);
        }

        // fly to layer bounds
        this.map.flyToBounds(bounds);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.map {
  height: 300px;
  width: 100%;
}
</style>
