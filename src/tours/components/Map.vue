<template>
  <div id="map"></div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.fullscreen/Control.FullScreen";
import "leaflet.fullscreen/Control.FullScreen.css";

export default {
  setup() {},
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
        }
        this.map.flyToBounds(bounds, {
          animate: true,
          duration: 1.0,
          easeLinearity: 0.1
        });
      }
    }
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      L.Icon.Default.imagePath = ".";
      // eslint-disable-next-line
      delete L.Icon.Default.prototype._getIconUrl;
      this.map = L.map("map", {
        renderer: L.canvas({ padding: 2.0 }),
        fullscreenControl: {
          pseudoFullscreen: false // if true, fullscreen to page width and height
        }
      });

      this.mainLayerGroup = L.layerGroup().addTo(this.map);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank"> OpenStreetMap</a> contributors, &copy;'
      }).addTo(this.mainLayerGroup);
      this.map.setView([0, 0], 3);
    }
  }
};
</script>

<style>
#map {
  height: 300px;
  width: 100%;
}
</style>
